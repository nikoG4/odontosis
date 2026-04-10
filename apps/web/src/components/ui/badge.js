import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
export function Badge({ children, className }) {
    return _jsx("span", { className: cn("inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground", className), children: children });
}
