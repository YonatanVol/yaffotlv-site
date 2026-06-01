import { defineConfig } from "drizzle-kit";

// Shares the same Neon database as the root yaffotlv-site app.
// `tablesFilter` scopes every drizzle-kit operation (generate/migrate/introspect)
// to `sp_*` tables ONLY, so the rental app's tables are never touched.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  tablesFilter: ["sp_*"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
