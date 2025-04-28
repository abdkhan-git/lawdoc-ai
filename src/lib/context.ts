import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

// Initialize Pinecone client once to avoid multiple connections
// Pinecone is a vector database used for semantic search
const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!, // API key from environment variables
});


/**
 * Retrieves similar document chunks from Pinecone based on vector embeddings
 * 
 * @param embeddings - Vector representation of text (array of numbers)
 * @param fileKey - Unique identifier for the document
 * @returns Array of matches with their similarity scores and metadata
 */
export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    // Connect to the specific index in Pinecone
    const pineconeIndex = client.index("lawdoc-ai");
    

    // Use the fileKey (converted to ASCII) as the namespace
    // This allows for document-specific searches
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));


    // Query Pinecone for the most similar vectors
    const queryResult = await namespace.query({
      topK: 5,                // Return the 5 most similar chunks
      vector: embeddings,     // The query vector to compare against
      includeMetadata: true,  // Include the text content in results
    });

    // Return the matches with their similarity scores and metadata
    return queryResult.matches || [];
  } catch (error) {
    console.error("Error querying embeddings:", error);
    throw error;
  }
}


/**
 * Main function to retrieve relevant context for a user query
 * 
 * @param query - The user's question or input text
 * @param fileKey - Identifier for the document being queried
 * @returns Concatenated text from the most relevant document chunks
 */
export async function getContext(query: string, fileKey: string) {
  // Convert the user query to vector embeddings
  const queryEmbeddings = await getEmbeddings(query);
  
  
  // Find similar document chunks using the embeddings
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  
  // Filter out low-quality matches (below 0.7 similarity score)
  // This ensures only relevant content is returned
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  // Define the expected metadata structure
  type Metadata = {
    text: string;       // The actual text content
    pageNumber: number; // Page number in the original document
  };

  // Extract just the text content from each match
  const docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  // Join all relevant text chunks and limit to 3000 characters
  // This prevents context windows from being too large for the AI
  return docs.join("\n").substring(0, 3000);
}
