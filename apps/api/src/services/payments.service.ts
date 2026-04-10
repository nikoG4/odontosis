import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { PaymentMethod } from "../common/enums";
import { createId } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";

export const paymentSchema = z.object({
  patientId: z.string().min(1),
  treatmentId: z.string().optional().nullable(),
  amount: z.number().positive(),
  paidAt: z.string().datetime(),
  method: z.nativeEnum(PaymentMethod),
  observations: z.string().optional().nullable(),
});

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async list(tenantId: string) {
    const rows = await this.db.fetchAll<any>(
      `SELECT p.*, pt.first_name AS patient_first_name, pt.last_name AS patient_last_name, t.type AS treatment_type
       FROM payments p
       JOIN patients pt ON pt.id = p.patient_id
       LEFT JOIN treatments t ON t.id = p.treatment_id
       WHERE p.tenant_id = :tenant_id
       ORDER BY p.paid_at DESC`,
      { tenant_id: tenantId },
    );
    return rows.map((row) => ({
      id: row.ID,
      patientId: row.PATIENT_ID,
      treatmentId: row.TREATMENT_ID,
      amount: Number(row.AMOUNT),
      paidAt: row.PAID_AT,
      method: row.METHOD,
      observations: row.OBSERVATIONS,
      patient: { firstName: row.PATIENT_FIRST_NAME, lastName: row.PATIENT_LAST_NAME },
      treatment: row.TREATMENT_TYPE ? { type: row.TREATMENT_TYPE } : null,
    }));
  }

  async create(tenantId: string, userId: string, data: z.infer<typeof paymentSchema>) {
    const id = createId("pay_");
    await this.db.execute(
      `INSERT INTO payments (id, tenant_id, patient_id, treatment_id, amount, paid_at, method, observations)
       VALUES (:id, :tenant_id, :patient_id, :treatment_id, :amount, :paid_at, :method, :observations)`,
      {
        id,
        tenant_id: tenantId,
        patient_id: data.patientId,
        treatment_id: data.treatmentId ?? null,
        amount: data.amount,
        paid_at: new Date(data.paidAt),
        method: data.method,
        observations: data.observations ?? null,
      },
    );
    await this.audit.log({ tenantId, userId, action: "CREATE_PAYMENT", entity: "Payment", entityId: id });
    return (await this.list(tenantId)).find((item) => item.id === id);
  }
}
