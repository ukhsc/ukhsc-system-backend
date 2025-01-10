import { StudentMemberTokenPayload, TokenRole } from "@utils/auth";
import { FederatedProvider, MembershipPurchaseChannel, SchoolAccountConfig } from "@prisma/client";
import { AuthService } from "@services/auth";
import { FederatedAccountService, GrantFlows } from "@services/federated_account";
import { BadRequestError } from "@utils/error";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";
import { DeviceManagementService } from "@services/device_management";

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
      201: {
        description: "成功註冊新的學生會員帳號",
        content: {
          "application/json": {
            schema: z.object({
              access_token: z.string().describe("存取權杖"),
              refresh_token: z.string().describe("更新權杖"),
            }),
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

    const { flow, grant_value, redirect_uri } = data.body.google_workspace;
    const google_token = await federated_service.getAccessToken(flow, grant_value, redirect_uri);
    const info = await federated_service.getUserInfo(google_token);

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
    const system_config = await db.systemConfigurationUpdates.findFirst({
      orderBy: {
        id: "desc",
      },
    });
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
        expired_at: system_config?.contract_end_date,
      },
    });
    await federated_service.linkAccount(member, info);

    const device_service = new DeviceManagementService(ctx);
    const device = await device_service.registerDevice();

    const token = AuthService.generateToken<StudentMemberTokenPayload>(
      {
        role: TokenRole.StudentMember,
        device_id: device.id,
        member_id: member.id,
      },
      ctx.env.JWT_SECRET,
    );

    return ctx.json(token, 201);
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
