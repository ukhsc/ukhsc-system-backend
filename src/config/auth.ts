import jwt from "jsonwebtoken";
import env from "@config/env";
import { HonoRequest } from "hono";
import { AppContext } from "index";
import { z } from "zod";

export enum TokenRole {
  Orderer = "orderer",
}

export interface BaseTokenPayload {
  role: TokenRole;
  [key: string]: unknown;
}
export interface OrdererTokenPayload extends BaseTokenPayload {
  role: TokenRole.Orderer;
  order_id: number;
}
export type ContextWithPayload<P extends BaseTokenPayload> = AppContext & {
  var: { auth_payload: P };
};

export const OpenAPIResponseUnauthorized = {
  401: {
    description: "尚未經過身份驗證，可能是因為沒有提供存取權杖或存取權杖無效。",
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
        example: {
          error: "Unauthorized (Invalid token)",
        },
      },
    },
  },
};
export const OpenAPIResponseForbidden = {
  403: {
    description: "沒有足夠的權限執行此操作。",
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
        example: {
          error: "Forbidden (Insufficient permissions or role)",
        },
      },
    },
  },
};

export function isBaseTokenPayload(payload: unknown): payload is BaseTokenPayload {
  return typeof payload === "object" && payload !== null && "role" in payload;
}
export function isOrdererTokenPayload(payload: BaseTokenPayload): payload is OrdererTokenPayload {
  return payload.role === TokenRole.Orderer && "order_id" in payload;
}

/**
 * Requires the request to be authenticated with a valid token.
 * @param {AppContext} ctx - The context object of the request.
 * @param {(payload: BaseTokenPayload) => payload is P} type_guard - A type guard function to check the payload. See {@link isOrdererTokenPayload} for an example.
 * @throws {TypedResponse} - Needs to be caught by the caller to return the response.
 *
 * Example usage:
 * ```ts
 * try {
 *   requireAuth(ctx, isOrdererTokenPayload);
 * } catch (res) {
 *   return res;
 * }
 * // The code below this line will only be executed if the request is authenticated and the ctx.var.auth_payload is of type P (OrdererTokenPayload in this case)
 * ```
 */
export function requireAuth<P extends BaseTokenPayload>(
  ctx: AppContext,
  type_guard?: (payload: BaseTokenPayload) => payload is P,
): asserts ctx is ContextWithPayload<P> {
  // If the request is already authenticated and the payload is of the correct type, return immediately.
  if (ctx.var.auth_payload && (!type_guard || type_guard(ctx.var.auth_payload))) {
    return;
  }

  const token = getBearerToken(ctx.req);
  if (!token) {
    throw ctx.json({ error: "Unauthorized (No token provided)" }, 401);
  }

  let payload: P;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as P;
    ctx.set("auth_payload", payload);
  } catch (error) {
    throw ctx.json({ error: "Unauthorized (Invalid token)" }, 401);
  }

  if (type_guard && !type_guard(payload)) {
    throw ctx.json({ error: "Forbidden (Insufficient permissions or role)" }, 403);
  }
}

export function generateToken<P extends BaseTokenPayload>(payload: P): string {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "60 days",
  });

  return token;
}

function getBearerToken(request: HonoRequest): string | null {
  const authHeader = request.header("Authorization");
  if (!authHeader) {
    return null;
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer") {
    return null;
  }

  return token;
}
