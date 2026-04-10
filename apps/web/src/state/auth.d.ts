import { PropsWithChildren } from "react";
import type { Session } from "@odontosis/sdk";
type AuthContextValue = {
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    registerClinic: (payload: Record<string, unknown>) => Promise<Session>;
    logout: () => Promise<void>;
};
export declare function AuthProvider({ children }: PropsWithChildren): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextValue;
export {};
