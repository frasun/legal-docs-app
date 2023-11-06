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
  cookie: string,
  identityId: string
): Promise<Identity> {
  const requestUrl = new URL(`/api/identities/${identityId}`, API_URL);

  return await apiRequest(requestUrl, { cookie });
}

export async function postIdentity(cookie: string, identity: Identity) {
  const requestUrl = new URL(`/api/identities`, API_URL);

  return await apiRequest(
    requestUrl,
    { cookie, "Content-Type": "application/json" },
    "POST",
    JSON.stringify(identity)
  );
}

export async function deleteIdentity(cookie: string, identityId: string) {
  const requestUrl = new URL(`/api/identities/${identityId}`, API_URL);

  return await apiRequest(requestUrl, { cookie }, "DELETE");
}

export async function updateIdentity(
  cookie: string,
  identityId: string,
  identity: Identity
) {
  const requestUrl = new URL(`/api/identities/${identityId}`, API_URL);

  return await apiRequest(
    requestUrl,
    { cookie },
    "PUT",
    JSON.stringify(identity)
  );
}
