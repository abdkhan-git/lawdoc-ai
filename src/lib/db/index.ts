import { neon, neonConfig } from "@neondatabase/serverless"; // Neon PostgreSQL serverless client
import { drizzle } from "drizzle-orm/neon-http"; // Drizzle ORM adapter for Neon

// Enable connection caching for better performance
// This prevents creating a new connection for every database operation
neonConfig.fetchConnectionCache = true;


// Validate that the DATABASE_URL environment variable is set
// This is a critical check to ensure the application can connect to the database
if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}

// Initialize the SQL client with the database connection string
// This creates the low-level connection to the Neon PostgreSQL database
const sql = neon(process.env.DATABASE_URL);


// Create and export the Drizzle ORM instance
// This provides a type-safe interface for database operations
export const db = drizzle(sql);
