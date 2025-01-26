import { z } from "zod";
import process from "process";
import console from "console";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  CURRENT_ENVIRONMENT: z.string().optional(),
  IS_PRODUCTION: z.boolean().default(false),
  SENTRY_DSN: z.string().optional(),

  // OAuth
  GOOGLE_OAUTH_CLIENT_ID: z.string().default(""),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().default(""),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function initEnv(): EnvConfig {
  console.log("🔍 Initializing environment variables...");
  const result = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CURRENT_ENVIRONMENT: process.env.CURRENT_ENVIRONMENT,
    IS_PRODUCTION: process.env.IS_PRODUCTION === "true",
    SENTRY_DSN: process.env.SENTRY_DSN,

    // OAuth
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  });

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(result.error.errors, null, 2),
    );
    process.exit(1);
  }

  console.log("✅ Environment variables initialized");
  return result.data;
}
