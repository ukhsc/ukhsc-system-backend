import { OpenAPIRoute } from "chanfana";

import { AppContext } from "index";
import { MemberSettingsSchema } from "schema";

import {
  AuthService,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  UserRole,
} from "@services/auth";
import { InternalError, KnownErrorCode, UnprocessableEntityError } from "@utils/error";

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
            summary: "會員暱稱過長（至多 5 個字）",
            value: {
              code: KnownErrorCode.NICKNAME_TOO_LONG,
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
      if (nickname.length > 5) {
        const debug = { length: nickname.length };
        throw new UnprocessableEntityError(KnownErrorCode.NICKNAME_TOO_LONG, undefined, debug);
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
        await db.studentMember.update({
          where: { user_id: user.id },
          data: { settings: { update: updated_content } },
        });
      } catch (error) {
        throw InternalError.fromError("Failed to update member settings", error);
      }
    } else {
      logger.warn("No settings to update");
    }

    return ctx.body(null, 204);
  }
}
