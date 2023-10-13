import headers from "@utils/headers";
import type { Page } from "@type";

export async function getPage(url: string, pageId: string): Promise<Page> {
  const response = await fetch(`${url}/api/pages/${pageId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}
