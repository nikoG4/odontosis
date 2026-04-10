import type { AuthUser } from "@odontosis/types";

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: {
    sub: string;
    tenantId: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  onboarding?: {
    clinicId: string;
    planId: string;
    billingCycle: string;
    checkout: {
      provider: string;
      status: string;
      amount: number;
      currency: string;
      transactionId: string;
    };
  };
};

export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  apiUrl?: string;
};

export function resolveApiUrl(explicitApiUrl?: string) {
  if (explicitApiUrl) return explicitApiUrl;
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
    return isLocal ? "http://localhost:3001" : origin;
  }
  return "http://localhost:3001";
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const response = await fetch(`${resolveApiUrl(options.apiUrl)}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error de API");
  }

  return response.json() as Promise<T>;
}

export function getUserDisplayName(user?: Pick<AuthUser, "firstName" | "lastName"> | Session["user"] | null) {
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`.trim();
}
