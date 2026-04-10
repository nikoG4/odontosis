import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center rounded-xl text-center text-sm font-semibold leading-none transition disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "border border-border bg-white hover:bg-slate-50",
            ghost: "hover:bg-slate-100",
        },
        size: {
            default: "h-11 px-5",
            sm: "h-9 px-3",
            lg: "h-12 px-6",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
export function Button({ className, variant, size, ...props }) {
    return _jsx("button", { className: cn(buttonVariants({ variant, size }), className), ...props });
}
