import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { createId } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";

export const clinicalNoteSchema = z.object({
  patientId: z.string().min(1),
  professionalId: z.string().min(1),
  appointmentId: z.string().optional().nullable(),
  date: z.string().datetime().optional(),
  reason: z.string().min(2),
  diagnosis: z.string().optional().nullable(),
  procedure: z.string().optional().nullable(),
  indications: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
});

@Injectable()
export class ClinicalNotesService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async create(tenantId: string, userId: string, data: z.infer<typeof clinicalNoteSchema>) {
    const id = createId("not_");
    await this.db.execute(
      `INSERT INTO clinical_notes (id, tenant_id, patient_id, professional_id, appointment_id, note_date, reason, diagnosis, procedure_text, indications, observations)
       VALUES (:id, :tenant_id, :patient_id, :professional_id, :appointment_id, :note_date, :reason, :diagnosis, :procedure_text, :indications, :observations)`,
      {
        id,
        tenant_id: tenantId,
        patient_id: data.patientId,
        professional_id: data.professionalId,
        appointment_id: data.appointmentId ?? null,
        note_date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        diagnosis: data.diagnosis ?? null,
        procedure_text: data.procedure ?? null,
        indications: data.indications ?? null,
        observations: data.observations ?? null,
      },
    );

    const row = await this.db.fetchOne<any>(
      `SELECT n.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              u.first_name AS professional_first_name, u.last_name AS professional_last_name
       FROM clinical_notes n
       JOIN patients p ON p.id = n.patient_id
       JOIN users u ON u.id = n.professional_id
       WHERE n.id = :id`,
      { id },
    );

    await this.audit.log({ tenantId, userId, action: "CREATE_CLINICAL_NOTE", entity: "ClinicalNote", entityId: id });
    return {
      id: row.ID,
      patientId: row.PATIENT_ID,
      professionalId: row.PROFESSIONAL_ID,
      appointmentId: row.APPOINTMENT_ID,
      date: row.NOTE_DATE,
      reason: row.REASON,
      diagnosis: row.DIAGNOSIS,
      procedure: row.PROCEDURE_TEXT,
      indications: row.INDICATIONS,
      observations: row.OBSERVATIONS,
      patient: { firstName: row.PATIENT_FIRST_NAME, lastName: row.PATIENT_LAST_NAME },
      professional: { firstName: row.PROFESSIONAL_FIRST_NAME, lastName: row.PROFESSIONAL_LAST_NAME },
    };
  }
}
