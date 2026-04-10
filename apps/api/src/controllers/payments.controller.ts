import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { paymentSchema, PaymentsService } from "../services/payments.service";

@UseGuards(JwtAuthGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  list(@CurrentUser() user: { tenantId: string }) {
    return this.paymentsService.list(user.tenantId);
  }

  @Post()
  create(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(paymentSchema)) body: unknown,
  ) {
    return this.paymentsService.create(user.tenantId, user.sub, body as never);
  }
}
