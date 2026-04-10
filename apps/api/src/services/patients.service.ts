import { Injectable, NotFoundException } from "@nestjs/common";
import { z } from "zod";
import { createId, fromDbBool } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";

export const patientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  document: z.string().optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

@Injectable()
export class PatientsService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async list(tenantId: string, query?: string) {
    const sql = query
      ? `SELECT * FROM patients
         WHERE tenant_id = :tenant_id AND deleted_at IS NULL
           AND (LOWER(first_name) LIKE LOWER(:q) OR LOWER(last_name) LIKE LOWER(:q) OR LOWER(NVL(document, '')) LIKE LOWER(:q))
         ORDER BY last_name ASC, first_name ASC`
      : `SELECT * FROM patients
         WHERE tenant_id = :tenant_id AND deleted_at IS NULL
         ORDER BY last_name ASC, first_name ASC`;
    const binds = query
      ? {
          tenant_id: tenantId,
          q: `%${query}%`,
        }
      : {
          tenant_id: tenantId,
        };
    const rows = await this.db.fetchAll<any>(sql, binds);
    return rows.map((row) => this.mapPatient(row));
  }

  async getOne(tenantId: string, id: string) {
    const patient = await this.db.fetchOne<any>(
      `SELECT * FROM patients WHERE id = :id AND tenant_id = :tenant_id AND deleted_at IS NULL`,
      { id, tenant_id: tenantId },
    );
    if (!patient) {
      throw new NotFoundException("Paciente no encontrado");
    }

    const [appointments, clinicalNotes, treatments, payments, followUps] = await Promise.all([
      this.db.fetchAll<any>(
        `SELECT a.*, u.first_name AS professional_first_name, u.last_name AS professional_last_name
         FROM appointments a
         JOIN users u ON u.id = a.professional_id
         WHERE a.patient_id = :patient_id AND a.tenant_id = :tenant_id AND a.deleted_at IS NULL
         ORDER BY a.start_at DESC FETCH FIRST 10 ROWS ONLY`,
        { patient_id: id, tenant_id: tenantId },
      ),
      this.db.fetchAll<any>(
        `SELECT n.*, u.first_name AS professional_first_name, u.last_name AS professional_last_name
         FROM clinical_notes n
         JOIN users u ON u.id = n.professional_id
         WHERE n.patient_id = :patient_id AND n.tenant_id = :tenant_id
         ORDER BY n.note_date DESC`,
        { patient_id: id, tenant_id: tenantId },
      ),
      this.db.fetchAll<any>(
        `SELECT t.*, u.first_name AS professional_first_name, u.last_name AS professional_last_name
         FROM treatments t
         LEFT JOIN users u ON u.id = t.professional_id
         WHERE t.patient_id = :patient_id AND t.tenant_id = :tenant_id AND t.deleted_at IS NULL
         ORDER BY t.created_at DESC`,
        { patient_id: id, tenant_id: tenantId },
      ),
      this.db.fetchAll<any>(
        `SELECT * FROM payments
         WHERE patient_id = :patient_id AND tenant_id = :tenant_id
         ORDER BY paid_at DESC`,
        { patient_id: id, tenant_id: tenantId },
      ),
      this.db.fetchAll<any>(
        `SELECT * FROM follow_ups
         WHERE patient_id = :patient_id AND tenant_id = :tenant_id
         ORDER BY due_date ASC`,
        { patient_id: id, tenant_id: tenantId },
      ),
    ]);

    return {
      ...this.mapPatient(patient),
      appointments: appointments.map((row) => ({
        id: row.ID,
        startAt: row.START_AT,
        endAt: row.END_AT,
        durationMinutes: Number(row.DURATION_MINUTES),
        reason: row.REASON,
        status: row.STATUS,
        professional: {
          firstName: row.PROFESSIONAL_FIRST_NAME,
          lastName: row.PROFESSIONAL_LAST_NAME,
        },
      })),
      clinicalNotes: clinicalNotes.map((row) => ({
        id: row.ID,
        date: row.NOTE_DATE,
        reason: row.REASON,
        diagnosis: row.DIAGNOSIS,
        procedure: row.PROCEDURE_TEXT,
        indications: row.INDICATIONS,
        observations: row.OBSERVATIONS,
        professional: {
          firstName: row.PROFESSIONAL_FIRST_NAME,
          lastName: row.PROFESSIONAL_LAST_NAME,
        },
      })),
      treatments: treatments.map((row) => ({
        id: row.ID,
        type: row.TYPE,
        description: row.DESCRIPTION,
        status: row.STATUS,
        estimatedCost: Number(row.ESTIMATED_COST),
        finalCost: row.FINAL_COST == null ? null : Number(row.FINAL_COST),
        startDate: row.START_DATE,
        endDate: row.END_DATE,
        professional: row.PROFESSIONAL_FIRST_NAME
          ? { firstName: row.PROFESSIONAL_FIRST_NAME, lastName: row.PROFESSIONAL_LAST_NAME }
          : null,
      })),
      payments: payments.map((row) => ({
        id: row.ID,
        amount: Number(row.AMOUNT),
        paidAt: row.PAID_AT,
        method: row.METHOD,
        observations: row.OBSERVATIONS,
      })),
      followUps: followUps.map((row) => ({
        id: row.ID,
        title: row.TITLE,
        notes: row.NOTES,
        dueDate: row.DUE_DATE,
        frequencyDays: row.FREQUENCY_DAYS == null ? null : Number(row.FREQUENCY_DAYS),
        status: row.STATUS,
      })),
    };
  }

  async create(tenantId: string, userId: string, data: z.infer<typeof patientSchema>) {
    const id = createId("pat_");
    await this.db.execute(
      `INSERT INTO patients (id, tenant_id, first_name, last_name, document, birth_date, phone, whatsapp, email, address, allergies, medical_history, notes, is_active)
       VALUES (:id, :tenant_id, :first_name, :last_name, :document, :birth_date, :phone, :whatsapp, :email, :address, :allergies, :medical_history, :notes, :is_active)`,
      {
        id,
        tenant_id: tenantId,
        first_name: data.firstName,
        last_name: data.lastName,
        document: data.document ?? null,
        birth_date: data.birthDate ? new Date(data.birthDate) : null,
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
        email: data.email ?? null,
        address: data.address ?? null,
        allergies: data.allergies ?? null,
        medical_history: data.medicalHistory ?? null,
        notes: data.notes ?? null,
        is_active: data.isActive ? 1 : 0,
      },
    );
    await this.audit.log({ tenantId, userId, action: "CREATE_PATIENT", entity: "Patient", entityId: id });
    const created = await this.db.fetchOne<any>("SELECT * FROM patients WHERE id = :id", { id });
    return this.mapPatient(created);
  }

  private mapPatient(row: any) {
    return {
      id: row.ID,
      tenantId: row.TENANT_ID,
      firstName: row.FIRST_NAME,
      lastName: row.LAST_NAME,
      document: row.DOCUMENT,
      birthDate: row.BIRTH_DATE,
      phone: row.PHONE,
      whatsapp: row.WHATSAPP,
      email: row.EMAIL,
      address: row.ADDRESS,
      allergies: row.ALLERGIES,
      medicalHistory: row.MEDICAL_HISTORY,
      notes: row.NOTES,
      isActive: fromDbBool(row.IS_ACTIVE),
      createdAt: row.CREATED_AT,
      updatedAt: row.UPDATED_AT,
    };
  }
}
