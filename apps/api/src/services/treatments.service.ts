import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { TreatmentStatus } from "../common/enums";
import { createId } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";

export const treatmentSchema = z.object({
  patientId: z.string().min(1),
  professionalId: z.string().optional().nullable(),
  type: z.string().min(2),
  description: z.string().min(2),
  status: z.nativeEnum(TreatmentStatus).default(TreatmentStatus.PLANNED),
  estimatedCost: z.number().nonnegative(),
  finalCost: z.number().nonnegative().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

@Injectable()
export class TreatmentsService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async list(tenantId: string) {
    const rows = await this.db.fetchAll<any>(
      `SELECT t.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              u.first_name AS professional_first_name, u.last_name AS professional_last_name
       FROM treatments t
       JOIN patients p ON p.id = t.patient_id
       LEFT JOIN users u ON u.id = t.professional_id
       WHERE t.tenant_id = :tenant_id AND t.deleted_at IS NULL
       ORDER BY t.created_at DESC`,
      { tenant_id: tenantId },
    );

    const paymentRows = await this.db.fetchAll<any>(
      `SELECT id, treatment_id, amount FROM payments WHERE tenant_id = :tenant_id AND treatment_id IS NOT NULL`,
      { tenant_id: tenantId },
    );

    return rows.map((row) => ({
      id: row.ID,
      patientId: row.PATIENT_ID,
      professionalId: row.PROFESSIONAL_ID,
      type: row.TYPE,
      description: row.DESCRIPTION,
      status: row.STATUS,
      estimatedCost: Number(row.ESTIMATED_COST),
      finalCost: row.FINAL_COST == null ? null : Number(row.FINAL_COST),
      startDate: row.START_DATE,
      endDate: row.END_DATE,
      patient: { firstName: row.PATIENT_FIRST_NAME, lastName: row.PATIENT_LAST_NAME },
      professional: row.PROFESSIONAL_FIRST_NAME
        ? { firstName: row.PROFESSIONAL_FIRST_NAME, lastName: row.PROFESSIONAL_LAST_NAME }
        : null,
      payments: paymentRows
        .filter((payment) => payment.TREATMENT_ID === row.ID)
        .map((payment) => ({ id: payment.ID, amount: Number(payment.AMOUNT) })),
    }));
  }

  async create(tenantId: string, userId: string, data: z.infer<typeof treatmentSchema>) {
    const id = createId("trt_");
    await this.db.execute(
      `INSERT INTO treatments (id, tenant_id, patient_id, professional_id, type, description, status, estimated_cost, final_cost, start_date, end_date)
       VALUES (:id, :tenant_id, :patient_id, :professional_id, :type, :description, :status, :estimated_cost, :final_cost, :start_date, :end_date)`,
      {
        id,
        tenant_id: tenantId,
        patient_id: data.patientId,
        professional_id: data.professionalId ?? null,
        type: data.type,
        description: data.description,
        status: data.status,
        estimated_cost: data.estimatedCost,
        final_cost: data.finalCost ?? null,
        start_date: data.startDate ? new Date(data.startDate) : null,
        end_date: data.endDate ? new Date(data.endDate) : null,
      },
    );
    await this.audit.log({ tenantId, userId, action: "CREATE_TREATMENT", entity: "Treatment", entityId: id });
    return (await this.list(tenantId)).find((item) => item.id === id);
  }
}
