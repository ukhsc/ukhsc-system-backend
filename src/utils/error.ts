import { SpanStatusCode } from "@opentelemetry/api";
import { HTTPResponseError } from "hono/types";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppContext } from "index";

export class InternalError extends Error {
  constructor(
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "InternalError";
  }

  static fromError(message: string, error: unknown, details?: Record<string, unknown>) {
    return new InternalError(message, { error, details });
  }
}

export class KnownHttpError extends Error {
  constructor(
    public code: KnownErrorCode,
    public status: ContentfulStatusCode,
    public debug_message?: string,
    public details?: Record<string, unknown>,
  ) {
    super(debug_message ? `${code} - ${debug_message}` : code);
    this.name = "KnownHttpError";
  }
}

const createHttpError = (status: ContentfulStatusCode, name: string) => {
  return class extends KnownHttpError {
    constructor(code: KnownErrorCode, debug_message?: string, details?: Record<string, unknown>) {
      super(code, status, debug_message, details);
      this.name = name;
    }
  };
};

export const BadRequestError = createHttpError(400, "BadRequestError");
export const UnauthorizedError = createHttpError(401, "UnauthorizedError");
export const ForbiddenError = createHttpError(403, "ForbiddenError");
export const UnprocessableEntityError = createHttpError(422, "UnprocessableEntityError");

export const httpErrorHandler = async (error: Error | HTTPResponseError, ctx: AppContext) => {
  const { logger } = ctx.var;
  if (error instanceof KnownHttpError && error.status < 500) {
    logger.debug({ msg: "Known error", error });
    return ctx.json({ code: error.code }, error.status);
  } else {
    const res = ctx.env.outgoing;

    const event_id = ctx.var.sentry?.captureException(error, {
      mechanism: { type: "middleware", handled: false },
    });
    (res as { sentry?: string }).sentry = event_id;
    ctx.var.span?.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    ctx.var.span?.recordException(error);

    logger.assign({ event_id });
    logger.error(error);

    return ctx.json({ error: "Internal Server Error" }, 500);
  }
};

/**
 * Machine readable error api codes for known errors which usually caused by the requester (frontend).
 *
 * The error code is a string in the format of "UXXXX", where "U" stands for "UKHSC System", and "XXXX" is a 4-digit number.
 *
 * # Code Ranges
 * - 1000 ~ 1999: Basic CRUD operations
 * - 2000 ~ 2999: Authentication and Authorization
 * - 3000 ~ 3999: User management
 * - 4000 ~ 4999: Membership management
 * - 5000 ~ 5999: Partner shops management
 * - 6000 ~ 6999: External services
 * - 7000 ~ 7999: Data validation (TODO)
 * - 8000 ~ 9999: Miscellaneous
 */
export enum KnownErrorCode {
  // 1000 ~ 1999: Basic CRUD operations
  NOT_FOUND = "U1000",
  MISMATCH = "U1001",

  // 2000 ~ 2999: Authentication and Authorization
  NO_TOKEN = "U2000",
  INVALID_TOKEN = "U2001",
  BANNED_USER = "U2002",
  INSUFFICIENT_PERMISSIONS = "U2003",
  ACCESS_REVOKED = "U2004",
  UNAUTHORIZED_DEVICE = "U2005",

  // 3000 ~ 3999: User management
  INVALID_FEDERATED_GRANT = "U3000",
  FEDERATED_LINKED = "U3001",
  FEDERATED_NOT_LINKED = "U3002",

  // 4000 ~ 4999: Membership management
  INVALID_SCHOOL_EMAIL = "U4000",
  INVALID_INVOICE_BARCODE = "U4001",
  NICKNAME_TOO_LONG = "U4002",

  // 5000 ~ 5999: Partner shops management

  // 6000 ~ 6999: External services

  // 7000 ~ 7999: Data validation

  // 8000 ~ 9999: Miscellaneous
}
