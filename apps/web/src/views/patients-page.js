import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useApi } from "../hooks/use-api";
export function PatientsPage() {
    const api = useApi();
    const { data } = useQuery({
        queryKey: ["patients"],
        queryFn: () => api.get("/patients"),
    });
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Base clinica" }), _jsx("h1", { className: "mt-2 text-2xl font-extrabold sm:text-3xl", children: "Pacientes" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Acceso rapido a ficha, antecedentes, tratamientos, turnos y pagos." })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold", children: [data?.length ?? 0, " registrados"] }), _jsx(Link, { to: "/patients/new", children: _jsx(Button, { children: "Nuevo paciente" }) })] })] }), _jsxs("div", { className: "mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-slate-700", children: [_jsx(Search, { className: "h-4 w-4" }), "Busqueda y detalle rapido"] }), _jsx("p", { className: "mt-2", children: "Cada tarjeta te lleva a la ficha completa del paciente para registrar atencion, revisar tratamientos y cargar pagos." })] }), _jsx("div", { className: "mt-6 space-y-3", children: data?.map((patient) => (_jsx(Link, { to: `/patients/${patient.id}`, className: "block rounded-2xl border border-border bg-slate-50 p-4 transition hover:border-primary hover:bg-white", children: _jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold", children: [patient.firstName, " ", patient.lastName] }), _jsxs("p", { className: "break-words text-sm text-slate-500", children: [patient.document || "Sin documento", " \u00B7 ", patient.phone || "Sin telefono"] })] }), _jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-teal-700", children: "Ver ficha" })] }) }, patient.id))) })] }) }));
}
