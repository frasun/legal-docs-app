export async function apiRequest(
  url: URL,
  headers: HeadersInit,
  method = "GET",
  body?: string
) {
  const response = await fetch(url, { headers, method, body });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}

export const headers = {
  "x-api-key": import.meta.env.API_KEY,
};
