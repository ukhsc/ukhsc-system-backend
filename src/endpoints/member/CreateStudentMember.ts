import { FederatedProvider, SchoolAccountConfig } from "@prisma/client";
import { AuthService, UserRole } from "@services/auth";
import { FederatedAccountService } from "@services/federated_account";
import { InternalError, KnownErrorCode, UnprocessableEntityError } from "@utils/error";
import { AppRoute } from "../route";
import { AppContext } from "index";
import { z } from "zod";
import { DeviceManagementService } from "@services/device_management";
import { simpleHash } from "@utils/hash";
import { FederateOAuthSchema, KnownErrorSchema, TokenResponseSchema } from "schema";

export class CreateStudentMember extends AppRoute {
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
      402: {
        description: "無效的請求資訊",
        content: {
          "application/json": {
            schema: KnownErrorSchema,
            examples: {
              "School ID": {
                value: {
                  code: KnownErrorCode.MISMATCH,
                },
              },
              "School email": {
                value: {
                  code: KnownErrorCode.INVALID_SCHOOL_EMAIL,
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
    const { db } = ctx.var;

    const school_attended = await db.partnerSchool.findUnique({
      where: { id: data.body.school_attended_id },
    });
    if (!school_attended) {
      throw new UnprocessableEntityError(KnownErrorCode.MISMATCH, "Invalid partner school ID");
    }

    const federated_service = new FederatedAccountService(FederatedProvider.GoogleWorkspace);

    const { flow, grant_value, redirect_uri } = data.body.google_workspace;
    const google_token = await federated_service.getAccessToken(flow, grant_value, redirect_uri);
    const info = await federated_service.getUserInfo(google_token);

    const account_config = await db.schoolAccountConfig.findUnique({
      where: {
        school_id: school_attended.id,
      },
    });
    if (!account_config) {
      throw new InternalError(
        "School account configuration has not been set up by the administrator",
        { school_id: school_attended.id },
      );
    }
    const student_id = this.captureStudentId(info.email, account_config);
    const system_config = await db.systemConfigurationUpdates.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const user = await db.user.upsert({
      where: { primary_email: info.email },
      update: {},
      create: {
        primary_email: info.email,
        member: {
          create: {
            school_attended: {
              connect: {
                id: school_attended.id,
              },
            },
            student_id_hash: simpleHash(student_id),
            activated_at: new Date(),
            expired_at: system_config?.contract_end_date,
          },
        },
      },
    });
    await federated_service.linkAccount(user, info);

    const device_service = new DeviceManagementService(ctx);
    const device = await device_service.registerDevice(user.id);

    const token = AuthService.generateToken(
      {
        roles: [UserRole.StudentMember],
        user_id: user.id,
        device_id: device.id,
      },
      ctx.env.JWT_SECRET,
    );

    return ctx.json(token, 201);
  }

  private captureStudentId(email: string, config: SchoolAccountConfig): string {
    const domain = email.split("@")[1];
    if (domain !== config.domain_name) {
      throw new UnprocessableEntityError(
        KnownErrorCode.INVALID_SCHOOL_EMAIL,
        "Invalid school email or it's not from our partner school",
      );
    }

    const regex = new RegExp(config.student_username_format);
    const match = email.match(regex);
    if (!match) {
      throw new UnprocessableEntityError(
        KnownErrorCode.INVALID_SCHOOL_EMAIL,
        "Invalid email format or it's owned by a teacher",
      );
    }

    return match[1]; // The first capturing group is the student ID
  }
}
