import { kv } from "@vercel/kv";

export async function documentExists(ssid: string, docId: string) {
  try {
    const document = await kv.exists(`${ssid}-${docId}`);
    return Boolean(document);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createDocument(ssid: string, docId: string) {}

export async function updateDocument(
  ssid: string,
  docId: string,
  answers: FormData
) {}

export async function deleteDocument(ssid: string, docId: string) {}
