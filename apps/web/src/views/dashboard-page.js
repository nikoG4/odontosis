import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";
export function DashboardPage() {
    const api = useApi();
    const { data } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => api.get("/dashboard"),
    });
    const metrics = [
        { label: "Turnos de hoy", value: data?.todayAppointments ?? 0 },
        { label: "Tratamientos activos", value: data?.activeTreatments ?? 0 },
        { label: "Pendientes de confirmacion", value: data?.pendingPatients?.length ?? 0 },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-teal-700 sm:text-sm sm:tracking-[0.35em]", children: "Resumen operativo" }), _jsx("h1", { className: "mt-2 text-3xl font-extrabold sm:text-4xl", children: "Dashboard" })] }), _jsx("div", { className: "grid gap-3 sm:gap-4 md:grid-cols-3", children: metrics.map((metric) => (_jsxs(Card, { children: [_jsx("p", { className: "text-sm text-slate-500", children: metric.label }), _jsx("p", { className: "mt-3 text-3xl font-bold sm:text-4xl", children: metric.value })] }, metric.label))) }), _jsxs("div", { className: "grid gap-4 xl:grid-cols-2", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Proximos turnos" }), _jsx(Badge, { children: data?.upcomingAppointments?.length ?? 0 })] }), _jsx("div", { className: "mt-4 space-y-3", children: data?.upcomingAppointments?.map((appointment) => (_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsxs("p", { className: "font-semibold", children: [appointment.patient.firstName, " ", appointment.patient.lastName] }), _jsx("p", { className: "text-sm text-slate-500", children: new Date(appointment.startAt).toLocaleString() })] }, appointment.id))) })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Pagos pendientes" }), _jsx(Badge, { children: data?.pendingPayments?.length ?? 0 })] }), _jsx("div", { className: "mt-4 space-y-3", children: data?.pendingPayments?.map((item) => (_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx("p", { className: "font-semibold", children: item.patientName }), _jsxs("p", { className: "text-sm text-slate-500", children: ["Pendiente: ", currency(item.pending)] })] }, item.treatmentId))) })] })] })] }));
}
