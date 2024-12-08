import { z } from "zod";
import process from "process";
import console from "console";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  CURRENT_ENVIRONMENT: z.string().optional(),

  // OAuth
  GOOGLE_OAUTH_CLIENT_ID: z.string().default(""),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().default(""),
});

export type EnvConfig = z.infer<typeof envSchema>;

const env = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CURRENT_ENVIRONMENT: process.env.CURRENT_ENVIRONMENT,

  // OAuth
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
});

if (!env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env.error.errors, null, 2));
  process.exit(1);
}

export default env.data;
