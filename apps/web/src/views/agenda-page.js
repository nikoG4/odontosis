import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
export function AgendaPage() {
    const api = useApi();
    const queryClient = useQueryClient();
    const { data: appointments } = useQuery({
        queryKey: ["appointments"],
        queryFn: () => api.get("/appointments"),
    });
    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => api.patch(`/appointments/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("h1", { className: "text-2xl font-extrabold sm:text-3xl", children: "Agenda" }), _jsx(Link, { to: "/agenda/new", children: _jsx(Button, { children: "Nuevo turno" }) })] }), _jsx("div", { className: "mt-6 space-y-3", children: appointments?.map((appointment) => (_jsx("div", { className: "rounded-2xl border border-border bg-slate-50 p-4", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold", children: [appointment.patient.firstName, " ", appointment.patient.lastName] }), _jsxs("p", { className: "break-words text-sm text-slate-500", children: [new Date(appointment.startAt).toLocaleString(), " \u00B7 ", appointment.reason] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx(Badge, { children: appointment.status }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => statusMutation.mutate({ id: appointment.id, status: "CONFIRMED" }), children: "Confirmar" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => statusMutation.mutate({ id: appointment.id, status: "ATTENDED" }), children: "Asistio" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => statusMutation.mutate({ id: appointment.id, status: "NO_SHOW" }), children: "No asistio" })] })] }) }, appointment.id))) })] }) }));
}
