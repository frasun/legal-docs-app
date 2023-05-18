import { Generated } from "kysely";
import { db } from "./db";

export interface Document {
  id: Generated<Number>;
  doc: string;
  answers: JSON;
}

const KEY = "document";

const seedData = [
  {
    doc: "umowa-najmu",
    answers: JSON.stringify({
      address: "91-123 Łódź, ul. Aleksandrowska 123a",
      apt: "23",
      area: "65,23",
      room: 2,
      kitchen: 2,
      hall: 0,
      bathroom: 1,
      toilet: 1,
      wardrobe: 2,
      garage: 0,
      systems: "elektryczna, gazowa, centralne ogrzewanie",
      equipment:
        "Toster Philips o nr seryjnym XBSDCS89734-2342234, dwa fotele, kanapa",
      purpose: "do celów mieszkalnych",
      rent: 2300,
      rentmethod: "płatny przelewem na konto Wynajmującego",
      rentdue: 14,
      billslandlord:
        "zużycie energii, zużycie gazu, zużycie wody, wywóz śmieci",
      billstenant: "opłata za internet, opłata telewizyjna",
      deposit: 2300,
      depositmethod: "płatna przelewem na konto Wynajmującego",
      repairs: 2500,
      termination: 14,
      return: 14,
    }),
  },
];

async function seed() {
  const createTable = await db.schema
    .createTable(KEY)
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("doc", "varchar(255)", (cb) => cb.notNull())
    .addColumn("answers", "jsonb", (cb) => cb.notNull())
    .execute();

  const addDocuments = await db.insertInto(KEY).values(seedData).execute();

  return {
    createTable,
    addDocuments,
  };
}

async function fetchDocument(id) {
  return await db.selectFrom(KEY).selectAll().where("id", "=", id).execute();
}

export async function getDocument(id) {
  try {
    return await fetchDocument(id);
  } catch (e: any) {
    if (e.message === `relation "${KEY}" does not exist`) {
      await seed();

      return await fetchDocument(id);
    } else {
      throw e;
    }
  }
}

export async function updateAnswers(documentId, answers) {
  try {
    return await db
      .updateTable(KEY)
      .set({ answers })
      .where("id", "=", documentId)
      .execute();
  } catch (e: any) {
    throw e;
  }
}

export async function createDocument(doc, answers) {
  try {
    return await db
      .insertInto(KEY)
      .values([{ doc, answers: JSON.stringify(answers) }])
      .returning("id")
      .executeTakeFirst();
  } catch (e: any) {
    throw e;
  }
}
