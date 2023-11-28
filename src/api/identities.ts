import type { Identity, UserIdentities } from "@type";
import { DATA_TYPE } from "@utils/urlParams";
import { apiRequest } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";

export async function getIdentities(
  cookie: string,
  type?: string
): Promise<UserIdentities> {
  const requestUrl = new URL(`/api/identities`, API_URL);

  if (type) {
    requestUrl.searchParams.append(DATA_TYPE, type);
  }

  return await apiRequest(requestUrl, { cookie });
}

export async function getIdentity(
  identityId: string,
  cookie?: string
): Promise<Identity> {
  const requestUrl = new URL(`/api/identities/${identityId}`, API_URL);

  return await apiRequest(requestUrl, cookie ? { cookie } : undefined);
}

export async function postIdentity(identity: Identity): Promise<void> {
  const requestUrl = new URL(`/api/identities`, API_URL);

  return await apiRequest(
    requestUrl,
    { "Content-Type": "application/json" },
    "POST",
    JSON.stringify(identity)
  );
}

export async function deleteIdentity(identityId?: string) {
  if (!identityId) {
    throw new Error(undefined, { cause: 400 });
  }

  const requestUrl = new URL(`/api/identities/${identityId}`, API_URL);

  return await apiRequest(requestUrl, undefined, "DELETE");
}

export async function updateIdentity(
  identityId?: string,
  identity?: Identity
): Promise<void> {
  if (!identityId || !identity) {
    throw new Error(undefined, { cause: 402 });
  }

  const requestUrl = new URL(`/api/identities/${identityId}`, API_URL);

  return await apiRequest(
    requestUrl,
    { "Content-Type": "application/json" },
    "PUT",
    JSON.stringify(identity)
  );
}
