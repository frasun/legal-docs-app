import type { Generated } from "kysely";
import { getEntry } from "astro:content";
import { db, sql } from "@db/db";
import type { Answers } from "@type";
import { emailRegExp, testString } from "./auth";
import { ObjectId } from "mongodb";

import mongo from "@db/mongodb";

export interface Doc {
  doc: string;
  answers: Answers;
  userid: string;
  created?: Date;
  modified?: Date | null;
  title: string;
  draft: boolean;
}

const documentCollection = mongo.collection<Doc>("documents");

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
  type UserDocument = Pick<
    Doc,
    "answers" | "doc" | "title" | "draft" | "created" | "modified"
  >;

  try {
    return await documentCollection.findOne<UserDocument>(
      { _id: new ObjectId(docId), userid: userId },
      { projection: { _id: 0, userid: 0 } }
    );
  } catch (e) {
    throw e;
  }
}

export async function getDocumentSummary(docId: string, userId: string) {
  type DocumentSummary = Pick<Doc, "answers" | "doc" | "title" | "draft">;

  try {
    return await documentCollection.findOne<DocumentSummary>(
      { _id: new ObjectId(docId), userid: userId },
      { projection: { _id: 1, answers: 1, doc: 1, title: 1, draft: 1 } }
    );
  } catch (e) {
    throw e;
  }
}

export async function getDocumentId(id: string, userId: string) {
  type TemplateId = Pick<Doc, "doc">;

  try {
    const document = await documentCollection.findOne<TemplateId>(
      { _id: new ObjectId(id), userid: userId },
      { projection: { doc: 1, _id: 0 } }
    );

    return document ? document.doc : null;
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
    const userDocumentCount = await documentCollection.countDocuments({
      userid: { $eq: userId },
    });

    const pages = Math.ceil(userDocumentCount / limit);
    const offset = page && page > 0 && page <= pages ? (page - 1) * limit : 0;

    type Documents = Omit<Doc, "answers" | "userid">;

    const documents = await documentCollection
      .aggregate<Documents>([
        { $match: { userid: userId } },
        {
          $addFields: {
            sortBy: {
              $cond: {
                if: { $gt: ["$modified", null] },
                then: "$modified",
                else: "$created",
              },
            },
          },
        },
      ])
      .sort({ sortBy: -1 })
      .skip(offset)
      .limit(limit)
      .project({ answers: 0, userid: 0, sortBy: 0 });

    return {
      documents: await documents.toArray(),
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

    const anonymousUser = testString(userid, emailRegExp);
    let documentTitle;

    if (anonymousUser) {
      documentTitle = title;
    } else {
      const userDocumentCount = await documentCollection.countDocuments({
        userid: { $eq: userid },
      });

      documentTitle = `#${userDocumentCount + 1} ${title}`;
    }

    try {
      const result = await documentCollection.insertOne({
        doc,
        answers: validatedAnswers,
        userid,
        draft,
        title: documentTitle,
        created: new Date(),
      });

      return result.insertedId;
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
    return await documentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { draft: false },
        $currentDate: { modified: true },
      }
    );
  } catch (e: any) {
    throw e;
  }
}

export async function changeDocumentName(id: string, title: string) {
  try {
    return await documentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { title },
        $currentDate: { modified: true },
      }
    );
  } catch (e: any) {
    throw e;
  }
}
