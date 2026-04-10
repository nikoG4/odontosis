import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
const AuthContext = createContext(null);
const STORAGE_KEY = "odontosis-session";
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setSession(JSON.parse(stored));
        }
    }, []);
    const login = async (email, password) => {
        const nextSession = await api("/auth/login", { method: "POST", body: { email, password } });
        setSession(nextSession);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    };
    const loginWithGoogle = async (idToken) => {
        const nextSession = await api("/auth/google", { method: "POST", body: { idToken } });
        setSession(nextSession);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    };
    const registerClinic = async (payload) => {
        const nextSession = await api("/auth/register-clinic", { method: "POST", body: payload });
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
    return _jsx(AuthContext.Provider, { value: { session, login, loginWithGoogle, registerClinic, logout }, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return ctx;
}
