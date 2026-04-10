import oracledb from "oracledb";
import * as dotenv from "dotenv";
import path from "node:path";

dotenv.config();

async function run() {
  const walletDir = process.platform === "linux" 
    ? "/opt/odontosis/shared/oracle-wallet" 
    : path.join(process.cwd(), "oracle-wallet");

  console.log("Adding google_id to users via direct connection...");
  
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      configDir: walletDir,
      walletLocation: walletDir,
      walletPassword: process.env.ORACLE_WALLET_PASSWORD,
    });

    await connection.execute("ALTER TABLE users ADD google_id VARCHAR2(255)");
    await connection.commit();
    console.log("Done!");
  } catch (e: any) {
    if (e.message.includes("ORA-01430")) {
      console.log("Column already exists.");
    } else {
      console.error("Migration failed:", e.message);
    }
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

run();
