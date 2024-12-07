import jwt from "jsonwebtoken";
import env from "@config/env";
import { HonoRequest } from "hono";

interface BasePayload {}

export interface OrdererTokenPayload extends BasePayload {
  order_id: number;
}

export function verifyToken<P extends BasePayload>(token: string): P | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as P;
  } catch (error) {
    return null;
  }
}

export function getBearerToken(request: HonoRequest): string | null {
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

export function generateOrdererToken(payload: OrdererTokenPayload): string {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "60 days",
  });

  return token;
}
