import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import type { Session } from "@odontosis/sdk";
import { api } from "../lib/api";

type AuthContextValue = {
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  registerClinic: (payload: Record<string, unknown>) => Promise<Session>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "odontosis-session";

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSession(JSON.parse(stored));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const nextSession = await api<Session>("/auth/login", { method: "POST", body: { email, password } });
    setSession(nextSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  };

  const loginWithGoogle = async (idToken: string) => {
    const nextSession = await api<Session>("/auth/google", { method: "POST", body: { idToken } });
    setSession(nextSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  };

  const registerClinic = async (payload: Record<string, unknown>) => {
    const nextSession = await api<Session>("/auth/register-clinic", { method: "POST", body: payload });
    setSession(nextSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    return nextSession;
  };

  const logout = async () => {
    if (session?.accessToken) {
      await api("/auth/logout", { method: "POST", token: session.accessToken }).catch(() => undefined);
    }
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ session, login, loginWithGoogle, registerClinic, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
