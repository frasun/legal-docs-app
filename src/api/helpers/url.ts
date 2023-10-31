const VERCEL_URL = import.meta.env.VERCEL_URL;

export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : VERCEL_URL
    ? `https://${VERCEL_URL}`
    : document.location.origin;
