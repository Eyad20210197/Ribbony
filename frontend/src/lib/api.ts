import { useCallback } from "react";
import { apiBase } from "@/lib/config";
import { useAppStore } from "@/store/useAppStore";

export async function parseServerErrorBody(res: Response) {
  const text = await res.text().catch(() => "");
  if (!text) return res.statusText ?? "Error";
  try {
    const json = JSON.parse(text);
    if (Array.isArray(json)) return json.join(", ");
    if (json?.message)
      return typeof json.message === "string"
        ? json.message
        : JSON.stringify(json.message);
    if (json?.errors && Array.isArray(json.errors))
      return json.errors.join(", ");
    return JSON.stringify(json);
  } catch {
    return text;
  }
}

export async function apiFetchRaw(path: string, opts: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("ribbony_token")
      : null;

  const headers = new Headers(opts.headers ?? {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${apiBase}${path}`, {
    credentials: "include",
    ...opts,
    headers,
  });

  if (!res.ok) {
    const body = await parseServerErrorBody(res);
    throw new Error(`${res.status} ${res.statusText} — ${body}`);
  }
  return res;
}

// hook for components that need to fetch and show loader automatically
export function useApi() {
  const setLoading = useAppStore((s) => s.setLoading);
  return useCallback(
    async (path: string, opts: RequestInit = {}) => {
      setLoading(true);
      try {
        const res = await apiFetchRaw(path, opts);
        const json = await res.json();
        return json;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );
}
