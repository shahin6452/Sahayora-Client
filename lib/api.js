
import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(endpoint, options = {}) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token unavailable. Please login again.");
  }

  const headers = new Headers(options.headers || {});

  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
}
