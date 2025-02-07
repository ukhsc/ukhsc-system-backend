import { z } from "zod";
import process from "process";
import console from "console";

const envSchema = z
  .object({
    DATABASE_URL: z.string(),
    DIRECT_DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string(),
    ARGON2_SECRET: z.string().optional(),
    CURRENT_ENVIRONMENT: z.string().optional(),
    IS_PRODUCTION: z.boolean().default(false),
    SENTRY_DSN: z.string().optional(),
    SENTRY_RELEASE: z.string().optional(),

    // OAuth
    GOOGLE_OAUTH_CLIENT_ID: z.string().default(""),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().default(""),

    // Mail Verification
    RESEND_API_KEY: z.string().optional(),
    RESEND_QUOTA: z.number().default(100),

    FALLBACK_SMTP_HOST: z.string().optional(),
    FALLBACK_SMTP_USER: z.string().optional(),
    FALLBACK_SMTP_PASS: z.string().optional(),
    FALLBACK_SMTP_QUOTA: z.number().default(500),
  })
  .refine(
    (data) => {
      if (data.IS_PRODUCTION) return data.SENTRY_DSN !== undefined;
      return true;
    },
    {
      message: "SENTRY_DSN is required in production environment",
      path: ["SENTRY_DSN"],
    },
  )
  .refine(
    (data) => {
      if (data.IS_PRODUCTION)
        return (
          data.FALLBACK_SMTP_HOST !== undefined &&
          data.FALLBACK_SMTP_USER !== undefined &&
          data.FALLBACK_SMTP_PASS !== undefined
        );
      return true;
    },
    {
      message:
        "FALLBACK_SMTP_HOST, FALLBACK_SMTP_USER, FALLBACK_SMTP_PASS are required in production environment",
      path: ["FALLBACK_SMTP_HOST", "FALLBACK_SMTP_USER", "FALLBACK_SMTP_PASS"],
    },
  );

export type EnvConfig = z.infer<typeof envSchema>;

export function initEnv(): EnvConfig {
  console.log("🔍 Initializing environment variables...");
  const result = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    ARGON2_SECRET: process.env.ARGON2_SECRET,
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
