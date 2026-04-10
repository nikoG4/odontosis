import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeDollarSign, CircleDollarSign } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";
export function PaymentsPage() {
    const api = useApi();
    const { data } = useQuery({
        queryKey: ["payments"],
        queryFn: () => api.get("/payments"),
    });
    const totals = useMemo(() => {
        const payments = data ?? [];
        const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const cash = payments
            .filter((payment) => payment.method === "CASH")
            .reduce((sum, payment) => sum + Number(payment.amount), 0);
        return { total, cash };
    }, [data]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs(Card, { children: [_jsx(BadgeDollarSign, { className: "h-7 w-7 text-teal-700" }), _jsx("p", { className: "mt-4 text-sm text-slate-500", children: "Cobrado total" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold", children: currency(totals.total) })] }), _jsxs(Card, { children: [_jsx(CircleDollarSign, { className: "h-7 w-7 text-teal-700" }), _jsx("p", { className: "mt-4 text-sm text-slate-500", children: "Cobrado en efectivo" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold", children: currency(totals.cash) })] }), _jsxs(Card, { children: [_jsx("p", { className: "text-sm text-slate-500", children: "Movimientos" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold", children: data?.length ?? 0 }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Historial de ingresos registrados en la plataforma." })] })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Tesoreria" }), _jsx("h1", { className: "mt-2 text-2xl font-extrabold sm:text-3xl", children: "Pagos" })] }), _jsxs(Badge, { children: [data?.length ?? 0, " movimientos"] })] }), _jsx("div", { className: "mt-6 space-y-3", children: data?.map((payment) => (_jsx("div", { className: "rounded-2xl border border-border bg-slate-50 p-4", children: _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold", children: [payment.patient.firstName, " ", payment.patient.lastName] }), _jsx("p", { className: "break-words text-sm text-slate-500", children: new Date(payment.paidAt).toLocaleString() })] }), _jsxs("div", { className: "text-left sm:text-right", children: [_jsx("p", { className: "font-bold", children: currency(Number(payment.amount)) }), _jsx("p", { className: "text-sm text-slate-500", children: payment.method })] })] }) }, payment.id))) })] })] }));
}
