import { Generated } from "kysely";
import { db } from "./db";

export interface Document {
  id: Generated<number>;
  doc: string;
  answers: JSON;
}

const KEY = "document";

const seedData = [
  {
    doc: "umowa-najmu",
    answers: JSON.stringify({
      address: "91-123 Łódź, ul. Aleksandrowska 123a / 2",
      area: "65,23",
      rooms: ["2x pokój", "kuchnia", "przedpokój", "łazienka", "balkon"],
      systems: ["elektryczna", "gazowa", "wodna", "centralne ogrzewanie"],
      equipment: [
        "Toster Philips o nr seryjnym XBSDCS89734-2342234",
        "dwa fotele",
        "kanapa",
      ],
      purpose: "do celów mieszkalnych",
      rent: 2300,
      rentmethod: "płatny przelewem na konto Wynajmującego",
      rentdue: 14,
      billslandlord: [
        "zużycie energii",
        "zużycie gazu",
        "zużycie wody",
        "wywóz śmieci",
      ],
      billstenant: ["opłata za internet", "opłata telewizyjna"],
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
