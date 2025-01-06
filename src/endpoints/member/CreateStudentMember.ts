import { FederatedProvider, MembershipPurchaseChannel, SchoolAccountConfig } from "@prisma/client";
import { FederatedAccountService, GrantFlows } from "@services/federated_account";
import { BadRequestError } from "@services/index";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { StudentMemberSchema } from "schema";
import { z } from "zod";

export class CreateStudentMember extends OpenAPIRoute {
  schema = {
    tags: ["學生會員"],
    summary: "註冊並啟用新的學生會員帳號",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              school_attended_id: z.number().describe("註冊者所就讀學校的 ID"),
              google_workspace: z
                .object({
                  flow: z.nativeEnum(GrantFlows).describe("授權流程"),
                  grant_value: z.string().describe("授權資訊（取決於授權流程）"),
                  redirect_uri: z
                    .string()
                    .optional()
                    .describe(
                      "授權完成後的重新導向網址（必須與前端取得授權碼的網址相同）\n\n若授權認證流程（`flow`）為 `token`，則此欄位不需要",
                    ),
                })
                .describe("Google Workspace for Education 的帳號授權資訊"),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "成功註冊新的學生會員帳號",
        content: {
          "application/json": {
            schema: StudentMemberSchema.omit({
              password_hash: true,
              // Deprecated field
              has_stickers: true,
            }),
            example: {
              purchase_channel: "PartnerFree",
              id: "ckv4f2g3e0000y9l5t6z8j2h3",
              school_attended_id: 1,
              primary_email: "s1234567@example.edu.tw",
              student_id: "1234567",
              nickname: null,
              created_at: "2025-01-01T00:00:00.000Z",
              activated_at: "2025-01-01T00:00:00.000Z",
            },
          },
        },
      },
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const db = ctx.var.prisma;

    const school_attended = await db.partnerSchool.findUnique({
      where: { id: data.body.school_attended_id },
    });
    if (!school_attended) {
      return ctx.json({
        error: "Invalid partner school ID",
      });
    }

    const federated_service = new FederatedAccountService(
      db,
      ctx.env,
      FederatedProvider.GoogleWorkspace,
    );

    try {
      const { flow, grant_value, redirect_uri } = data.body.google_workspace;
      const token = await federated_service.getAccessToken(flow, grant_value, redirect_uri);
      const info = await federated_service.getUserInfo(token);

      const account_config = await db.schoolAccountConfig.findUnique({
        where: {
          school_id: school_attended.id,
        },
      });
      if (!account_config) {
        return ctx.json(
          {
            error: "School account configuration has not been set up by the administrator",
          },
          500,
        );
      }

      const student_id = this.captureStudentId(info.email, account_config);
      const member = await db.studentMember.create({
        data: {
          school_attended: {
            connect: {
              id: school_attended.id,
            },
          },
          purchase_channel: MembershipPurchaseChannel.PartnerFree,
          student_id,
          activated_at: new Date(),
        },
      });

      await federated_service.linkAccount(member, info);

      return ctx.json(
        StudentMemberSchema.omit({ password_hash: true, has_stickers: true }).parse(member),
        201,
      );
    } catch (error) {
      if (error instanceof BadRequestError) {
        return ctx.json({ error: error.message }, 400);
      }
      throw error;
    }
  }

  private captureStudentId(email: string, config: SchoolAccountConfig): string {
    const domain = email.split("@")[1];
    if (domain !== config.domain_name) {
      throw new BadRequestError("Invalid school email or it's not from our partner school");
    }

    const regex = new RegExp(config.student_username_format);
    const match = email.match(regex);
    if (!match) {
      throw new BadRequestError("Invalid email format or it's owned by a teacher");
    }

    return match[1]; // The first capturing group is the student ID
  }
}
