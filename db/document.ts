import { Generated } from "kysely";
import { db } from "./db";

export interface Document {
  id: Generated<Number>;
  doc: String;
  answers: JSON;
  userid: Number;
  created: Generated<Date>;
  title: String;
  doctitle: String;
  draft: Boolean;
}

const KEY = "document";

const seedData = [
  {
    doc: "umowa-najmu",
    title: "Umowa najmu lokalu #1",
    doctitle: "Umowa najmu lokalu",
    userid: 5,
    created: Date.now(),
    draft: false,
    answers: JSON.stringify({
      address: "91-123 Łódź, ul. Aleksandrowska 123a",
      apt: 23,
      area: 295,
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
    .addColumn("userid", "integer", (cb) => cb.notNull())
    .addColumn("doc", "varchar(255)", (cb) => cb.notNull())
    .addColumn("answers", "jsonb", (cb) => cb.notNull())
    .addColumn("created", "timestamp", (cb) => cb.notNull())
    .addColumn("title", "varchar(255)", (cb) => cb.notNull())
    .addColumn("doctitle", "varchar(255)", (cb) => cb.notNull())
    .addColumn("draft", "boolean", (cb) => cb.notNull())
    .execute();

  const addDocuments = await db.insertInto(KEY).values(seedData).execute();

  return {
    createTable,
    addDocuments,
  };
}

async function fetchDocument(id) {
  return await db
    .selectFrom(KEY)
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
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

export async function getDocuments(userId) {
  try {
    return await db
      .selectFrom(KEY)
      .selectAll()
      .where("userid", "=", userId)
      .orderBy("created", "desc")
      .execute();
  } catch (e: any) {
    throw e;
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

export async function createDocument(doc, answers, userid, draft = false) {
  try {
    const {
      frontmatter: { title },
    } = await import(`../src/templates/documents/${doc}.mdx`);

    return await db
      .insertInto(KEY)
      .values([
        {
          doc,
          answers: JSON.stringify(answers),
          userid,
          created: new Date(),
          doctitle: title,
          draft,
          title: `${title} #${Math.floor(Math.random() * 1000)}`,
        },
      ])
      .returning("id")
      .executeTakeFirst();
  } catch (e: any) {
    throw e;
  }
}
