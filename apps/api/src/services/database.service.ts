import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import oracledb, { BindParameters, Connection, ExecuteOptions } from "oracledb";
import { schemaStatements } from "../db/schema";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
oracledb.fetchAsString = [oracledb.CLOB];

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    await this.createPool();
  }

  async onModuleDestroy() {
    try {
      const pool = oracledb.getPool();
      if (pool) {
        await pool.close(0);
      }
    } catch {
      return;
    }
  }

  private async createPool() {
    try {
      await oracledb.createPool({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNECT_STRING,
        configDir: process.env.ORACLE_WALLET_DIR || "./oracle-wallet",
        walletLocation: process.env.ORACLE_WALLET_DIR || "./oracle-wallet",
        walletPassword: process.env.ORACLE_WALLET_PASSWORD || undefined,
        poolMin: 0,
        poolMax: 2,
        poolIncrement: 1,
        stmtCacheSize: 10,
        poolTimeout: 60,
        queueMax: 25,
        enableStatistics: false,
      });
      this.logger.log("Oracle pool ready");
    } catch (error) {
      this.logger.error(`Oracle pool init failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getConnection() {
    return oracledb.getConnection();
  }

  async execute(sql: string, binds: BindParameters = {}, options: ExecuteOptions = {}) {
    const connection = await this.getConnection();
    try {
      const sanitizedBinds = Object.fromEntries(
        Object.entries((binds ?? {}) as Record<string, unknown>).filter(([, value]) => value !== undefined),
      );
      return await connection.execute(sql, sanitizedBinds, options);
    } finally {
      await connection.close();
    }
  }

  async executeMany(statements: string[]) {
    for (const statement of statements) {
      try {
        await this.execute(statement);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes("ORA-00955")) {
          throw error;
        }
      }
    }
  }

  async fetchOne<T = Record<string, unknown>>(sql: string, binds: BindParameters = {}) {
    const result = await this.execute(sql, binds);
    const rows = (result.rows ?? []) as T[];
    return rows[0] ?? null;
  }

  async fetchAll<T = Record<string, unknown>>(sql: string, binds: BindParameters = {}) {
    const result = await this.execute(sql, binds);
    return (result.rows ?? []) as T[];
  }

  async withConnection<T>(fn: (connection: Connection) => Promise<T>) {
    const connection = await this.getConnection();
    try {
      return await fn(connection);
    } finally {
      await connection.close();
    }
  }

  async initSchema() {
    await this.executeMany(schemaStatements);
  }
}
