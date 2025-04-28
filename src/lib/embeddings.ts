/**
 * Generates vector embeddings for text using OpenAI's embedding model
 * 
 * This function converts text into numerical vector representations (embeddings)
 * that capture semantic meaning, enabling semantic search and similarity comparisons.
 * 
 * @param text - The text to convert into embeddings
 * @returns A numerical vector (array of numbers) representing the text
 */
export async function getEmbeddings(text: string) {

  // In development mode, generate fake random embeddings for testing
  // This avoids using the OpenAI API during development to save costs and time
  if (process.env.NODE_ENV === "development") {

    // Log a message to indicate that fake embeddings are being used
    console.log("[Dev Mode] Using fake embeddings for testing.");

    // Create an array of 1536 random values (matching OpenAI's embedding dimension)
    return new Array(1536).fill(0).map(() => Math.random());
  }

  // In production, use the actual OpenAI API to generate embeddings
  try {
    // Make a request to OpenAI's embeddings API
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // API key from environment variables
      },
      body: JSON.stringify({
        input: text, // The text to embed
        model: "text-embedding-ada-002", // OpenAI's embedding model
      }),
    });

    
    // Parse the JSON response
    const result = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error("OpenAI API Error:", result);
      throw new Error(result.error?.message || "Failed to fetch embeddings");
    }

    // Validate the response format
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Invalid OpenAI embedding response format:", result);
      throw new Error("Invalid OpenAI embedding response");
    }

    // Return the embedding vector from the response
    return result.data[0].embedding as number[];
  } catch (error) {
    // Log and re-throw any errors that occur
    console.error("Error calling OpenAI Embeddings API:", error);
    throw error;
  }
}
