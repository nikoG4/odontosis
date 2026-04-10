import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../../lib/utils";
export const Input = React.forwardRef(({ className, ...props }, ref) => (_jsx("input", { ref: ref, className: cn("flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20", className), ...props })));
Input.displayName = "Input";
