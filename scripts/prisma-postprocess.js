import { readFileSync, writeFileSync } from "node:fs";
import console from "node:console";
import process from "node:process";

const GENERATED_FILE_PATH = "prisma/schema/generated/zod/index.ts";

// TODO: This is a temporary fix to https://github.com/chrishoermann/zod-prisma-types/issues/306
function fixPrismaTypes() {
  try {
    const content = readFileSync(GENERATED_FILE_PATH, "utf8");
    const updatedContent = content.replace(
      /Prisma\.updateMany([a-zA-Z]+)CreateManyAndReturnArgs/g,
      "Prisma.$1UpdateManyAndReturnArgs",
    );
    writeFileSync(GENERATED_FILE_PATH, updatedContent);
    console.log("\u001b[92m✔\u001b[0m Prisma postprocess complete");
  } catch (error) {
    console.error("\u001b[91m✘\u001b[0m Prisma postprocess failed:", error);
    process.exit(1);
  }
}

fixPrismaTypes();
