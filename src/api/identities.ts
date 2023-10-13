import type { UserIdentities } from "@type";
import headers from "@utils/headers";
import { DATA_TYPE } from "@utils/urlParams";

export async function getIdentities(
  url: string,
  userId?: string,
  type?: string
): Promise<UserIdentities> {
  const requestUrl = new URL(`/api/identities/${userId}`, url);

  if (type) {
    requestUrl.searchParams.append(DATA_TYPE, type);
  }

  const response = await fetch(requestUrl, { headers });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}
