export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; issues?: string[] };

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      credentials: "same-origin",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      ...init,
    });

    if (res.status === 204) return { ok: true, data: null as T };

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: String(body.error ?? `request_failed_${res.status}`),
        issues: Array.isArray(body.issues) ? body.issues : undefined,
      };
    }
    return { ok: true, data: body as T };
  } catch {
    return { ok: false, error: "network_unreachable" };
  }
}

export type AdminProject = {
  id: string;
  slug: string;
  index: string;
  kind: string;
  name: string;
  headline: string;
  summary: string;
  status: string;
  url: string | null;
  stack: string[];
  position: number;
  published: boolean;
  sample: { caption: string; meta: string; lang: string; code: string };
};

export type AdminPost = {
  id: string;
  slug: string;
  index: string;
  title: string;
  standfirst: string;
  date: string;
  reading: string;
  tags: string[];
  position: number;
  published: boolean;
  blocks: unknown[];
};

export const api = {
  me: () => request<{ authenticated: boolean }>("/api/auth/me"),
  login: (email: string, password: string) =>
    request<{ ok: true }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),

  listProjects: () => request<{ projects: AdminProject[] }>("/api/projects"),
  createProject: (p: Partial<AdminProject>) =>
    request<{ project: AdminProject }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(p),
    }),
  updateProject: (id: string, p: Partial<AdminProject>) =>
    request<{ project: AdminProject }>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(p),
    }),
  deleteProject: (id: string) =>
    request<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" }),

  listPosts: () => request<{ posts: AdminPost[] }>("/api/posts"),
  createPost: (p: Partial<AdminPost>) =>
    request<{ post: AdminPost }>("/api/posts", {
      method: "POST",
      body: JSON.stringify(p),
    }),
  updatePost: (id: string, p: Partial<AdminPost>) =>
    request<{ post: AdminPost }>(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(p),
    }),
  deletePost: (id: string) =>
    request<{ ok: true }>(`/api/posts/${id}`, { method: "DELETE" }),
};

export const ERROR_TEXT: Record<string, string> = {
  invalid_credentials: "That email and password don't match.",
  too_many_attempts: "Too many attempts. Wait 15 minutes and try again.",
  database_not_configured: "DATABASE_URL isn't set — the admin can't run yet.",
  network_unreachable: "Couldn't reach the server. Check your connection.",
  unauthorized: "Your session expired. Sign in again.",
  not_found: "That record no longer exists.",
};

export const readError = (code: string) =>
  ERROR_TEXT[code] ?? "Something went wrong. Try again.";
