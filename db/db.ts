import { createKysely } from "@vercel/postgres-kysely";
import { Document, createDocumentTable } from "./document";
import { User, createUserTable } from "./user";

export interface Database {
  document: Document;
  user: User;
}
export const db = createKysely<Database>();
export { sql } from "kysely";

createUserTable();
createDocumentTable();
