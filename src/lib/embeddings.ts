
export async function getEmbeddings(text: string) {
    // If you're in development mode, fake embeddings
    if (process.env.NODE_ENV === "development") {
      console.log("[Dev Mode] Using fake embeddings for testing.");
      return new Array(1536).fill(0).map(() => Math.random());
    }
  
    // Otherwise, use real OpenAI API in production
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: text,
          model: "text-embedding-ada-002",
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error("OpenAI API Error:", result);
        throw new Error(result.error?.message || "Failed to fetch embeddings");
      }
  
      if (!result.data || !Array.isArray(result.data)) {
        console.error("Invalid OpenAI embedding response format:", result);
        throw new Error("Invalid OpenAI embedding response");
      }
  
      return result.data[0].embedding as number[];
    } catch (error) {
      console.error("Error calling OpenAI Embeddings API:", error);
      throw error;
    }
  }
  