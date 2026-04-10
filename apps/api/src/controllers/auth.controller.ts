import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { AuthService, loginSchema, registerClinicSchema } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("plans")
  plans() {
    return this.authService.getPlans();
  }

  @Post("register-clinic")
  registerClinic(@Body(new ZodValidationPipe(registerClinicSchema)) body: unknown) {
    return this.authService.registerClinic(body as never);
  }

  @Post("login")
  login(@Body(new ZodValidationPipe(loginSchema)) body: unknown) {
    return this.authService.login(body as never);
  }

  @Post("refresh")
  refresh(@Req() req: Request) {
    const token = (req.body as { refreshToken?: string }).refreshToken;
    return this.authService.refresh(token || "");
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@CurrentUser() user: { sub: string }) {
    return this.authService.logout(user.sub);
  }
}
