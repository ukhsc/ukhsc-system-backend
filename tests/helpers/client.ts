import { fromHono, HonoOpenAPIRouterType } from "chanfana";
import { Hono } from "hono";
import { AppOptions } from "index";
import console from "console";

export type TestClient = Hono<AppOptions> & HonoOpenAPIRouterType<Hono<AppOptions>>;

export function createTestClient(variables: AppOptions["Variables"]): TestClient {
  const client = fromHono(new Hono<AppOptions>());

  client.use(async (ctx, next) => {
    if (Object.keys(ctx.var).length === 0) {
      for (const key in variables) {
        ctx.set(
          key as keyof AppOptions["Variables"],
          variables[key as keyof AppOptions["Variables"]],
        );
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
