import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, type Session } from "@odontosis/sdk";
import { getStoredItem, removeStoredItem, setStoredItem } from "../lib/storage";

const STORAGE_KEY = "odontosis-session";

type AuthContextValue = {
  session: Session | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  apiUrl: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    getStoredItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setSession(JSON.parse(stored));
      })
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isReady,
      apiUrl,
      login: async (email: string, password: string) => {
        const nextSession = await apiRequest<Session>("/auth/login", {
          method: "POST",
          body: { email, password },
          apiUrl,
        });
        setSession(nextSession);
        await setStoredItem(STORAGE_KEY, JSON.stringify(nextSession));
      },
      loginWithGoogle: async (idToken: string) => {
        const nextSession = await apiRequest<Session>("/auth/google", {
          method: "POST",
          body: { idToken },
          apiUrl,
        });
        setSession(nextSession);
        await setStoredItem(STORAGE_KEY, JSON.stringify(nextSession));
      },
      logout: async () => {
        if (session?.accessToken) {
          await apiRequest("/auth/logout", { method: "POST", token: session.accessToken, apiUrl }).catch(() => undefined);
        }
        setSession(null);
        await removeStoredItem(STORAGE_KEY);
      },
    }),
    [apiUrl, isReady, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
