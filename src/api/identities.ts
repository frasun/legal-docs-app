import type { Identity, UserIdentities } from "@type";
import { DATA_TYPE } from "@utils/urlParams";
import { API_URL, apiRequest, headers } from "@api/helpers/request";

export async function getIdentities(
  userId?: string,
  type?: string
): Promise<UserIdentities> {
  const requestUrl = new URL(`/api/identities/${userId}`, API_URL);

  if (type) {
    requestUrl.searchParams.append(DATA_TYPE, type);
  }

  return await apiRequest(requestUrl, headers);
}

export async function getIdentity(
  cookie: string,
  userId?: string,
  identityId?: string
): Promise<Identity> {
  const requestUrl = new URL(
    `/api/identities/${userId}/${identityId}`,
    API_URL
  );

  return await apiRequest(requestUrl, { cookie });
}
