import type { Answers, UserSession } from "@type";
import { SESSION_COOKIE } from "@utils/cookies";
import { kv } from "@vercel/kv";
import { AstroCookies } from "astro";
import { z } from "astro:content";
import { getSession } from "auth-astro/server";

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
  fields?: string[]
) {
  try {
    let sessionAnswers: Answers | null = null;

    if (fields && fields.length) {
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
    throw e;
  }
}

export async function getAllAnswers(ssid: string, documentId: string) {
  try {
    return await kv.hgetall(`document-${ssid}-${documentId}`);
  } catch (e) {
    throw e;
  }
}

export async function deleteSessionDocument(
  documentId: string,
  request: Request,
  cookies: AstroCookies
) {
  try {
    const session = await getSession(request);
    const ssid = session
      ? session.user?.ssid
      : cookies.get(SESSION_COOKIE).value;

    if (!ssid) {
      throw new Error(undefined, { cause: 400 });
    }

    await kv.del(`document-${ssid}-${documentId}`);
  } catch (e) {
    throw e;
  }
}

export async function createPaymentSession(
  pid: string,
  ssid: string,
  documentId: string,
  stripeId?: string
) {
  try {
    await kv.hset(`payment-${pid}`, { ssid, documentId, stripeId });
    await kv.expire(`payment-${pid}`, PAYMENT_EXPIRATION_TIME);
    await kv.expire(`document-${ssid}-${documentId}`, PAYMENT_EXPIRATION_TIME);
  } catch (e) {
    throw e;
  }
}

export async function getPaymentSession(
  pid: string
): Promise<UserSession | null> {
  try {
    const session = (await kv.hgetall(`payment-${pid}`)) as {
      documentId: string;
      ssid: string;
      stripeId?: string;
    };

    if (!session) {
      throw new Error(undefined, { cause: 404 });
    }

    return session;
  } catch (e) {
    throw e;
  }
}

export async function deletePaymentSession(pid: string) {
  try {
    await kv.del(`payment-${pid}`);
  } catch (e) {
    throw e;
  }
}
