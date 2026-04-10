import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { appointmentSchema, appointmentStatusSchema, AppointmentsService } from "../services/appointments.service";

@UseGuards(JwtAuthGuard)
@Controller("appointments")
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  list(@CurrentUser() user: { tenantId: string }, @Query("from") from?: string, @Query("to") to?: string) {
    return this.appointmentsService.list(user.tenantId, from, to);
  }

  @Post()
  create(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(appointmentSchema)) body: unknown,
  ) {
    return this.appointmentsService.create(user.tenantId, user.sub, body as never);
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Param("id") id: string,
    @Body(new ZodValidationPipe(appointmentStatusSchema)) body: unknown,
  ) {
    return this.appointmentsService.updateStatus(user.tenantId, user.sub, id, (body as { status: never }).status);
  }
}
