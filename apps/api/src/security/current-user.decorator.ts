import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtUser } from "../common/types";

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
