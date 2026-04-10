import { apiRequest } from "@odontosis/sdk";
import { API_URL } from "./utils";
export async function api(path, options = {}) {
    return apiRequest(path, { ...options, apiUrl: API_URL });
}
