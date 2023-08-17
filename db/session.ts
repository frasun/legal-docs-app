import type { Answers } from "@type";
import { kv } from "@vercel/kv";

const EXPIRATION_TIME = 3600;

export async function storeAnswers(
  ssid: string,
  documentId: string,
  answers: Answers
) {
  try {
    await kv.hset(`${ssid}-${documentId}`, answers);
    await kv.expire(`${ssid}-${documentId}`, EXPIRATION_TIME);
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
    return await kv.hmget(`${ssid}-${documentId}`, ...fields);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllAnswers(ssid: string, documentId: string) {
  try {
    return await kv.hgetall(`${ssid}-${documentId}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteSessionDocument(ssid: string, documentId: string) {
  try {
    await kv.del(`${ssid}-${documentId}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
