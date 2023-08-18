import type { Generated } from "kysely";
import { db, sql } from "@db/db";

const KEY = "user";

export interface User {
  id: Generated<string>;
  created?: Date;
  email: string;
  password: string;
  active?: boolean;
  code?: string;
}

export function createUserTable() {
  db.schema
    .createTable(KEY)
    .ifNotExists()
    .addColumn("id", "uuid", (cb) =>
      cb.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("created", "timestamptz", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("email", "varchar(255)", (cb) => cb.notNull())
    .addColumn("password", "varchar(255)", (cb) => cb.notNull())
    .addColumn("active", "boolean", (cb) => cb.notNull().defaultTo(false))
    .addColumn("code", "varchar(6)", (cb) => cb.notNull())
    .execute();
}
