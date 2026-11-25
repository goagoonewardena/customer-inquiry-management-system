const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"
).replace(/\/+$/, "");

export function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}

export async function apiErrorMessage(response: Response, fallback: string) {
  const body: unknown = await response.json();
  if (typeof body === "object" && body !== null) {
    const details = body as Record<string, unknown>;
    if (typeof details.detail === "string") {
      return details.detail;
    }
    if (typeof details.message === "string") {
      return details.message;
    }
  }
  return fallback;
}
