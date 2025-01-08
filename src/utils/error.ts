import { MiddlewareHandler } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppContext, AppOptions } from "index";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: ContentfulStatusCode,
  ) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}
export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
  }
}

// TODO: Add request id for debugging and tracking
export const httpErrorMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpError) {
      return ctx.json({ error: error.message }, error.status);
    } else {
      throw error;
    }
  }
};
