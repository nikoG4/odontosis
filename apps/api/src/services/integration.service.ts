import { Injectable } from "@nestjs/common";

@Injectable()
export class IntegrationService {
  async prepareReminder(payload: {
    tenantId: string;
    appointmentId: string;
    patientName: string;
    scheduledAt: Date;
  }) {
    return {
      channel: "WHATSAPP_STUB",
      message: `Recordatorio listo para ${payload.patientName}`,
      scheduledAt: payload.scheduledAt,
    };
  }

  suggestSlots() {
    return {
      provider: "AI_STUB",
      suggestions: ["09:00", "10:30", "15:00"],
    };
  }

  summarizeConsultation(input: { reason: string; diagnosis?: string; procedure?: string }) {
    return {
      provider: "AI_STUB",
      summary: `Consulta por ${input.reason}. Diagnostico: ${input.diagnosis || "pendiente"}. Procedimiento: ${input.procedure || "pendiente"}.`,
    };
  }
}
