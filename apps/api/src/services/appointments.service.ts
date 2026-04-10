import { BadRequestException, Injectable } from "@nestjs/common";
import { z } from "zod";
import { AppointmentStatus } from "../common/enums";
import { createId, fromDbBool } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";
import { IntegrationService } from "./integration.service";

export const appointmentSchema = z.object({
  patientId: z.string().min(1),
  professionalId: z.string().min(1),
  startAt: z.string().datetime(),
  durationMinutes: z.number().min(15).max(240),
  reason: z.string().min(2),
});

export const appointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});

@Injectable()
export class AppointmentsService {
  constructor(
    private db: DatabaseService,
    private audit: AuditService,
    private integration: IntegrationService,
  ) {}

  async list(tenantId: string, from?: string, to?: string) {
    let sql = `
      SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             u.first_name AS professional_first_name, u.last_name AS professional_last_name, u.role AS professional_role
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN users u ON u.id = a.professional_id
      WHERE a.tenant_id = :tenant_id AND a.deleted_at IS NULL`;
    const binds: any = { tenant_id: tenantId };
    if (from) {
      sql += " AND a.start_at >= :from_date";
      binds.from_date = new Date(from);
    }
    if (to) {
      sql += " AND a.start_at <= :to_date";
      binds.to_date = new Date(to);
    }
    sql += " ORDER BY a.start_at ASC";
    const rows = await this.db.fetchAll<any>(sql, binds);
    return rows.map((row) => this.mapAppointment(row));
  }

  async create(tenantId: string, userId: string, data: z.infer<typeof appointmentSchema>) {
    const id = createId("apt_");
    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt.getTime() + data.durationMinutes * 60000);
    const conflict = await this.db.fetchOne<any>(
      `SELECT id FROM appointments
       WHERE tenant_id = :tenant_id
         AND professional_id = :professional_id
         AND deleted_at IS NULL
         AND status <> :cancelled
         AND start_at < :end_at
         AND end_at > :start_at
       FETCH FIRST 1 ROWS ONLY`,
      {
        tenant_id: tenantId,
        professional_id: data.professionalId,
        cancelled: AppointmentStatus.CANCELLED,
        end_at: endAt,
        start_at: startAt,
      },
    );

    if (conflict) {
      throw new BadRequestException("Existe conflicto de horario para el profesional");
    }

    await this.db.execute(
      `INSERT INTO appointments (id, tenant_id, patient_id, professional_id, start_at, end_at, duration_minutes, reason, status, confirmation_pending)
       VALUES (:id, :tenant_id, :patient_id, :professional_id, :start_at, :end_at, :duration_minutes, :reason, :status, 1)`,
      {
        id,
        tenant_id: tenantId,
        patient_id: data.patientId,
        professional_id: data.professionalId,
        start_at: startAt,
        end_at: endAt,
        duration_minutes: data.durationMinutes,
        reason: data.reason,
        status: AppointmentStatus.PENDING_CONFIRMATION,
      },
    );

    const created = await this.db.fetchOne<any>(
      `SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              u.first_name AS professional_first_name, u.last_name AS professional_last_name, u.role AS professional_role
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN users u ON u.id = a.professional_id
       WHERE a.id = :id`,
      { id },
    );

    await this.integration.prepareReminder({
      tenantId,
      appointmentId: id,
      patientName: `${created.PATIENT_FIRST_NAME} ${created.PATIENT_LAST_NAME}`,
      scheduledAt: created.START_AT,
    });

    await this.audit.log({ tenantId, userId, action: "CREATE_APPOINTMENT", entity: "Appointment", entityId: id });
    return this.mapAppointment(created);
  }

  async updateStatus(tenantId: string, userId: string, id: string, status: AppointmentStatus) {
    await this.db.execute(
      `UPDATE appointments
       SET status = :status,
           confirmation_pending = :pending,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = :id`,
      {
        id,
        status,
        pending: status === AppointmentStatus.PENDING_CONFIRMATION ? 1 : 0,
      },
    );

    const updated = await this.db.fetchOne<any>(
      `SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              u.first_name AS professional_first_name, u.last_name AS professional_last_name, u.role AS professional_role
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN users u ON u.id = a.professional_id
       WHERE a.id = :id`,
      { id },
    );

    await this.audit.log({ tenantId, userId, action: "UPDATE_APPOINTMENT_STATUS", entity: "Appointment", entityId: id, metadata: { status } });
    return this.mapAppointment(updated);
  }

  private mapAppointment(row: any) {
    return {
      id: row.ID,
      tenantId: row.TENANT_ID,
      patientId: row.PATIENT_ID,
      professionalId: row.PROFESSIONAL_ID,
      startAt: row.START_AT,
      endAt: row.END_AT,
      durationMinutes: Number(row.DURATION_MINUTES),
      reason: row.REASON,
      status: row.STATUS,
      confirmationPending: fromDbBool(row.CONFIRMATION_PENDING),
      patient: {
        id: row.PATIENT_ID,
        firstName: row.PATIENT_FIRST_NAME,
        lastName: row.PATIENT_LAST_NAME,
      },
      professional: {
        id: row.PROFESSIONAL_ID,
        firstName: row.PROFESSIONAL_FIRST_NAME,
        lastName: row.PROFESSIONAL_LAST_NAME,
        role: row.PROFESSIONAL_ROLE,
      },
    };
  }
}
