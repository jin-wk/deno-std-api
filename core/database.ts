import "https://deno.land/x/dotenv@v3.1.0/load.ts";
import { MySQLConnector, Database } from "../deps.ts";

export let db: Database;

function initDatabase() {
  if (!db) {
    const conneciton = new MySQLConnector({
      host: Deno.env.get("DB_HOST") as string,
      port: parseInt(Deno.env.get("DB_PORT") as string),
      username: Deno.env.get("DB_USERNAME") as string,
      password: Deno.env.get("DB_PASSWORD") as string,
      database: Deno.env.get("DB_DATABASE") as string,
    });
    db = new Database(conneciton);
  }
  return db;
}

db = initDatabase();
