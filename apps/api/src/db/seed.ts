import "reflect-metadata";
import bcrypt from "bcryptjs";
import { AppointmentStatus, PaymentMethod, RoleName, TreatmentStatus } from "../common/enums";
import { createId, serializeJson } from "../db/helpers";
import { DatabaseService } from "../services/database.service";

async function main() {
  const db = new DatabaseService();
  await db.onModuleInit();
  await db.initSchema();

  const existing = await db.fetchOne<{ ID: string }>("SELECT id FROM clinics WHERE email = :email", { email: "demo@odontosis.com" });
  if (existing) {
    console.log("Seed already present");
    await db.onModuleDestroy();
    return;
  }

  const clinicId = createId("cl_");
  const adminId = createId("usr_");
  const dentistId = createId("usr_");
  const patientId = createId("pat_");
  const treatmentId = createId("trt_");
  const appointmentId = createId("apt_");
  const paymentId = createId("pay_");
  const followUpId = createId("fol_");
  const integrationBillingId = createId("cfg_");
  const integrationAiId = createId("cfg_");
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await db.execute(
    `INSERT INTO clinics (id, name, phone, email, address, working_hours, appointment_duration, subscription_plan, subscription_status, billing_cycle, subscription_started_at, trial_ends_at)
     VALUES (:id, :name, :phone, :email, :address, :working_hours, :appointment_duration, :subscription_plan, :subscription_status, :billing_cycle, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7' DAY)`,
    {
      id: clinicId,
      name: "Clinica Demo Sonrisa",
      phone: "+595981000000",
      email: "demo@odontosis.com",
      address: "Av. Principal 123",
      working_hours: serializeJson({
        monday: ["08:00", "18:00"],
        tuesday: ["08:00", "18:00"],
        wednesday: ["08:00", "18:00"],
        thursday: ["08:00", "18:00"],
        friday: ["08:00", "18:00"],
      }),
      appointment_duration: 30,
      subscription_plan: "START",
      subscription_status: "ACTIVE",
      billing_cycle: "MONTHLY",
    },
  );

  await db.execute(
    `INSERT INTO users (id, tenant_id, first_name, last_name, email, password_hash, role, is_active)
     VALUES (:id, :tenant_id, :first_name, :last_name, :email, :password_hash, :role, 1)`,
    {
      id: adminId,
      tenant_id: clinicId,
      first_name: "Ana",
      last_name: "Admin",
      email: "admin@demo.com",
      password_hash: passwordHash,
      role: RoleName.CLINIC_ADMIN,
    },
  );

  await db.execute(
    `INSERT INTO users (id, tenant_id, first_name, last_name, email, password_hash, role, is_active)
     VALUES (:id, :tenant_id, :first_name, :last_name, :email, :password_hash, :role, 1)`,
    {
      id: dentistId,
      tenant_id: clinicId,
      first_name: "Diego",
      last_name: "Dentista",
      email: "doctor@demo.com",
      password_hash: passwordHash,
      role: RoleName.DENTIST,
    },
  );

  await db.execute(
    `INSERT INTO patients (id, tenant_id, first_name, last_name, document, phone, whatsapp, email, allergies, medical_history, notes, is_active)
     VALUES (:id, :tenant_id, :first_name, :last_name, :document, :phone, :whatsapp, :email, :allergies, :medical_history, :notes, 1)`,
    {
      id: patientId,
      tenant_id: clinicId,
      first_name: "Maria",
      last_name: "Lopez",
      document: "1234567",
      phone: "+595981111111",
      whatsapp: "+595981111111",
      email: "maria@example.com",
      allergies: "Penicilina",
      medical_history: "Sin antecedentes de riesgo",
      notes: "Paciente inicial seed",
    },
  );

  await db.execute(
    `INSERT INTO appointments (id, tenant_id, patient_id, professional_id, start_at, end_at, duration_minutes, reason, status, confirmation_pending)
     VALUES (:id, :tenant_id, :patient_id, :professional_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(30, 'MINUTE'), 30, :reason, :status, 0)`,
    {
      id: appointmentId,
      tenant_id: clinicId,
      patient_id: patientId,
      professional_id: dentistId,
      reason: "Consulta inicial",
      status: AppointmentStatus.CONFIRMED,
    },
  );

  await db.execute(
    `INSERT INTO treatments (id, tenant_id, patient_id, professional_id, type, description, status, estimated_cost, final_cost, start_date)
     VALUES (:id, :tenant_id, :patient_id, :professional_id, :type, :description, :status, :estimated_cost, :final_cost, CURRENT_TIMESTAMP)`,
    {
      id: treatmentId,
      tenant_id: clinicId,
      patient_id: patientId,
      professional_id: dentistId,
      type: "Ortodoncia",
      description: "Seguimiento mensual",
      status: TreatmentStatus.IN_PROGRESS,
      estimated_cost: 150000,
      final_cost: 150000,
    },
  );

  await db.execute(
    `INSERT INTO payments (id, tenant_id, patient_id, treatment_id, amount, paid_at, method, observations)
     VALUES (:id, :tenant_id, :patient_id, :treatment_id, :amount, CURRENT_TIMESTAMP, :method, :observations)`,
    {
      id: paymentId,
      tenant_id: clinicId,
      patient_id: patientId,
      treatment_id: treatmentId,
      amount: 50000,
      method: PaymentMethod.CASH,
      observations: "Pago seed",
    },
  );

  await db.execute(
    `INSERT INTO follow_ups (id, tenant_id, patient_id, professional_id, title, notes, due_date, frequency_days, status)
     VALUES (:id, :tenant_id, :patient_id, :professional_id, :title, :notes, CURRENT_TIMESTAMP + INTERVAL '30' DAY, 30, 'PENDING')`,
    {
      id: followUpId,
      tenant_id: clinicId,
      patient_id: patientId,
      professional_id: dentistId,
      title: "Control ortodoncia",
      notes: "Preparado para seguimiento automatico",
    },
  );

  await db.execute(
    `INSERT INTO integration_configs (id, tenant_id, type, provider, config, is_enabled)
     VALUES (:id, :tenant_id, :type, :provider, :config, :is_enabled)`,
    {
      id: integrationBillingId,
      tenant_id: clinicId,
      type: "WHATSAPP",
      provider: "stub",
      config: serializeJson({ templateNamespace: "demo" }),
      is_enabled: 0,
    },
  );

  await db.execute(
    `INSERT INTO integration_configs (id, tenant_id, type, provider, config, is_enabled)
     VALUES (:id, :tenant_id, :type, :provider, :config, :is_enabled)`,
    {
      id: integrationAiId,
      tenant_id: clinicId,
      type: "AI",
      provider: "stub",
      config: serializeJson({ features: ["intent", "suggest_slots", "summaries"] }),
      is_enabled: 0,
    },
  );

  await db.onModuleDestroy();
  console.log({ clinicId, adminId, dentistId, patientId, appointmentId, treatmentId, paymentId });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
