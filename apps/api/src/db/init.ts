import "reflect-metadata";
import { DatabaseService } from "../services/database.service";

async function main() {
  const db = new DatabaseService();
  await db.onModuleInit();
  await db.initSchema();
  await db.onModuleDestroy();
  console.log("Oracle schema initialized");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
