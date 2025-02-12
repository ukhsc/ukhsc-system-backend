import { fromHono, HonoOpenAPIRouterType } from "chanfana";
import { Hono } from "hono";
import { AppOptions } from "index";
import console from "console";

export type TestClient = HonoOpenAPIRouterType<AppOptions>;

export function createTestClient(variables: AppOptions["Variables"]): TestClient {
  const client = fromHono(new Hono<AppOptions>());

  client.use(async (ctx, next) => {
    if (Object.keys(ctx.var).length === 0) {
      for (const [key, value] of Object.entries(variables)) {
        ctx.set(key as keyof AppOptions["Variables"], value);
      }
    }
    await next();
  });

  client.onError((err, cxt) => {
    console.error(err);
    return cxt.text("Internal Server Error", 500);
  });

  return client;
}
