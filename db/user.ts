import { Generated } from "kysely";
import { db, sql } from "./db";

const KEY = "user";

export interface User {
  id: Generated<String>;
  email: String;
  password: String;
  active: Boolean;
  code: String;
}

export function createUserTable() {
  db.schema
    .createTable(KEY)
    .ifNotExists()
    .addColumn("id", "uuid", (cb) =>
      cb.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("email", "varchar(255)", (cb) => cb.notNull())
    .addColumn("password", "varchar(255)", (cb) => cb.notNull())
    .addColumn("active", "boolean", (cb) => cb.notNull().defaultTo(false))
    .addColumn("code", "varchar(6)", (cb) => cb.notNull())
    .execute();
}
