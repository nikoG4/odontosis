import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { RoleName } from "../common/enums";
import { createId, fromDbBool, serializeJson } from "../db/helpers";
import { AuditService } from "./audit.service";
import { BillingService } from "./billing.service";
import { DatabaseService } from "./database.service";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerClinicSchema = z.object({
  clinicName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),
  appointmentDuration: z.number().min(15).max(120).default(30),
  planId: z.enum(["START", "GROWTH", "SCALE"]).default("GROWTH"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
  adminFirstName: z.string().min(2),
  adminLastName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  paymentMethod: z.enum(["SIMULATED", "BANCARD"]).default("SIMULATED"),
  cardholderName: z.string().min(2),
  cardNumber: z.string().min(12),
});

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    private auditService: AuditService,
    private billingService: BillingService,
  ) {}

  async registerClinic(data: z.infer<typeof registerClinicSchema>) {
    const checkout = this.billingService.simulateCheckout({
      planId: data.planId,
      billingCycle: data.billingCycle,
      cardholderName: data.cardholderName,
      cardLast4: data.cardNumber.slice(-4),
    });

    const clinicId = createId("cl_");
    const userId = createId("usr_");
    const passwordHash = await bcrypt.hash(data.adminPassword, 10);

    await this.db.withConnection(async (connection) => {
      await connection.execute(
        `INSERT INTO clinics (id, name, phone, email, address, working_hours, appointment_duration, subscription_plan, subscription_status, billing_cycle, subscription_started_at, trial_ends_at)
         VALUES (:id, :name, :phone, :email, :address, :working_hours, :appointment_duration, :subscription_plan, :subscription_status, :billing_cycle, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7' DAY)`,
        {
          id: clinicId,
          name: data.clinicName,
          phone: data.phone ?? null,
          email: data.email,
          address: data.address ?? null,
          working_hours: serializeJson({
            monday: ["08:00", "18:00"],
            tuesday: ["08:00", "18:00"],
            wednesday: ["08:00", "18:00"],
            thursday: ["08:00", "18:00"],
            friday: ["08:00", "18:00"],
          }),
          appointment_duration: data.appointmentDuration,
          subscription_plan: data.planId,
          subscription_status: checkout.status,
          billing_cycle: data.billingCycle,
        },
      );

      await connection.execute(
        `INSERT INTO users (id, tenant_id, first_name, last_name, email, password_hash, role, is_active)
         VALUES (:id, :tenant_id, :first_name, :last_name, :email, :password_hash, :role, 1)`,
        {
          id: userId,
          tenant_id: clinicId,
          first_name: data.adminFirstName,
          last_name: data.adminLastName,
          email: data.adminEmail,
          password_hash: passwordHash,
          role: RoleName.CLINIC_ADMIN,
        },
      );

      await connection.execute(
        `INSERT INTO integration_configs (id, tenant_id, type, provider, config, is_enabled)
         VALUES (:id, :tenant_id, :type, :provider, :config, :is_enabled)`,
        {
          id: createId("cfg_"),
          tenant_id: clinicId,
          type: "BILLING",
          provider: checkout.provider,
          config: serializeJson({
            planId: data.planId,
            billingCycle: data.billingCycle,
            transactionId: checkout.transactionId,
            amount: checkout.amount,
            currency: checkout.currency,
            paymentMethod: data.paymentMethod,
          }),
          is_enabled: 1,
        },
      );

      await connection.execute(
        `INSERT INTO integration_configs (id, tenant_id, type, provider, config, is_enabled)
         VALUES (:id, :tenant_id, :type, :provider, :config, :is_enabled)`,
        {
          id: createId("cfg_"),
          tenant_id: clinicId,
          type: "PAYMENT_GATEWAY",
          provider: "BANCARD",
          config: serializeJson({
            ready: true,
            environment: "sandbox",
            commerceCode: "PENDING_CONFIGURATION",
            publicKey: "PENDING_CONFIGURATION",
          }),
          is_enabled: 0,
        },
      );
    });

    await this.auditService.log({
      tenantId: clinicId,
      userId,
      action: "REGISTER_CLINIC",
      entity: "Clinic",
      entityId: clinicId,
      metadata: {
        planId: data.planId,
        billingCycle: data.billingCycle,
        transactionId: checkout.transactionId,
      },
    });

    const session = await this.issueTokens({
      id: userId,
      tenantId: clinicId,
      role: RoleName.CLINIC_ADMIN,
      email: data.adminEmail,
      firstName: data.adminFirstName,
      lastName: data.adminLastName,
    });

    return {
      ...session,
      onboarding: {
        clinicId,
        planId: data.planId,
        billingCycle: data.billingCycle,
        checkout,
      },
    };
  }

  async login(data: z.infer<typeof loginSchema>) {
    const row = await this.db.fetchOne<any>(
      `SELECT id, tenant_id, role, email, first_name, last_name, password_hash, is_active
       FROM users
       WHERE LOWER(email) = LOWER(:email) FETCH FIRST 1 ROWS ONLY`,
      { email: data.email },
    );

    if (!row || !fromDbBool(row.IS_ACTIVE)) {
      throw new UnauthorizedException("Credenciales invalidas");
    }

    const isValid = await bcrypt.compare(data.password, row.PASSWORD_HASH);
    if (!isValid) {
      throw new UnauthorizedException("Credenciales invalidas");
    }

    return this.issueTokens({
      id: row.ID,
      tenantId: row.TENANT_ID,
      role: row.ROLE,
      email: row.EMAIL,
      firstName: row.FIRST_NAME,
      lastName: row.LAST_NAME,
    });
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET || "refresh-secret-demo",
    });

    const row = await this.db.fetchOne<any>(
      `SELECT id, tenant_id, role, email, first_name, last_name, refresh_token_hash
       FROM users WHERE id = :id`,
      { id: payload.sub },
    );

    if (!row?.REFRESH_TOKEN_HASH) {
      throw new ForbiddenException("Refresh invalido");
    }

    const matches = await bcrypt.compare(refreshToken, row.REFRESH_TOKEN_HASH);
    if (!matches) {
      throw new ForbiddenException("Refresh invalido");
    }

    return this.issueTokens({
      id: row.ID,
      tenantId: row.TENANT_ID,
      role: row.ROLE,
      email: row.EMAIL,
      firstName: row.FIRST_NAME,
      lastName: row.LAST_NAME,
    });
  }

  async logout(userId: string) {
    await this.db.execute("UPDATE users SET refresh_token_hash = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = :id", { id: userId });
    return { success: true };
  }

  getPlans() {
    return this.billingService.getPlans();
  }

  private async issueTokens(user: {
    id: string;
    tenantId: string;
    role: RoleName;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || "access-secret-demo",
      expiresIn: "1h",
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || "refresh-secret-demo",
      expiresIn: "7d",
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.db.execute(
      "UPDATE users SET refresh_token_hash = :hash, updated_at = CURRENT_TIMESTAMP WHERE id = :id",
      { id: user.id, hash: refreshTokenHash },
    );

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }
}
