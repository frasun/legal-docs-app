import type { Generated } from "kysely";
import { getEntry } from "astro:content";
import { db, sql } from "@db/db";
import type { Answers } from "@type";

export interface Document {
  id?: Generated<string>;
  doc: string;
  answers: Answers;
  userid: string;
  created?: Date;
  modified?: Date | null;
  title: string;
  draft: boolean;
}

const KEY = "document";
const LIMIT = 10;

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
    .addColumn("title", "varchar(50)", (cb) => cb.notNull())
    .addColumn("draft", "boolean", (cb) => cb.notNull())
    .execute();
}

export async function getDocument(id: string, userId: string) {
  try {
    return await db
      .selectFrom(KEY)
      .selectAll()
      .where(sql`userid::text`, "=", userId)
      .where("id", "=", id)
      .select(["answers", "doc", "title", "draft"])
      .executeTakeFirst();
  } catch (e) {
    throw e;
  }
}

export async function getUserDocument(docId: string, userId: string) {
  try {
    return await db
      .selectFrom(KEY)
      .where(sql`userid::text`, "=", userId)
      .where("id", "=", docId)
      .select(["answers", "created", "doc", "title", "modified", "draft"])
      .executeTakeFirst();
  } catch (e) {
    throw e;
  }
}

export async function getDocumentSummary(docId: string, userId: string) {
  try {
    return await db
      .selectFrom(KEY)
      .where(sql`userid::text`, "=", userId)
      .where("id", "=", docId)
      .select(["answers", "doc", "title", "draft", "id"])
      .executeTakeFirst();
  } catch (e) {
    throw e;
  }
}

export async function getDocuments(
  userId: string,
  page?: number,
  limit: number = LIMIT
) {
  try {
    const query = db.selectFrom(KEY).where(sql`userid::text`, "=", userId);

    const count = await query
      .select((eb) => eb.fn.countAll().as("length"))
      .execute();

    const pages = Math.floor(Number(count[0].length) / limit);
    const offset = page && page > 0 && page <= pages ? (page - 1) * limit : 0;

    const documents = await query
      .select(["created", "doc", "draft", "title", "modified", "id"])
      .offset(offset)
      .limit(limit)
      .orderBy(sql`COALESCE(modified, created)`, "desc")
      .execute();

    return {
      documents,
      pages,
      currentPage: offset / limit + 1,
    };
  } catch (e) {
    throw e;
  }
}

export async function updateAnswers(
  documentId: string,
  answers: Answers,
  docId: string
) {
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
  } catch (errors) {
    console.log(errors);
    throw errors;
  }
}

export async function createDocument(
  doc: string,
  answers: Answers,
  userid: string,
  draft = false
) {
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

  let validatedAnswers: Answers;

  try {
    validatedAnswers = schema.parse(answers);
    try {
      return await db
        .insertInto(KEY)
        .values([
          {
            doc,
            answers: validatedAnswers,
            userid,
            draft,
            title: `${title} #${Math.floor(Math.random() * 1000)}`,
          },
        ])
        .returning("id")
        .executeTakeFirst();
    } catch (e) {
      throw e;
    }
  } catch (errors) {
    console.log(errors);
    throw errors;
  }
}

export async function publishDraft(id: string) {
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

export async function changeDocumentName(id: string, title: string) {
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
