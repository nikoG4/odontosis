import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BadgeCheck, Bot, CreditCard, MessageSquareMore } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";
const schema = z.object({
    name: z.string().min(2),
    phone: z.string().optional(),
    email: z.string().email(),
    address: z.string().optional(),
    appointmentDuration: z.coerce.number().min(15),
});
const prices = {
    START: { monthly: 199000, yearly: 1980000 },
    GROWTH: { monthly: 349000, yearly: 3490000 },
    SCALE: { monthly: 599000, yearly: 5990000 },
};
export function SettingsPage() {
    const api = useApi();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["clinic"],
        queryFn: () => api.get("/clinic/me"),
    });
    const form = useForm({
        resolver: zodResolver(schema),
        values: {
            name: data?.name || "",
            phone: data?.phone || "",
            email: data?.email || "",
            address: data?.address || "",
            appointmentDuration: data?.appointmentDuration || 30,
        },
    });
    const mutation = useMutation({
        mutationFn: (values) => api.put("/clinic/me", values),
        onSuccess: () => {
            toast.success("Clinica actualizada");
            queryClient.invalidateQueries({ queryKey: ["clinic"] });
        },
    });
    const planPrice = data?.subscriptionPlan && prices[data.subscriptionPlan]
        ? data.billingCycle === "YEARLY"
            ? prices[data.subscriptionPlan].yearly
            : prices[data.subscriptionPlan].monthly
        : null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-4 xl:grid-cols-3", children: [_jsxs(Card, { children: [_jsx(CreditCard, { className: "h-7 w-7 text-teal-700" }), _jsx("p", { className: "mt-4 text-sm text-slate-500", children: "Plan actual" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold", children: data?.subscriptionPlan || "GROWTH" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: planPrice ? currency(planPrice) : "Precio disponible en pricing" })] }), _jsxs(Card, { children: [_jsx(BadgeCheck, { className: "h-7 w-7 text-teal-700" }), _jsx("p", { className: "mt-4 text-sm text-slate-500", children: "Estado" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold", children: data?.subscriptionStatus || "ACTIVE" }), _jsxs("p", { className: "mt-2 text-sm text-slate-500", children: ["Ciclo ", data?.billingCycle === "YEARLY" ? "anual" : "mensual"] })] }), _jsxs(Card, { children: [_jsx(MessageSquareMore, { className: "h-7 w-7 text-teal-700" }), _jsx("p", { className: "mt-4 text-sm text-slate-500", children: "Integraciones" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold", children: "Ready" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Bancard, WhatsApp e IA listos para conectar." })] })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-2", children: [_jsxs(Card, { children: [_jsx("h1", { className: "text-2xl font-extrabold sm:text-3xl", children: "Configuracion" }), _jsxs("form", { className: "mt-6 space-y-4", onSubmit: form.handleSubmit((values) => mutation.mutate(values)), children: [_jsx(Input, { placeholder: "Nombre de clinica", ...form.register("name") }), _jsx(Input, { placeholder: "Telefono", ...form.register("phone") }), _jsx(Input, { placeholder: "Email", ...form.register("email") }), _jsx(Input, { placeholder: "Direccion", ...form.register("address") }), _jsx(Input, { type: "number", placeholder: "Duracion de turnos", ...form.register("appointmentDuration") }), _jsx(Button, { type: "submit", className: "w-full sm:w-auto", children: "Guardar configuracion" })] })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold sm:text-2xl", children: "Arquitectura preparada" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Base comercial y tecnica para seguir escalando producto." })] }), _jsx(Badge, { className: "bg-teal-100 text-teal-900", children: "SaaS Ready" })] }), _jsxs("div", { className: "mt-4 space-y-4 text-sm text-slate-600", children: [_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx(Bot, { className: "h-5 w-5 text-teal-700" }), _jsx("p", { className: "mt-3 font-semibold text-slate-900", children: "IA Stub" }), _jsx("p", { className: "mt-2", children: "Preparada para interpretar intencion, sugerir horarios, generar mensajes y resumir consultas." })] }), _jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx(MessageSquareMore, { className: "h-5 w-5 text-teal-700" }), _jsx("p", { className: "mt-3 font-semibold text-slate-900", children: "WhatsApp Stub" }), _jsx("p", { className: "mt-2", children: "Recordatorios desacoplados para futuro proveedor de WhatsApp Business API." })] }), _jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx(CreditCard, { className: "h-5 w-5 text-teal-700" }), _jsx("p", { className: "mt-3 font-semibold text-slate-900", children: "Bancard Ready" }), _jsx("p", { className: "mt-2", children: "Checkout simulado activo hoy y estructura lista para credenciales reales despues." })] })] })] })] })] }));
}
