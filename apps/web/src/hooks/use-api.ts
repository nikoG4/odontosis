import { useAuth } from "../state/auth";
import { api } from "../lib/api";

export function useApi() {
  const { session } = useAuth();
  return {
    get: <T,>(path: string) => api<T>(path, { token: session?.accessToken }),
    post: <T,>(path: string, body: unknown) => api<T>(path, { method: "POST", body, token: session?.accessToken }),
    patch: <T,>(path: string, body: unknown) => api<T>(path, { method: "PATCH", body, token: session?.accessToken }),
    put: <T,>(path: string, body: unknown) => api<T>(path, { method: "PUT", body, token: session?.accessToken }),
  };
}
