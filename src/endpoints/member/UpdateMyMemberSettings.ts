import { OpenAPIRoute } from "chanfana";

import { AppContext } from "index";
import { MemberSettingsSchema } from "schema";

import {
  AuthService,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  UserRole,
} from "@services/auth";
import {
  ConflictError,
  InternalError,
  KnownErrorCode,
  UnprocessableEntityError,
} from "@utils/error";

export default class UpdateMyMemberSettings extends OpenAPIRoute {
  schema = {
    tags: ["學生會員"],
    summary: "更新目前會員的設定",
    description: "需要提供擁有學生會員權限的 Access Token 才能請求",
    security: [{ memberAuth: [] }],
    request: {
      body: {
        description: "要更新的設定欄位（可選填）",
        content: {
          "application/json": {
            schema: MemberSettingsSchema.omit({ member_id: true })
              .partial()
              .describe("如果不填寫，則不會更新該欄位。但如果填寫 null，則會將該欄位的資料刪除。"),
            example: {
              nickname: "龔同學",
              e_invoice_barcode: "/E7E6888",
            },
          },
        },
      },
    },
    responses: {
      204: {
        description: "成功更新會員設定",
      },
      422: {
        description: "請求格式正確，但內容不符合規範",
        examples: {
          INVALID_INVOICE_BARCODE: {
            summary: "電子發票之手機條碼格式錯誤（具體規範請參考臺灣財政部資料）",
            value: {
              code: KnownErrorCode.INVALID_INVOICE_BARCODE,
            },
          },
          NICKNAME_TOO_LONG: {
            summary: "無效的會員暱稱格式（長度不得超過 5 個字或包含空格）",
            value: {
              code: KnownErrorCode.INVALID_NICKNAME,
            },
          },
        },
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const { body } = await this.getValidatedData<typeof this.schema>();

    const { user } = await AuthService.validate({ roles: [UserRole.StudentMember] });

    const { nickname, e_invoice_barcode } = body;
    const updated_content: typeof body = {};

    if (nickname === null) {
      updated_content.nickname = null;
    } else if (nickname) {
      if (nickname.length > 5 || nickname.includes(" ")) {
        const debug = { content: nickname, length: nickname.length };
        throw new UnprocessableEntityError(KnownErrorCode.INVALID_NICKNAME, undefined, debug);
      }

      updated_content.nickname = nickname;
    }

    if (e_invoice_barcode === null) {
      updated_content.e_invoice_barcode = null;
    } else if (e_invoice_barcode) {
      // See also: https://www.einvoice.nat.gov.tw/
      const regexp = /^\/[0-9A-Z.+-]{7}$/;
      if (!regexp.test(e_invoice_barcode)) {
        throw new UnprocessableEntityError(KnownErrorCode.INVALID_INVOICE_BARCODE);
      }

      updated_content.e_invoice_barcode = e_invoice_barcode;
    }

    const { db, logger } = ctx.var;
    if (Object.keys(updated_content).length > 0) {
      try {
        const current_settings = await db.studentMember.findUnique({
          where: { user_id: user.id },
          select: { settings: true },
        });
        const updated_at = current_settings?.settings?.updated_at;

        const updated = await db.studentMember.update({
          where: {
            user_id: user.id,
            ...(updated_at ? { settings: { updated_at } } : {}),
          },
          data: { settings: { update: updated_content } },
        });

        if (!updated) {
          throw new ConflictError(
            KnownErrorCode.CONCURRENCY_CONFLICT,
            "Failed to update member settings due to optimistic concurrency conflict",
            { user_id: user.id },
          );
        }
      } catch (error) {
        throw InternalError.fromError("Failed to update member settings", error);
      }
    } else {
      logger.info("No settings to update");
    }

    return ctx.body(null, 204);
  }
}
