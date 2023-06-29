import { ColumnType, Generated } from "kysely";
import { getEntry } from "astro:content";
import { db, sql } from "./db";

export interface Document {
  id: Generated<String>;
  doc: String;
  answers: JSON;
  userid: String;
  created: String;
  modified: String | null;
  title: String;
  doctitle: String;
  draft: Boolean;
}

const KEY = "document";
const LIMIT = 100;

const currentDate = () => new Date().toISOString();

export function createDocumentTable() {
  db.schema
    .createTable(KEY)
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("userid", "varchar(255)", (cb) => cb.notNull())
    .addColumn("doc", "varchar(255)", (cb) => cb.notNull())
    .addColumn("answers", "jsonb", (cb) => cb.notNull())
    .addColumn("modified", "varchar(255)")
    .addColumn("created", "varchar(255)", (cb) => cb.notNull())
    .addColumn("title", "varchar(255)", (cb) => cb.notNull())
    .addColumn("doctitle", "varchar(255)", (cb) => cb.notNull())
    .addColumn("draft", "boolean", (cb) => cb.notNull())
    .execute();
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
    throw e;
  }
}

export async function getDocuments(userId, page = 1, limit = LIMIT) {
  const offset = (page - 1) * limit;

  try {
    return await db
      .selectFrom(KEY)
      .selectAll()
      .where(sql`userid::text`, "=", userId)
      .offset(offset)
      .limit(limit)
      .orderBy(sql`COALESCE(modified, created)`, "desc")
      .execute();
  } catch (e: any) {
    throw e;
  }
}

export async function updateAnswers(documentId, answers, docId) {
  const { default: schema } = await import(
    `../src/content/documents/_${docId}.ts`
  );

  if (!schema) {
    throw "No template found";
  }

  let validatedAnswers;

  try {
    validatedAnswers = schema.parse(answers);
    try {
      return await db
        .updateTable(KEY)
        .set({ answers: validatedAnswers, modified: currentDate() })
        .where("id", "=", documentId)
        .execute();
    } catch (e: any) {
      throw e;
    }
  } catch ({ errors }) {
    throw errors;
  }
}

export async function createDocument(doc, answers, userid, draft = false) {
  const template = await getEntry("documents", doc);
  const { default: schema } = await import(
    `../src/content/documents/_${doc}.ts`
  );

  if (!template || !schema) {
    throw "No template found";
  }

  const {
    data: { title },
  } = template;

  let validatedAnswers;

  try {
    validatedAnswers = schema.parse(answers);
    try {
      return await db
        .insertInto(KEY)
        .values([
          {
            doc,
            answers: JSON.stringify(validatedAnswers),
            userid,
            doctitle: title,
            draft,
            title: `${title} #${Math.floor(Math.random() * 1000)}`,
            created: currentDate(),
          },
        ])
        .returning("id")
        .executeTakeFirst();
    } catch (e: any) {
      throw e;
    }
  } catch ({ errors }) {
    throw errors;
  }
}

export async function publishDraft(id) {
  try {
    return await db
      .updateTable(KEY)
      .set({ draft: false, modified: currentDate() })
      .where("id", "=", id)
      .execute();
  } catch (e: any) {
    throw e;
  }
}

export async function changeDocumentName(id, title) {
  try {
    return await db
      .updateTable(KEY)
      .set({ title, modified: currentDate() })
      .where("id", "=", id)
      .execute();
  } catch (e: any) {
    throw e;
  }
}
