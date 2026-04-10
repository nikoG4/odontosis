import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
export function Card({ className, children }) {
    return _jsx("div", { className: cn("rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur", className), children: children });
}
