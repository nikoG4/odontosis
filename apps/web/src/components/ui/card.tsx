import { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur", className)}>{children}</div>;
}
