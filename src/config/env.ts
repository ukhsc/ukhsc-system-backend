import { z } from "zod";
import process from "process";
import console from "console";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const env = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});

if (!env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env.error.errors, null, 2));
  process.exit(1);
}

export default env.data;
