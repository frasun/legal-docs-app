import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";
import { UserProfile } from "@type";

export async function signUp(
  tos: string,
  email: string,
  password: string
): Promise<void> {
  const requestUrl = new URL(`/api/users/signup`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, "Content-Type": "application/json" },
    "POST",
    JSON.stringify({
      tos,
      email,
      password,
    })
  );
}

export async function verifyCode(
  code: string,
  userEmail: string
): Promise<string> {
  const requestUrl = new URL(`/api/users/verify/${userEmail}`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, "Content-Type": "application/json" },
    "POST",
    JSON.stringify({
      code,
    })
  );
}

export async function getVerificationInProgress(
  userEmail: string | null
): Promise<boolean> {
  const requestUrl = new URL(`/api/users/verify/${userEmail}`, API_URL);

  return apiRequest(requestUrl, { ...headers });
}

export async function sendResetCode(userEmail: string): Promise<void> {
  const requestUrl = new URL(`/api/users/reset-password/${userEmail}`, API_URL);

  return apiRequest(requestUrl, {
    ...headers,
  });
}

export async function setNewPassword(
  code: string,
  email: string,
  password: string
): Promise<void> {
  const requestUrl = new URL(`/api/users/reset-password/${email}`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, "Content-Type": "application/json" },
    "POST",
    JSON.stringify({
      code,
      password,
    })
  );
}

export async function getUserProfile(
  cookie: string | null
): Promise<UserProfile> {
  if (!cookie || !cookie.length) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/users`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

export async function deleteUserAccount(): Promise<UserProfile> {
  const requestUrl = new URL(`/api/users`, API_URL);

  return apiRequest(requestUrl, undefined, "DELETE");
}
