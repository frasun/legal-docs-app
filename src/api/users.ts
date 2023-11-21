import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";

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
  postedCode: string,
  userEmail: string
): Promise<string> {
  const requestUrl = new URL(`/api/users/verify`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, "Content-Type": "application/json" },
    "POST",
    JSON.stringify({
      postedCode,
      userEmail,
    })
  );
}

export async function getVerificationInProgress(
  userEmail: string | null
): Promise<boolean> {
  const requestUrl = new URL(`/api/users/verify/${userEmail}`, API_URL);

  return apiRequest(requestUrl, { ...headers });
}
