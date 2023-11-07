import { UUID } from "mongodb";
import mongo, { getDataKey, encryptField } from "@db/mongodb";
import { getEntry } from "astro:content";
import type { Answers } from "@type";
import { emailRegExp, testString } from "@utils/dataValidation";
import { WRONG_EMAIL_FORMAT } from "@utils/response";
import { sendFiles } from "@utils/email";

export interface Document {
  doc: string;
  answers: Answers;
  userId: string;
  created: Date;
  modified: Date;
  title: string;
  draft: boolean;
  shared?: Date;
  sharedWith?: string[];
}

type UserDocument = Omit<Document, "answers" | "userId" | "sharedWith">;
export type MyDocument = UserDocument & { _id: UUID };

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
      { _id: new UUID(id).toBinary(), userId },
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
    | "answers"
    | "doc"
    | "title"
    | "draft"
    | "created"
    | "modified"
    | "shared"
    | "sharedWith"
  >;

  try {
    return await documentCollection.findOne<UserDocument>(
      { _id: new UUID(docId).toBinary(), userId },
      { projection: { _id: 0, userId: 0 } }
    );
  } catch (e) {
    throw e;
  }
}

export async function getDocumentSummary(docId: string, userId: string) {
  type DocumentSummary = Pick<Document, "answers" | "doc" | "title" | "draft">;

  try {
    return await documentCollection.findOne<DocumentSummary>(
      { _id: new UUID(docId).toBinary(), userId },
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
      { _id: new UUID(id).toBinary(), userId },
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
      userId: { $eq: userId },
    });

    const pages = Math.ceil(userDocumentCount / limit);
    const offset = page && page > 0 && page <= pages ? (page - 1) * limit : 0;

    const documents = (await documentCollection
      .find({ userId })
      .sort({ modified: -1 })
      .skip(offset)
      .limit(limit)
      .project({ answers: 0, userId: 0, sharedWith: 0 })
      .toArray()) as MyDocument[];

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
  docId: string,
  encryptedFields?: string[]
) {
  try {
    const validatedAnswers: Answers = {};
    const schema = await import(`../src/documentSchema/${docId}.ts`);

    if (!schema) {
      throw new Error("missing field schema");
    }

    for (const [field, answer] of Object.entries(answers)) {
      const fieldSchema = schema[field];
      let parsedAnswer = fieldSchema.parse(answer);

      if (
        encryptedFields &&
        encryptedFields.includes(field) &&
        parsedAnswer !== ""
      ) {
        const key = await getDataKey();

        if (key) {
          parsedAnswer = await encryptField(parsedAnswer, key);
        }
      }

      Object.assign(validatedAnswers, {
        [`answers.${field}`]: parsedAnswer,
      });
    }

    return await documentCollection.updateOne(
      { _id: new UUID(documentId).toBinary() },
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
  userId: string,
  draft = false
) {
  const template = await getEntry("documents", doc);
  const { default: schema } = await import(`../src/documentSchema/${doc}.ts`);

  if (!template || !schema) {
    throw "No template found";
  }

  const {
    data: { title, encryptedFields },
  } = template;

  let validatedAnswers: Answers;

  try {
    validatedAnswers = schema.parse(answers);

    if (encryptedFields) {
      const dataKey = await getDataKey();

      if (dataKey) {
        for (let key of encryptedFields) {
          if (validatedAnswers[key] !== "") {
            validatedAnswers[key] = await encryptField(
              validatedAnswers[key],
              dataKey
            );
          }
        }
      }
    }

    const anonymousUser = testString(userId, emailRegExp);
    let documentTitle: string;

    if (anonymousUser) {
      documentTitle = title;
    } else {
      const userDocumentCount = await documentCollection.countDocuments({
        userId: { $eq: userId },
      });

      documentTitle = `#${userDocumentCount + 1} ${title}`;
    }

    try {
      const created = new Date();
      const result = await documentCollection.insertOne({
        doc,
        answers: validatedAnswers,
        userId,
        draft,
        title: documentTitle,
        created,
        modified: created,
      });

      return new UUID(result.insertedId.toString("hex"));
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
      { _id: new UUID(id).toBinary() },
      {
        $set: { draft: false },
        $currentDate: { modified: true },
      }
    );
  } catch (e: any) {
    throw e;
  }
}

export async function deleteDraft(documentId: string, userId: string) {
  try {
    return await documentCollection.deleteOne({
      _id: new UUID(documentId).toBinary(),
      userId,
      draft: true,
    });
  } catch (e: any) {
    throw e;
  }
}

export async function changeDocumentName(
  id: string,
  userId: string,
  title: string
) {
  try {
    return await documentCollection.updateOne(
      { _id: new UUID(id).toBinary(), userId },
      {
        $set: { title },
        $currentDate: { modified: true },
      }
    );
  } catch (e) {
    throw e;
  }
}

export async function shareDocument(
  pdf: string,
  pdfTitle: string,
  emailList: string[],
  documentTemplate: string,
  sender: string,
  documentId: string,
  userId: string
) {
  if (!emailList.length) {
    throw new Error("empty email list");
  }

  for (let email of emailList) {
    const isEmail = testString(email, emailRegExp);

    if (!isEmail) {
      throw new Error(`${WRONG_EMAIL_FORMAT}: ${email}`);
    }
  }

  try {
    const document = await documentCollection.findOne<Document>({
      _id: new UUID(documentId).toBinary(),
      userId,
    });

    if (document) {
      let emails = [];
      for (let email of emailList) {
        emails.push({
          From: import.meta.env.POSTMARK_SENDER,
          To: email,
          TemplateAlias: "document-sharing",
          TemplateModel: {
            sender,
            documentTemplate,
          },
          InlineCss: false,
          Attachments: [
            {
              Name: `${pdfTitle}.pdf`,
              Content: pdf,
              ContentType: "application/octet-stream",
              ContentID: "",
            },
          ],
        });
      }

      await sendFiles(emails);

      const response = await documentCollection.updateOne(
        { _id: new UUID(documentId).toBinary() },
        {
          $set: { sharedWith: emailList },
          $currentDate: { shared: true },
        }
      );

      return response.acknowledged;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
}

export async function copyDocument(documentId: string, userId: string) {
  try {
    const document = await documentCollection.findOne(
      {
        _id: new UUID(documentId).toBinary(),
        userId,
      },
      { projection: { _id: 0, shared: 0, sharedWith: 0 } }
    );

    if (document) {
      const newDocument = await documentCollection.insertOne({
        ...document,
        created: new Date(),
        modified: new Date(),
        draft: true,
        title: `(Kopia) ${document.title}`,
      });

      return newDocument.insertedId;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
}
