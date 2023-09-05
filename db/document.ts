import { ObjectId } from "mongodb";
import mongo from "@db/mongodb";
import { getEntry } from "astro:content";
import type { Answers } from "@type";
import { emailRegExp, testString } from "./user";

export interface Document {
  doc: string;
  answers: Answers;
  userid: string;
  created?: Date;
  modified?: Date | null;
  title: string;
  draft: boolean;
}

const documentCollection = mongo.collection<Document>("documents");

const LIMIT = 10;

export async function getDocumentAnswers(
  id: string,
  userId: string,
  fields: string[]
) {
  type UserDocument = Pick<Document, "answers" | "doc" | "title" | "draft">;

  const selectedAnswers: Record<string, number> = {};

  fields.forEach((key) => {
    selectedAnswers[`answers.${key}`] = 1;
  });

  try {
    return await documentCollection.findOne<UserDocument>(
      { _id: new ObjectId(id), userid: userId },
      {
        projection: {
          _id: 0,
          doc: 1,
          title: 1,
          draft: 1,
          ...selectedAnswers,
        },
      }
    );
  } catch (e) {
    throw e;
  }
}

export async function getUserDocument(docId: string, userId: string) {
  type UserDocument = Pick<
    Document,
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
  type DocumentSummary = Pick<Document, "answers" | "doc" | "title" | "draft">;

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
  type TemplateId = Pick<Document, "doc">;

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

    type Documents = Omit<Document, "answers" | "userid">;

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
  try {
    const validatedAnswers: Answers = {};

    for (const [field, answer] of Object.entries(answers)) {
      const { [field]: schema } = await import(
        `../src/content/documents/${docId}/_schema.ts`
      );

      if (!schema) {
        throw new Error("missing field schema");
      }

      Object.assign(validatedAnswers, {
        [`answers.${field}`]: schema.parse(answer),
      });
    }

    return await documentCollection.updateOne(
      { _id: new ObjectId(documentId) },
      {
        $set: { ...validatedAnswers },
        $currentDate: { modified: true },
      }
    );
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
    let documentTitle: string;

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
