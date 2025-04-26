import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    host: "ep-calm-mode-a4iqpr7y-pooler.us-east-1.aws.neon.tech",
    port: 5432,
    user: "neondb_owner",
    password: "npg_sVDjuznk57RK",
    database: "neondb",
    ssl: true
  },
} satisfies Config;