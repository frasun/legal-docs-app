import { Generated } from "kysely";
import { db } from "../db";
import { seed } from "./seed";

export interface Category {
  id: Generated<number>;
  name: string;
  slug: string;
}

const KEY = "categories";

async function fetchCategories() {
  return await db.selectFrom(KEY).selectAll().execute();
}

export async function getCategories() {
  try {
    return await fetchCategories();
  } catch (e: any) {
    if (e.message === `relation "${KEY}" does not exist`) {
      await seed();

      return await fetchCategories();
    } else {
      throw e;
    }
  }
}
