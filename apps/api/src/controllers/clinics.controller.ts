import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { updateClinicSchema, ClinicsService } from "../services/clinics.service";

@UseGuards(JwtAuthGuard)
@Controller("clinic")
export class ClinicsController {
  constructor(private clinicsService: ClinicsService) {}

  @Get("me")
  me(@CurrentUser() user: { tenantId: string }) {
    return this.clinicsService.getClinic(user.tenantId);
  }

  @Put("me")
  update(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(updateClinicSchema)) body: unknown,
  ) {
    return this.clinicsService.updateClinic(user.tenantId, user.sub, body as never);
  }
}
