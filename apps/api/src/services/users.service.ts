import { Injectable } from "@nestjs/common";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { RoleName } from "../common/enums";
import { createId, fromDbBool } from "../db/helpers";
import { AuditService } from "./audit.service";
import { DatabaseService } from "./database.service";

export const createUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.nativeEnum(RoleName),
});

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService, private audit: AuditService) {}

  async listProfessionals(tenantId: string) {
    const rows = await this.db.fetchAll<any>(
      `SELECT id, first_name, last_name, email, role, is_active
       FROM users
       WHERE tenant_id = :tenant_id AND is_active = 1
       ORDER BY role ASC, first_name ASC`,
      { tenant_id: tenantId },
    );

    return rows.map((row) => ({
      id: row.ID,
      firstName: row.FIRST_NAME,
      lastName: row.LAST_NAME,
      email: row.EMAIL,
      role: row.ROLE,
      isActive: fromDbBool(row.IS_ACTIVE),
    }));
  }

  async create(tenantId: string, userId: string, data: z.infer<typeof createUserSchema>) {
    const id = createId("usr_");
    const passwordHash = await bcrypt.hash(data.password, 10);
    await this.db.execute(
      `INSERT INTO users (id, tenant_id, first_name, last_name, email, phone, password_hash, role, is_active)
       VALUES (:id, :tenant_id, :first_name, :last_name, :email, :phone, :password_hash, :role, 1)`,
      {
        id,
        tenant_id: tenantId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone ?? null,
        password_hash: passwordHash,
        role: data.role,
      },
    );
    await this.audit.log({ tenantId, userId, action: "CREATE_USER", entity: "User", entityId: id });
    return { id, firstName: data.firstName, lastName: data.lastName, email: data.email, role: data.role };
  }
}
