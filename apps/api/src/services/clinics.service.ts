import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { parseJson, serializeJson } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";

export const updateClinicSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  email: z.string().email(),
  address: z.string().optional().nullable(),
  appointmentDuration: z.number().min(15).max(120),
  workingHours: z.record(z.array(z.string())).optional(),
});

@Injectable()
export class ClinicsService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async getClinic(tenantId: string) {
    const clinic = await this.db.fetchOne<any>("SELECT * FROM clinics WHERE id = :id", { id: tenantId });
    if (!clinic) return null;
    return {
      id: clinic.ID,
      name: clinic.NAME,
      phone: clinic.PHONE,
      email: clinic.EMAIL,
      address: clinic.ADDRESS,
      workingHours: parseJson(clinic.WORKING_HOURS, {}),
      appointmentDuration: Number(clinic.APPOINTMENT_DURATION),
      subscriptionPlan: clinic.SUBSCRIPTION_PLAN,
      subscriptionStatus: clinic.SUBSCRIPTION_STATUS,
      billingCycle: clinic.BILLING_CYCLE,
      subscriptionStartedAt: clinic.SUBSCRIPTION_STARTED_AT,
      trialEndsAt: clinic.TRIAL_ENDS_AT,
    };
  }

  async updateClinic(tenantId: string, userId: string, data: z.infer<typeof updateClinicSchema>) {
    await this.db.execute(
      `UPDATE clinics
       SET name = :name,
           phone = :phone,
           email = :email,
           address = :address,
           appointment_duration = :appointment_duration,
           working_hours = :working_hours,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = :id`,
      {
        id: tenantId,
        name: data.name,
        phone: data.phone ?? null,
        email: data.email,
        address: data.address ?? null,
        appointment_duration: data.appointmentDuration,
        working_hours: serializeJson(data.workingHours ?? {}),
      },
    );

    await this.audit.log({
      tenantId,
      userId,
      action: "UPDATE_CLINIC",
      entity: "Clinic",
      entityId: tenantId,
    });

    return this.getClinic(tenantId);
  }
}
