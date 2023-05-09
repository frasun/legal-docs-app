import { createKysely } from "@vercel/postgres-kysely";
import { Category } from "./categories/category";

export interface Database {
  categories: Category;
}
export const db = createKysely<Database>();
export { sql } from "kysely";
