import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { clinicalNoteSchema, ClinicalNotesService } from "../services/clinical-notes.service";

@UseGuards(JwtAuthGuard)
@Controller("clinical-notes")
export class ClinicalNotesController {
  constructor(private clinicalNotesService: ClinicalNotesService) {}

  @Post()
  create(
    @CurrentUser() user: { tenantId: string; sub: string },
    @Body(new ZodValidationPipe(clinicalNoteSchema)) body: unknown,
  ) {
    return this.clinicalNotesService.create(user.tenantId, user.sub, body as never);
  }
}
