import { RoleName } from "./enums";

export interface JwtUser {
  sub: string;
  tenantId: string;
  role: RoleName;
  email: string;
  firstName: string;
  lastName: string;
}
