import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Define an enum type for message roles to distinguish between system and user messages
export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);


/**
 * Chats table - Stores information about each chat session
 * Each chat is associated with a specific PDF document and user
 * Contains metadata about the document including its name, URL, and S3 file key
 */
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  fileKey: text("file_key").notNull(),
});

// Type inference helper for the chats table
export type DrizzleChat = typeof chats.$inferSelect;


/**
 * Messages table - Stores individual messages within a chat
 * Each message belongs to a specific chat and has content, timestamp, and role (user/system)
 * The foreign key relationship ensures messages are associated with valid chats
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});


/**
 * UserSubscriptions table - Manages user subscription data for premium features 
 * Stores Stripe-related information including customer ID, subscription ID, and billing period 
 * This enables the application to check subscription status and manage access to premium features
 */
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
});
