import {
  AuthService,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  TokenPayload,
} from "@services/auth";
import { DeviceManagementService } from "@services/device_management";
import { ForbiddenError, KnownErrorCode } from "@utils/error";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";

export class RefreshToken extends OpenAPIRoute {
  schema = {
    tags: ["身份驗證"],
    summary: "更新存取權杖",
    description:
      "使用 refresh token 來更新 access token 以便延長時效，同時可取得新的 refresh token。",
    security: [{ userAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              refresh_token: z.string().describe("Refresh token"),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "成功更新存取權杖",
        content: {
          "application/json": {
            schema: z.object({
              access_token: z.string(),
              refresh_token: z.string(),
            }),
          },
        },
      },
      ...OpenAPIResponseUnauthorized,
      ...OpenAPIResponseForbidden,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const payload = await AuthService.validate({ custom_token: data.body.refresh_token });
    const { device_id } = payload;

    if (device_id) {
      const device_service = new DeviceManagementService(ctx);
      const valid = await device_service.validateDevice(device_id);
      if (valid === null) {
        throw new ForbiddenError(
          KnownErrorCode.ACCESS_REVOKED,
          `Device ${device_id} access has been revoked`,
        );
      }
      if (!valid) {
        const activity = await device_service.addActivity(device_id, false);
        throw new ForbiddenError(
          KnownErrorCode.UNAUTHORIZED_DEVICE,
          `Device ${device_id} is unauthorized`,
          { activity_id: activity.id },
        );
      }

      await device_service.addActivity(device_id, true);
      ctx.var.logger.info({ device_id }, "Token refreshed successfully");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Exclude JWT metadata to allow the library to generate fresh timestamps
    const { iat, exp, user, ...tokenPayload } = payload;
    const { access_token, refresh_token } = AuthService.generateToken(
      tokenPayload,
      ctx.env.JWT_SECRET,
    );

    return ctx.json({ access_token, refresh_token }, 200);
  }
}
