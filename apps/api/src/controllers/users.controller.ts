import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { createUserSchema, UsersService } from "../services/users.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  list(@CurrentUser() user: { tenantId: string }) {
    return this.usersService.listProfessionals(user.tenantId);
  }

  @Post()
  create(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(createUserSchema)) body: unknown,
  ) {
    return this.usersService.create(user.tenantId, user.sub, body as never);
  }
}
