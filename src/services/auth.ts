import jwt from "jsonwebtoken";
import { z } from "zod";
import { BaseTokenPayload } from "@utils/auth";
import { ForbiddenError, UnauthorizedError } from "@utils/error";
import { HonoRequest } from "hono";

export class AuthService {
  /*
   * Requires the request to be authenticated with a valid token.
   * @param secret - The secret key used to sign the token.
   * @param {(payload: BaseTokenPayload) => payload is P} type_guard - A type guard function to check the payload. See {@link isOrdererTokenPayload} for an example.
   * @param token - The token to be validated.
   * @throws {HttpError} - Needs to be caught by the caller to return the response.
   *
   * Example usage:
   * ```ts
   * const auth_payload = AuthService.validate(ctx.env.JWT_SECRET, token, isOrdererTokenPayload);
   * // The code below this line will only be executed if the request is authenticated
   * // and the payload is of type P (OrdererTokenPayload in this case)
   * ```
   */
  static validate<P extends BaseTokenPayload>(
    secret: string,
    token: string | null,
    type_guard?: (payload: BaseTokenPayload) => payload is P,
  ): P {
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    try {
      const payload = jwt.verify(token, secret) as P;

      if (type_guard && !type_guard(payload)) {
        throw new ForbiddenError("Insufficient permissions or role");
      }

      return payload;
    } catch (_) {
      throw new UnauthorizedError("Invalid token");
    }
  }

  static getBearerToken(req: HonoRequest): string | null {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer") {
      return null;
    }

    return token;
  }

  static generateToken<P extends BaseTokenPayload>(
    payload: P,
    secret: string,
  ): {
    access_token: string;
    refresh_token: string;
  } {
    const access_token = jwt.sign(payload, secret, {
      expiresIn: "24h",
    });
    const refresh_token = jwt.sign(payload, secret, {
      expiresIn: "45 days",
    });

    return {
      access_token,
      refresh_token,
    };
  }
}

// OpenAPI response schemas
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
