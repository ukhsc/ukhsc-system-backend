import * as argon2 from "argon2";
import { Buffer } from "buffer";
import { createHash } from "crypto";
import { getCtx } from "index";

export function simpleHash(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function hashWithSalt(data: string): Promise<string> {
  const secret = getCtx().env.ARGON2_SECRET;
  let buffer: Buffer | undefined;
  if (secret) {
    buffer = Buffer.from(secret);
  }

  return await argon2.hash(data, { secret: buffer });
}
