import { Injectable } from "@nestjs/common";
import { endOfDay, startOfDay } from "date-fns";
import { AppointmentStatus, TreatmentStatus } from "../common/enums";
import { DatabaseService } from "./database.service";

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  async summary(tenantId: string) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [todayAppointmentsRow, upcomingAppointments, pendingPatients, activeTreatmentsRow, treatments] =
      await Promise.all([
        this.db.fetchOne<any>(
          `SELECT COUNT(*) AS total
           FROM appointments
           WHERE tenant_id = :tenant_id AND deleted_at IS NULL AND start_at >= :today_start AND start_at <= :today_end`,
          { tenant_id: tenantId, today_start: todayStart, today_end: todayEnd },
        ),
        this.db.fetchAll<any>(
          `SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
                  u.first_name AS professional_first_name, u.last_name AS professional_last_name
           FROM appointments a
           JOIN patients p ON p.id = a.patient_id
           JOIN users u ON u.id = a.professional_id
           WHERE a.tenant_id = :tenant_id
             AND a.deleted_at IS NULL
             AND a.start_at >= CURRENT_TIMESTAMP
             AND a.status <> :cancelled
           ORDER BY a.start_at ASC FETCH FIRST 5 ROWS ONLY`,
          { tenant_id: tenantId, cancelled: AppointmentStatus.CANCELLED },
        ),
        this.db.fetchAll<any>(
          `SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
                  u.first_name AS professional_first_name, u.last_name AS professional_last_name
           FROM appointments a
           JOIN patients p ON p.id = a.patient_id
           JOIN users u ON u.id = a.professional_id
           WHERE a.tenant_id = :tenant_id
             AND a.deleted_at IS NULL
             AND a.confirmation_pending = 1
           ORDER BY a.start_at ASC FETCH FIRST 5 ROWS ONLY`,
          { tenant_id: tenantId },
        ),
        this.db.fetchOne<any>(
          `SELECT COUNT(*) AS total
           FROM treatments
           WHERE tenant_id = :tenant_id AND deleted_at IS NULL AND status IN (:planned, :progress)`,
          { tenant_id: tenantId, planned: TreatmentStatus.PLANNED, progress: TreatmentStatus.IN_PROGRESS },
        ),
        this.db.fetchAll<any>(
          `SELECT t.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name
           FROM treatments t
           JOIN patients p ON p.id = t.patient_id
           WHERE t.tenant_id = :tenant_id AND t.deleted_at IS NULL
           ORDER BY t.created_at DESC FETCH FIRST 5 ROWS ONLY`,
          { tenant_id: tenantId },
        ),
      ]);

    const treatmentIds = treatments.map((row) => row.ID);
    const paymentRows = treatmentIds.length
      ? await this.db.fetchAll<any>(
          `SELECT treatment_id, amount FROM payments
           WHERE tenant_id = :tenant_id AND treatment_id IN (${treatmentIds.map((_, i) => `:t${i}`).join(", ")})`,
          Object.assign({ tenant_id: tenantId }, ...treatmentIds.map((id, i) => ({ [`t${i}`]: id }))),
        )
      : [];

    return {
      todayAppointments: Number(todayAppointmentsRow?.TOTAL ?? 0),
      activeTreatments: Number(activeTreatmentsRow?.TOTAL ?? 0),
      upcomingAppointments: upcomingAppointments.map((row) => ({
        id: row.ID,
        startAt: row.START_AT,
        reason: row.REASON,
        patient: { firstName: row.PATIENT_FIRST_NAME, lastName: row.PATIENT_LAST_NAME },
        professional: { firstName: row.PROFESSIONAL_FIRST_NAME, lastName: row.PROFESSIONAL_LAST_NAME },
      })),
      pendingPatients: pendingPatients.map((row) => ({
        id: row.ID,
        startAt: row.START_AT,
        reason: row.REASON,
        patient: { firstName: row.PATIENT_FIRST_NAME, lastName: row.PATIENT_LAST_NAME },
        professional: { firstName: row.PROFESSIONAL_FIRST_NAME, lastName: row.PROFESSIONAL_LAST_NAME },
      })),
      pendingPayments: treatments.map((treatment) => {
        const paid = paymentRows
          .filter((payment) => payment.TREATMENT_ID === treatment.ID)
          .reduce((sum, payment) => sum + Number(payment.AMOUNT), 0);
        const total = Number(treatment.FINAL_COST ?? treatment.ESTIMATED_COST);
        return {
          treatmentId: treatment.ID,
          patientName: `${treatment.PATIENT_FIRST_NAME} ${treatment.PATIENT_LAST_NAME}`,
          total,
          paid,
          pending: Math.max(total - paid, 0),
        };
      }),
    };
  }
}
