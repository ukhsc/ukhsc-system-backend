import { AppContext } from "index";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { BaseTokenPayload } from "@config/auth";

export class AuthService {
  constructor(private ctx: AppContext) {}

  /**
   * Requires the request to be authenticated with a valid token.
   * @param {(payload: BaseTokenPayload) => payload is P} type_guard - A type guard function to check the payload. See {@link isOrdererTokenPayload} for an example.
   * @throws {TypedResponse} - Needs to be caught by the caller to return the response.
   *
   * Example usage:
   * ```ts
   * let auth_payload: OrdererTokenPayload;
   * try {
   *   const auth_service = new AuthService(ctx);
   *   auth_payload = auth_service.validate(isOrdererTokenPayload);
   * } catch (res) {
   *   return res;
   * }
   * // The code below this line will only be executed if the request is authenticated
   * // and the payload is of type P (OrdererTokenPayload in this case)
   * ```
   */
  validate<P extends BaseTokenPayload>(
    type_guard?: (payload: BaseTokenPayload) => payload is P,
  ): P {
    const token = this.getBearerToken();
    if (!token) {
      throw this.ctx.json({ error: "Unauthorized (No token provided)" }, 401);
    }

    try {
      const payload = jwt.verify(token, this.ctx.env.JWT_SECRET) as P;

      if (type_guard && !type_guard(payload)) {
        throw this.ctx.json({ error: "Forbidden (Insufficient permissions or role)" }, 403);
      }

      return payload;
    } catch (error) {
      throw this.ctx.json({ error: "Unauthorized (Invalid token)" }, 401);
    }
  }

  private getBearerToken(): string | null {
    const authHeader = this.ctx.req.header("Authorization");
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer") {
      return null;
    }

    return token;
  }

  static generateToken<P extends BaseTokenPayload>(payload: P, secrt: string): string {
    const token = jwt.sign(payload, secrt, {
      expiresIn: "60 days",
    });

    return token;
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
