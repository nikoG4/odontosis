import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";
export function TreatmentsPage() {
    const api = useApi();
    const { data: treatments } = useQuery({
        queryKey: ["treatments"],
        queryFn: () => api.get("/treatments"),
    });
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("h1", { className: "text-2xl font-extrabold sm:text-3xl", children: "Tratamientos" }), _jsx(Link, { to: "/treatments/new", children: _jsx(Button, { children: "Nuevo tratamiento" }) })] }), _jsx("div", { className: "mt-6 space-y-3", children: treatments?.map((treatment) => (_jsx("div", { className: "rounded-2xl border border-border bg-slate-50 p-4", children: _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "break-words font-semibold", children: [treatment.type, " \u00B7 ", treatment.patient.firstName, " ", treatment.patient.lastName] }), _jsx("p", { className: "break-words text-sm text-slate-500", children: treatment.description })] }), _jsxs("div", { className: "text-left sm:text-right", children: [_jsx(Badge, { children: treatment.status }), _jsx("p", { className: "mt-2 text-sm font-semibold", children: currency(Number(treatment.finalCost ?? treatment.estimatedCost)) })] })] }) }, treatment.id))) })] }) }));
}
