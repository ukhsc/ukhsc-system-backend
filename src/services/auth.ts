import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "@utils/error";
import { User } from "@prisma/client";
import { AppContext } from "index";
import { ErrorResponseSchema } from "schema";
import console from "node:console";

export enum UserRole {
  StudentMember = "student_member",
  SchoolRepresentative = "school_representative",
  UnionStaff = "union_staff",
}

export interface TokenPayload {
  roles: UserRole[];
  user_id: number;
  device_id: number;
}

export class AuthService {
  constructor(private ctx: AppContext) {}

  async validate(options?: { custom_token?: string; roles?: UserRole[] }): Promise<
    TokenPayload & {
      user: User;
    }
  > {
    const token = options?.custom_token ?? this.getBearerToken();
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    try {
      const payload = jwt.verify(token, this.ctx.env.JWT_SECRET);
      if (!this.isTokenPayload(payload)) {
        throw new UnauthorizedError("Invalid token");
      }

      const roles = options?.roles ?? [];
      const hasPermission = roles.every((role) => payload.roles.includes(role));
      if (!hasPermission) {
        throw new ForbiddenError("Insufficient permissions or role");
      }

      const db = this.ctx.var.prisma;
      const user = await db.user.findUnique({
        where: {
          id: payload.user_id,
        },
      });
      if (!user) {
        throw new UnauthorizedError("User has been banned");
      }

      return {
        user,
        ...payload,
      };
    } catch (_) {
      console.error(_);
      throw new UnauthorizedError("Invalid token");
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

  private isTokenPayload(payload: unknown): payload is TokenPayload {
    return (
      typeof payload === "object" &&
      payload !== null &&
      "roles" in payload &&
      "user_id" in payload &&
      "device_id" in payload
    );
  }

  static generateToken(
    payload: TokenPayload,
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
        schema: ErrorResponseSchema,
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
        schema: ErrorResponseSchema,
        example: {
          error: "Forbidden (Insufficient permissions or role)",
        },
      },
    },
  },
};
