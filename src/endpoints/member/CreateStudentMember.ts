import { FederatedProvider, MembershipPurchaseChannel, SchoolAccountConfig } from "@prisma/client";
import { AuthService, UserRole } from "@services/auth";
import { FederatedAccountService } from "@services/federated_account";
import { BadRequestError } from "@utils/error";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";
import { DeviceManagementService } from "@services/device_management";
import { ErrorResponseSchema, FederateOAuthSchema, TokenResponseSchema } from "schema";

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
              google_workspace: FederateOAuthSchema.describe(
                "Google Workspace for Education 的帳號授權資訊",
              ),
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
            schema: TokenResponseSchema,
          },
        },
      },
      400: {
        description: "無效的請求資訊",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
            examples: {
              "School ID": {
                value: {
                  error: "Invalid partner school ID",
                },
              },
              "School account configuration": {
                value: {
                  error: "School account configuration has not been set up by the administrator",
                },
              },
              "School email": {
                value: {
                  error: "Invalid school email or it's not from our partner school",
                },
              },
              "Email format": {
                value: {
                  error: "Invalid email format or it's owned by a teacher",
                },
              },
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
      throw new BadRequestError("Invalid partner school ID");
    }

    const federated_service = new FederatedAccountService(
      ctx.var,
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

    const user = await db.user.create({
      data: {
        primary_email: info.email,
      },
    });
    await federated_service.linkAccount(db, user, info);
    await db.studentMember.create({
      data: {
        school_attended: {
          connect: {
            id: school_attended.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        purchase_channel: MembershipPurchaseChannel.PartnerFree,
        student_id,
        activated_at: new Date(),
        expired_at: system_config?.contract_end_date,
      },
    });

    const device_service = new DeviceManagementService(ctx);
    const device = await device_service.registerDevice(user.id);

    const token = AuthService.generateToken(
      {
        roles: [UserRole.StudentMember],
        user_id: user.id,
        device_id: device.id,
      },
      ctx.var.JWT_SECRET,
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
