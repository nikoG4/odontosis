import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { treatmentSchema, TreatmentsService } from "../services/treatments.service";

@UseGuards(JwtAuthGuard)
@Controller("treatments")
export class TreatmentsController {
  constructor(private treatmentsService: TreatmentsService) {}

  @Get()
  list(@CurrentUser() user: { tenantId: string }) {
    return this.treatmentsService.list(user.tenantId);
  }

  @Post()
  create(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(treatmentSchema)) body: unknown,
  ) {
    return this.treatmentsService.create(user.tenantId, user.sub, body as never);
  }
}
