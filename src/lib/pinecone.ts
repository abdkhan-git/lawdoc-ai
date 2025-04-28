import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

// Initialize Pinecone client once to avoid multiple connections
const pinecone = new Pinecone();


/**
 * Returns the initialized Pinecone client
 * This pattern allows for singleton access to the client throughout the app
 */
export const getPineconeClient = async () => {
  return pinecone;
};


/**
 * Type definition for a PDF page as returned by the PDFLoader
 * Contains the actual content and metadata about the page location
 */
type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};


/**
 * Main function to process a PDF from S3 and load it into Pinecone vector database
 * 
 * This function handles the entire pipeline:
 * 1. Download PDF from S3
 * 2. Load and parse the PDF
 * 3. Split content into manageable chunks
 * 4. Generate embeddings for each chunk
 * 5. Upload vectors to Pinecone for semantic search
 * 
 * @param fileKey - The S3 key of the file to process
 * @returns The first document from the processed documents array
 */
export async function loadS3IntoPinecone(fileKey: string) {
  // Step 1: Download the PDF from S3 to local filesystem
  console.log("Downloading from S3 into file system...");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not download file from S3.");
  }


  // Step 2: Load the PDF into memory using LangChain's PDFLoader
  console.log("Loading PDF into memory:", file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];


  // Step 3: Split PDF pages into smaller chunks for better processing
  console.log("Splitting and preparing documents...");
  const documents = await Promise.all(pages.map(prepareDocument));


  // Step 4: Generate embeddings for each document chunk
  console.log("Embedding documents...");
  const vectors = await Promise.all(documents.flat().map(embedDocument));


  // Step 5: Upload the vectors to Pinecone
  console.log("Uploading to Pinecone...");
  const client = await getPineconeClient();


  // Get the index name from environment variables
  const pineconeIndexName = process.env.PINECONE_INDEX_NAME!;
  const pineconeIndex = await client.index(pineconeIndexName);


  // Create a namespace based on the file key to organize vectors by document
  // Using ASCII conversion to ensure namespace compatibility
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  await namespace.upsert(vectors);

  // Log the number of vectors uploaded
  console.log(`Upload complete: Inserted ${vectors.length} vectors.`);


  // Return the first document for further processing
  return documents[0];
}

/**
 * Generates an embedding vector for a document and prepares it for Pinecone
 * 
 * @param doc - The document to embed
 * @returns A Pinecone record with the document's embedding and metadata
 */
async function embedDocument(doc: Document) {
  try {
    // Generate embeddings for the document content
    const embeddings = await getEmbeddings(doc.pageContent);
    

    // Create a unique ID using MD5 hash of the content
    const hash = md5(doc.pageContent);


    // Return a properly formatted Pinecone record
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

/**
 * Utility function to truncate a string to a specific byte length
 * This is useful for staying within metadata size limits
 * 
 * @param str - The string to truncate
 * @param bytes - The maximum number of bytes
 * @returns The truncated string
 */
export const truncateStringByBytes = (str: string, bytes: number) => {
  // Create a TextEncoder to measure byte length
  const enc = new TextEncoder();

  // Encode the string and slice it to the desired byte length
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};



/**
 * Prepares a PDF page for processing by:
 * 1. Cleaning the content (removing newlines)
 * 2. Splitting it into smaller chunks using LangChain's text splitter
 * 3. Adding appropriate metadata
 * 
 * @param page - The PDF page to process
 * @returns An array of Document objects ready for embedding
 */
async function prepareDocument(page: PDFPage) {
  // Extract content and metadata, removing newlines for cleaner text
  const { pageContent: rawPageContent, metadata } = page;
  const pageContent = rawPageContent.replace(/\n/g, "");


  // Initialize the text splitter with specific chunk size and overlap settings
  // This helps create semantically meaningful chunks while maintaining context
  const splitter = new RecursiveCharacterTextSplitter({
    // Each chunk will be ~1000 characters
    chunkSize: 1000,    

    // 200 character overlap between chunks preserves context
    chunkOverlap: 200,  
  });

  // Split the document into chunks and add metadata
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        // Truncate text to 36KB to stay within Pinecone metadata limits
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}