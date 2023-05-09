import { db } from "../db";

const seedData = [
  {
    name: "Motoryzacja",
    slug: "motoryzacja",
  },
];

export async function seed() {
  const createTable = await db.schema
    .createTable("categories")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("name", "varchar(255)", (cb) => cb.notNull())
    .addColumn("slug", "varchar(100)", (cb) => cb.notNull().unique())
    .execute();

  console.log(`Created "categories" table`);

  const addCategories = await db
    .insertInto("categories")
    .values(seedData)
    .execute();

  console.log("Seeded database with categories");

  return {
    createTable,
    addCategories,
  };
}
