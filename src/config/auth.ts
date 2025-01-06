export enum TokenRole {
  Orderer = "orderer",
  StudentMember = "student_member",
}

export interface BaseTokenPayload {
  role: TokenRole;
  [key: string]: unknown;
}
export interface OrdererTokenPayload extends BaseTokenPayload {
  role: TokenRole.Orderer;
  order_id: number;
}

export function isBaseTokenPayload(payload: unknown): payload is BaseTokenPayload {
  return typeof payload === "object" && payload !== null && "role" in payload;
}
export function isOrdererTokenPayload(payload: BaseTokenPayload): payload is OrdererTokenPayload {
  return payload.role === TokenRole.Orderer && "order_id" in payload;
}
