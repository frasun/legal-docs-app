import { createKysely } from "@vercel/postgres-kysely";
import { Document, createDocumentTable } from "@db/document";
import { User, createUserTable } from "@db/user";

export interface Database {
  document: Document;
  user: User;
}
export const db = createKysely<Database>();
export { sql } from "kysely";

createUserTable();
createDocumentTable();
