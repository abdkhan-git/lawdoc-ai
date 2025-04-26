import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

const pinecone = new Pinecone(); // ✅ Load Pinecone client once

export const getPineconeClient = async () => {
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  console.log("Downloading from S3 into file system...");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not download file from S3.");
  }

  console.log("Loading PDF into memory:", file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  console.log("Splitting and preparing documents...");
  const documents = await Promise.all(pages.map(prepareDocument));

  console.log("Embedding documents...");
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  console.log("Uploading to Pinecone...");
  const client = await getPineconeClient();

  const pineconeIndexName = process.env.PINECONE_INDEX_NAME!; // ✅ ENV variable
  const pineconeIndex = await client.index(pineconeIndexName);

  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  await namespace.upsert(vectors);

  console.log(`Upload complete: Inserted ${vectors.length} vectors.`);
  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.error("Error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  const { pageContent: rawPageContent, metadata } = page;
  const pageContent = rawPageContent.replace(/\n/g, "");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}