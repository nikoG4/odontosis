import { Injectable } from "@nestjs/common";
import { createId, serializeJson } from "../db/helpers";
import { DatabaseService } from "./database.service";

@Injectable()
export class AuditService {
  constructor(private db: DatabaseService) {}

  async log(input: {
    tenantId: string;
    userId?: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: unknown;
  }) {
    await this.db.execute(
      `INSERT INTO audit_logs (id, tenant_id, user_id, action, entity, entity_id, metadata)
       VALUES (:id, :tenant_id, :user_id, :action, :entity, :entity_id, :metadata)`,
      {
        id: createId("aud_"),
        tenant_id: input.tenantId,
        user_id: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entity_id: input.entityId,
        metadata: input.metadata ? serializeJson(input.metadata) : null,
      },
    );
  }
}
