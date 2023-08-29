import type { Answers } from "@type";
import { kv } from "@vercel/kv";

const EXPIRATION_TIME = 3600;

export async function storeAnswers(
  ssid: string,
  documentId: string,
  answers: Answers
) {
  try {
    await kv.hset(`document-${ssid}-${documentId}`, answers);
    await kv.expire(`document-${ssid}-${documentId}`, EXPIRATION_TIME);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAnswers(
  ssid: string,
  documentId: string,
  fields: string[]
) {
  try {
    return await kv.hmget(`document-${ssid}-${documentId}`, ...fields);
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
    await kv.persist(`document-${ssid}-${documentId}`);
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
