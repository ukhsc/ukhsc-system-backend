import jwt from "jsonwebtoken";
import { ForbiddenError, InternalError, KnownErrorCode, UnauthorizedError } from "@utils/error";
import { StaffPermission, User } from "@prisma/client";
import { getCtx } from "index";
import { KnownErrorSchema } from "schema";

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

export type TokenRawPayload = TokenPayload & {
  iat: number;
  exp: number;
};

export interface PermissionCheckContext {
  user_id: number;
  roles: UserRole[];
  staff_permissions?: StaffPermission[];
}

export type PermissionCheckFunction = (
  context: PermissionCheckContext,
) => Promise<boolean> | boolean;

export type PermissionChecker = UserRole[] | PermissionCheckFunction;

export interface ValidateOptions {
  custom_token?: string;
  permission_checker?: PermissionChecker;
}

export class AuthService {
  /**
   * Validates a user's token and checks their permissions
   *
   * @param options - Validation options
   * @returns The validated token payload with user information
   *
   * @remarks
   * When using role-based permission checking (UserRole[]), access is granted if the user
   * has ANY of the specified roles. This is useful for simple permission scenarios where
   * multiple roles can perform the same action.
   *
   * Example: `permission_checker: [UserRole.StudentMember, UserRole.UnionStaff]` will grant
   * access if the user is either a student member OR union staff.
   */
  static async validate(options?: ValidateOptions): Promise<
    TokenRawPayload & {
      user: User;
    }
  > {
    const token = options?.custom_token ?? AuthService.getBearerToken();
    if (!token) {
      throw new UnauthorizedError(KnownErrorCode.NO_TOKEN);
    }

    const ctx = getCtx();
    const { db, logger } = ctx.var;
    try {
      const payload = jwt.verify(token, ctx.env.JWT_SECRET);
      if (!AuthService.isTokenPayload(payload)) {
        throw new UnauthorizedError(KnownErrorCode.INVALID_TOKEN);
      }

      const user = await db.user.findUnique({
        where: {
          id: payload.user_id,
        },
      });
      if (!user) {
        throw new UnauthorizedError(KnownErrorCode.BANNED_USER);
      }

      const user_roles = await AuthService.getUserRoles(user.id);

      if (options?.permission_checker) {
        let has_permission: boolean;

        // Simple role-based check
        if (Array.isArray(options.permission_checker)) {
          has_permission = options.permission_checker.some((role) => user_roles.includes(role));
        } else {
          // Dynamic permission check
          const staff_permissions = await AuthService.getUserStaffPermissions(user.id, user_roles);
          const permissionContext: PermissionCheckContext = {
            user_id: user.id,
            roles: user_roles,
            staff_permissions,
          };

          has_permission = await options.permission_checker(permissionContext);
        }

        if (!has_permission) {
          throw new ForbiddenError(KnownErrorCode.INSUFFICIENT_PERMISSIONS);
        }
      }

      return {
        user,
        ...payload,
        roles: user_roles,
      };
    } catch (error) {
      logger.assign({ token, error }).info("Failed to validate token.");
      throw new UnauthorizedError(KnownErrorCode.INVALID_TOKEN);
    }
  }

  private static async getUserStaffPermissions(
    user_id: number,
    roles: UserRole[],
  ): Promise<StaffPermission[] | undefined> {
    // Skip fetching
    if (!roles.includes(UserRole.UnionStaff)) {
      return undefined;
    }

    const { db } = getCtx().var;
    const staffData = await db.unionStaff.findUnique({
      where: { user_id },
      select: { permissions: true },
    });

    return staffData?.permissions;
  }

  private static getBearerToken(): string | null {
    const authHeader = getCtx().req.header("Authorization");
    if (!authHeader) {
      return null;
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer") {
      return null;
    }

    return token;
  }

  private static isTokenPayload(payload: unknown): payload is TokenRawPayload {
    return (
      typeof payload === "object" &&
      payload !== null &&
      "iat" in payload &&
      "exp" in payload &&
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

  static async getUserRoles(user_id: number): Promise<UserRole[]> {
    const { db } = getCtx().var;
    const roles = [];

    const user = await db.user.findUnique({
      where: { id: user_id },
      include: { member: true, staff: true },
    });
    if (!user) {
      throw new InternalError("User not found when getting roles.", { user_id });
    }

    if (user.member) {
      roles.push(UserRole.StudentMember);
    }
    if (user.staff) {
      roles.push(UserRole.UnionStaff);
    }
    // TODO: Add more roles here

    return roles;
  }
}

// OpenAPI response schemas
export const OpenAPIResponseUnauthorized = {
  401: {
    description: "尚未經過身份驗證，可能是因為沒有提供存取權杖或存取權杖無效。",
    content: {
      "application/json": {
        schema: KnownErrorSchema,
        example: {
          code: KnownErrorCode.INVALID_TOKEN,
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
        schema: KnownErrorSchema,
        example: {
          code: KnownErrorCode.INSUFFICIENT_PERMISSIONS,
        },
      },
    },
  },
};
