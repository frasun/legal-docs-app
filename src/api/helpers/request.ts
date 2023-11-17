export async function apiRequest(
  url: URL,
  headers: HeadersInit,
  method = "GET",
  body?: string
) {
  const response = await fetch(url, { headers, method, body });
  const message = await response.json();

  if (!response.ok) {
    throw new Error(message, { cause: response.status });
  }

  return message;
}

export const headers = {
  "x-api-key": import.meta.env.API_KEY,
};
