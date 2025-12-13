// src/lib/api.ts
import { apiBase } from "@/lib/config";
import { useAppStore } from "@/store/useAppStore";
import { useMemo } from "react";

/* ---------------------------------------------
   Parse backend error bodies nicely
--------------------------------------------- */
export async function parseServerErrorBody(res: Response) {
  const text = await res.text().catch(() => "");
  if (!text) return res.statusText ?? "Error";

  try {
    const json = JSON.parse(text);
    if (Array.isArray(json)) return json.join(", ");
    if (json?.message) return typeof json.message === "string" ? json.message : JSON.stringify(json.message);
    if (json?.errors && Array.isArray(json.errors)) return json.errors.join(", ");
    return JSON.stringify(json);
  } catch {
    return text;
  }
}

/* ---------------------------------------------
   Core API fetch (attaches JWT automatically)
--------------------------------------------- */
export async function apiFetchRaw(path: string, opts: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("ribbony_token") : null;

  const headers = new Headers(opts.headers ?? {});
  headers.set("Accept", "application/json");
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  // Attach token automatically
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${apiBase}${path}`, {
    credentials: "include", // Needed for Spring boot + CORS
    ...opts,
    headers,
  });

  if (!res.ok) {
    const body = await parseServerErrorBody(res);
    throw new Error(`${res.status} ${res.statusText} — ${body}`);
  }

  return res;
}

/* ---------------------------------------------
   Helper: Safe JSON Parsing
--------------------------------------------- */
async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {}; 
  } catch {
    return { message: text }; 
  }
}

/* ---------------------------------------------
   Shortcut for JSON GET/POST/PUT/DELETE calls
--------------------------------------------- */
export async function apiGet(path: string) {
  const res = await apiFetchRaw(path, { method: "GET" });
  return safeJson(res);
}

export async function apiPost(path: string, body: any) {
  const res = await apiFetchRaw(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return safeJson(res);
}

export async function apiPut(path: string, body: any) {
  const res = await apiFetchRaw(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return safeJson(res);
}

export async function apiDelete(path: string) {
  const res = await apiFetchRaw(path, { method: "DELETE" });
  return safeJson(res);
}

/* ---------------------------------------------
   React hook for components that need loading UI
--------------------------------------------- */
export function useApi() {
  const setLoading = useAppStore((s) => s.setLoading);

  return useMemo(() => ({
    get: async (path: string) => {
      setLoading(true);
      try {
        return await apiGet(path);
      } finally {
        setLoading(false);
      }
    },

    post: async (path: string, body: any) => {
      setLoading(true);
      try {
        return await apiPost(path, body);
      } finally {
        setLoading(false);
      }
    },

    put: async (path: string, body: any) => {
      setLoading(true);
      try {
        return await apiPut(path, body);
      } finally {
        setLoading(false);
      }
    },

    delete: async (path: string) => {
      setLoading(true);
      try {
        return await apiDelete(path);
      } finally {
        setLoading(false);
      }
    },
  }), [setLoading]);
}