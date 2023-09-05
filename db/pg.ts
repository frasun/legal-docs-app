import { createKysely } from "@vercel/postgres-kysely";
import type { Generated } from "kysely";
import { sql } from "kysely";

export interface User {
  id: Generated<string>;
  created?: Date;
  email: string;
  password: string;
}

export interface Database {
  user: User;
}
export const pg = createKysely<Database>();

function createUserTable() {
  pg.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "uuid", (cb) =>
      cb.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn("created", "timestamptz", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("email", "varchar(255)", (cb) => cb.notNull())
    .addColumn("password", "varchar(255)", (cb) => cb.notNull())
    .execute();
}

createUserTable();
