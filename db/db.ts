import { createKysely } from "@vercel/postgres-kysely";
import { Category } from "./categories/category";
import { Document } from "./document";

export interface Database {
  categories: Category;
  document: Document;
}
export const db = createKysely<Database>();
export { sql } from "kysely";
