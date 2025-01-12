import { AuthService, OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { DeviceManagementService } from "@services/device_management";
import { ForbiddenError } from "@utils/error";
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
    const auth_service = new AuthService(ctx);
    const payload = await auth_service.validate({ custom_token: data.body.refresh_token });

    if (payload.device_id) {
      const device_service = new DeviceManagementService(ctx);
      const valid = await device_service.validateDevice(payload.device_id);
      if (valid === null) {
        throw new ForbiddenError("Device access has been revoked");
      }
      if (!valid) {
        await device_service.addActivity(payload.device_id, false);
        throw new ForbiddenError("Unauthorized device");
      }

      await device_service.addActivity(payload.device_id, true);
    }

    const { access_token, refresh_token } = AuthService.generateToken(payload, ctx.env.JWT_SECRET);

    return ctx.json({ access_token, refresh_token }, 200);
  }
}
