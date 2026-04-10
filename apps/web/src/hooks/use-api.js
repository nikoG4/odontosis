import { useAuth } from "../state/auth";
import { api } from "../lib/api";
export function useApi() {
    const { session } = useAuth();
    return {
        get: (path) => api(path, { token: session?.accessToken }),
        post: (path, body) => api(path, { method: "POST", body, token: session?.accessToken }),
        patch: (path, body) => api(path, { method: "PATCH", body, token: session?.accessToken }),
        put: (path, body) => api(path, { method: "PUT", body, token: session?.accessToken }),
    };
}
