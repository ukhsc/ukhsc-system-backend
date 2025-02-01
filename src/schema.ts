import { z as fixedZod } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { PartnerSchoolSchema, StudentMemberSchema } from "../prisma/schema/generated/zod";
import { GrantFlows } from "@services/federated_account";
import { KnownErrorCode } from "@utils/error";

export * from "../prisma/schema/generated/zod";

// TODO: fix the workaround for zod-to-openapi
// See Also: https://github.com/cloudflare/chanfana/issues/167
extendZodWithOpenApi(fixedZod);
export const z = fixedZod;

// TODO: z.coerce.date() rendered as nullable
// See also: https://github.com/asteasolutions/zod-to-openapi/issues/286
export const StudentMemberSchemaPublic = StudentMemberSchema.omit({
  password_hash: true,
}).extend({
  is_activated: z.boolean(),
  attended_school: PartnerSchoolSchema,
});

export const KnownErrorSchema = z
  .object({
    code: z.nativeEnum(KnownErrorCode).describe("已知錯誤代號"),
  })
  .openapi("標準已知錯誤回應格式");
export const InternalErrorResponseSchema = z
  .object({
    error: z.string().describe("錯誤訊息").openapi({ example: "Internal Server Error" }),
  })
  .openapi("內部錯誤回應格式");

export const FederateOAuthSchema = z
  .object({
    flow: z.nativeEnum(GrantFlows).describe("授權流程"),
    grant_value: z.string().describe("社群帳號提供者的授權資訊（取決於授權流程）"),
    redirect_uri: z
      .string()
      .url()
      .optional()
      .describe(
        "授權完成後的重新導向網址（必須與前端取得授權碼的網址相同）\n\n若授權認證流程（`flow`）為 `token`，則此欄位不需要",
      ),
  })
  .openapi("社群帳號的 OAuth 認證資訊");

export const TokenResponseSchema = z
  .object({
    access_token: z.string().describe("存取權杖"),
    refresh_token: z.string().describe("更新權杖"),
  })
  .openapi("權杖資訊");
