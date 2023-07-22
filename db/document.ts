import { Generated } from "kysely";
import { getEntry } from "astro:content";
import { db, sql } from "./db";

export interface Document {
  id: Generated<String>;
  doc: String;
  answers: JSON;
  userid: String;
  created: Date;
  modified: Date | null;
  title: String;
  draft: Boolean;
  test: Date;
}

const KEY = "document";
const LIMIT = 100;

export function createDocumentTable() {
  db.schema
    .createTable(KEY)
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("userid", "varchar(255)", (cb) => cb.notNull())
    .addColumn("doc", "varchar(255)", (cb) => cb.notNull())
    .addColumn("answers", "jsonb", (cb) => cb.notNull())
    .addColumn("modified", "timestamptz")
    .addColumn("created", "timestamptz", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("title", "varchar(255)", (cb) => cb.notNull())
    .addColumn("draft", "boolean", (cb) => cb.notNull())
    .execute();
}

export async function getDocument(id, userId) {
  try {
    return await db
      .selectFrom(KEY)
      .selectAll()
      .where(sql`userid::text`, "=", userId)
      .where("id", "=", id)
      .executeTakeFirst();
  } catch (e: any) {
    throw e;
  }
}

export async function getUserDocument(docId, userId) {
  try {
    return await db
      .selectFrom(KEY)
      .where(sql`userid::text`, "=", userId)
      .where("id", "=", docId)
      .select(["answers", "created", "doc", "title", "modified", "draft"])
      .executeTakeFirst();
  } catch (e: any) {
    throw e;
  }
}

export async function getDocumentSummary(docId, userId) {
  try {
    return await db
      .selectFrom(KEY)
      .where(sql`userid::text`, "=", userId)
      .where("id", "=", docId)
      .select(["answers", "doc", "title", "draft", "id"])
      .executeTakeFirst();
  } catch (e: any) {
    throw e;
  }
}

export async function getDocuments(userId, page = 1, limit = LIMIT) {
  const offset = (page - 1) * limit;

  try {
    return await db
      .selectFrom(KEY)
      .where(sql`userid::text`, "=", userId)
      .select(["created", "doc", "draft", "title", "modified", "id"])
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
    `../src/content/documents/${docId}/_schema.ts`
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
        .set({ answers: validatedAnswers, modified: sql`current_timestamp` })
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
    `../src/content/documents/${doc}/_schema.ts`
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
            draft,
            title: `${title} #${Math.floor(Math.random() * 1000)}`,
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
      .set({ draft: false, modified: sql`current_timestamp` })
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
      .set({ title, modified: sql`current_timestamp` })
      .where("id", "=", id)
      .execute();
  } catch (e: any) {
    throw e;
  }
}
