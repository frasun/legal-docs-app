import { createKysely } from "@vercel/postgres-kysely";
import { Category } from "./categories/category";
import { Document } from "./document";

export interface Database {
  categories: Category;
  document: Document;
  users: {
    id: number;
    email: string;
    password: string;
    name: string;
    emailverified: string;
    image: string;
  };
}
export const db = createKysely<Database>();
export { sql } from "kysely";
