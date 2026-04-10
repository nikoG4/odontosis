import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { patientSchema, PatientsService } from "../services/patients.service";

@UseGuards(JwtAuthGuard)
@Controller("patients")
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  list(@CurrentUser() user: { tenantId: string }, @Query("q") q?: string) {
    return this.patientsService.list(user.tenantId, q);
  }

  @Get(":id")
  getOne(@CurrentUser() user: { tenantId: string }, @Param("id") id: string) {
    return this.patientsService.getOne(user.tenantId, id);
  }

  @Post()
  create(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(patientSchema)) body: unknown,
  ) {
    return this.patientsService.create(user.tenantId, user.sub, body as never);
  }
}
