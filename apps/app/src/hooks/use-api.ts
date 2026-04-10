import { apiRequest } from "@odontosis/sdk";
import { useAuth } from "../state/auth";

export function useApi() {
  const { session, apiUrl } = useAuth();

  return {
    get: <T,>(path: string) => apiRequest<T>(path, { token: session?.accessToken, apiUrl }),
    post: <T,>(path: string, body: unknown) =>
      apiRequest<T>(path, { method: "POST", body, token: session?.accessToken, apiUrl }),
    patch: <T,>(path: string, body: unknown) =>
      apiRequest<T>(path, { method: "PATCH", body, token: session?.accessToken, apiUrl }),
    put: <T,>(path: string, body: unknown) =>
      apiRequest<T>(path, { method: "PUT", body, token: session?.accessToken, apiUrl }),
  };
}
