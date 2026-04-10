import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const currency = (value) => new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(value);
const configuredApiUrl = import.meta.env.VITE_API_URL;
const browserOrigin = typeof window !== "undefined" ? window.location.origin : "";
const isLocalBrowser = browserOrigin.includes("localhost") || browserOrigin.includes("127.0.0.1");
const shouldUseBrowserOrigin = !!browserOrigin && (!configuredApiUrl || (!isLocalBrowser && configuredApiUrl.includes("localhost")));
export const API_URL = shouldUseBrowserOrigin ? browserOrigin : configuredApiUrl || "http://localhost:3001";
