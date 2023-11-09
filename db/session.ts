import type { Answers } from "@type";
import { kv } from "@vercel/kv";

const DOCUMENT_EXPIRATION_TIME = 3600;
const PAYMENT_EXPIRATION_TIME = 86400;

export async function storeAnswers(
  ssid: string,
  documentId: string,
  answers: Answers
) {
  try {
    const validatedAnswers: Answers = {};
    const schema = await import(`../src/documentSchema/${documentId}.ts`);

    if (!schema) {
      throw new Error("missing field schema");
    }

    for (const [field, answer] of Object.entries(answers)) {
      const fieldSchema = schema[field];

      Object.assign(validatedAnswers, {
        [field]: fieldSchema.parse(answer),
      });
    }

    await kv.hset(`document-${ssid}-${documentId}`, validatedAnswers);
    await kv.expire(`document-${ssid}-${documentId}`, DOCUMENT_EXPIRATION_TIME);
  } catch (e) {
    throw e;
  }
}

export async function getAnswers(
  ssid: string,
  documentId: string,
  fields: string[]
) {
  try {
    let sessionAnswers: Answers | null = null;

    if (fields.length) {
      sessionAnswers = await kv.hmget(
        `document-${ssid}-${documentId}`,
        ...fields
      );
    } else {
      sessionAnswers = await kv.hgetall(`document-${ssid}-${documentId}`);
    }

    let answers: Answers = {};

    if (sessionAnswers) {
      for (let [key, value] of Object.entries(sessionAnswers)) {
        if (value !== null) {
          answers[key] = value;
        }
      }
    }

    return answers;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllAnswers(ssid: string, documentId: string) {
  try {
    return await kv.hgetall(`document-${ssid}-${documentId}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteSessionDocument(ssid: string, documentId: string) {
  try {
    await kv.del(`document-${ssid}-${documentId}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createPaymentSession(
  pid: string,
  ssid: string,
  documentId: string
) {
  try {
    await kv.hset(`payment-${pid}`, { ssid, documentId });
    await kv.expire(`payment-${pid}`, PAYMENT_EXPIRATION_TIME);
    await kv.expire(`document-${ssid}-${documentId}`, PAYMENT_EXPIRATION_TIME);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getPaymentSession(pid: string) {
  try {
    return await kv.hgetall(`payment-${pid}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deletePaymentSession(pid: string) {
  try {
    await kv.del(`payment-${pid}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
