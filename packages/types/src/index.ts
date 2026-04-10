export type RoleName = "CLINIC_ADMIN" | "DENTIST" | "RECEPTIONIST";

export type AppointmentStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "ATTENDED"
  | "NO_SHOW";

export type TreatmentStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "OTHER";

export interface AuthUser {
  id: string;
  tenantId: string;
  role: RoleName;
  firstName: string;
  lastName: string;
  email: string;
}
