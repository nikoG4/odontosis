import { apiRequest } from "@odontosis/sdk";
import { API_URL } from "./utils";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, apiUrl: API_URL });
}
