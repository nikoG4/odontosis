import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BadgeCheck, CreditCard, LockKeyhole, WalletCards } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import { currency } from "../lib/utils";
const schema = z.object({
    clinicName: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email(),
    address: z.string().min(4),
    appointmentDuration: z.coerce.number().min(15).max(120),
    adminFirstName: z.string().min(2),
    adminLastName: z.string().min(2),
    adminEmail: z.string().email(),
    adminPassword: z.string().min(8),
    planId: z.enum(["START", "GROWTH", "SCALE"]),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]),
    paymentMethod: z.enum(["SIMULATED", "BANCARD"]),
    cardholderName: z.string().min(2),
    cardNumber: z.string().min(12),
});
export function SignupPage() {
    const navigate = useNavigate();
    const { registerClinic } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState("GROWTH");
    const { data } = useQuery({
        queryKey: ["plans"],
        queryFn: () => api("/auth/plans"),
    });
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            clinicName: "",
            phone: "",
            email: "",
            address: "",
            appointmentDuration: 30,
            adminFirstName: "",
            adminLastName: "",
            adminEmail: "",
            adminPassword: "",
            planId: "GROWTH",
            billingCycle: "MONTHLY",
            paymentMethod: "SIMULATED",
            cardholderName: "",
            cardNumber: "4111111111111111",
        },
    });
    const billingCycle = form.watch("billingCycle");
    const currentPlan = useMemo(() => data?.plans?.find((plan) => plan.id === selectedPlan) ?? data?.plans?.[1], [data?.plans, selectedPlan]);
    return (_jsx("div", { className: "min-h-screen bg-[linear-gradient(180deg,#f6fbfb_0%,#edf5f5_38%,#fff7ed_100%)] px-3 py-6 sm:px-4 sm:py-8", children: _jsxs("div", { className: "mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_0.95fr]", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Alta comercial" }), _jsx("h1", { className: "mt-3 text-3xl font-extrabold sm:text-5xl", children: "Crea la clinica, activa el plan y entra a la plataforma." }), _jsx("p", { className: "mt-4 max-w-2xl text-base text-slate-600 sm:text-lg", children: "Checkout simulado para acelerar validacion. La integracion real con Bancard ya queda preparada en backend." })] }), _jsx("div", { className: "grid gap-4", children: data?.plans?.map((plan) => {
                                const selected = selectedPlan === plan.id;
                                const price = billingCycle === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice;
                                return (_jsxs("button", { type: "button", onClick: () => {
                                        setSelectedPlan(plan.id);
                                        form.setValue("planId", plan.id);
                                    }, className: `rounded-[2rem] border p-4 text-left transition sm:p-5 ${selected ? "border-teal-600 bg-teal-50 shadow-lg shadow-teal-100" : "border-slate-200 bg-white/80 hover:border-slate-300"}`, children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("h2", { className: "text-xl font-bold sm:text-2xl", children: plan.name }), plan.recommended ? _jsx(Badge, { className: "bg-amber-100 text-amber-900", children: "Recomendado" }) : null] }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: plan.setupLabel })] }), _jsxs("div", { className: "text-left sm:text-right", children: [_jsx("p", { className: "text-2xl font-extrabold sm:text-3xl", children: currency(price) }), _jsxs("p", { className: "text-sm text-slate-500", children: ["por ", billingCycle === "YEARLY" ? "ano" : "mes"] })] })] }), _jsx("p", { className: "mt-4 text-sm text-slate-700", children: plan.description }), _jsx("div", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: plan.features.map((feature) => (_jsxs("div", { className: "flex items-start gap-2 text-sm text-slate-600", children: [_jsx(BadgeCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-teal-700" }), _jsx("span", { children: feature })] }, feature))) })] }, plan.id));
                            }) })] }), _jsxs(Card, { className: "rounded-[2rem] p-4 sm:p-7 xl:sticky xl:top-6 xl:self-start", children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Checkout" }), _jsx("h2", { className: "mt-2 text-xl font-bold sm:text-2xl", children: "Activa tu cuenta" })] }), _jsx("div", { className: "grid w-full grid-cols-2 rounded-full bg-slate-100 p-1 sm:w-auto", children: ["MONTHLY", "YEARLY"].map((cycle) => (_jsx("button", { type: "button", className: `rounded-full px-4 py-2 text-sm font-semibold ${billingCycle === cycle ? "bg-white text-slate-900 shadow" : "text-slate-500"}`, onClick: () => form.setValue("billingCycle", cycle), children: cycle === "MONTHLY" ? "Mensual" : "Anual" }, cycle))) })] }), _jsxs("form", { className: "mt-6 space-y-5", onSubmit: form.handleSubmit(async (values) => {
                                try {
                                    const session = await registerClinic({ ...values, planId: selectedPlan });
                                    toast.success(`Pago ${session.onboarding?.checkout.status?.toLowerCase() || "aprobado"} y acceso habilitado`);
                                    navigate("/dashboard");
                                }
                                catch (error) {
                                    toast.error(error instanceof Error ? error.message : "No se pudo activar la cuenta");
                                }
                            }), children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: "Datos de la clinica" }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Informacion comercial y operativa basica para crear el tenant." })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(Input, { placeholder: "Nombre de la clinica", ...form.register("clinicName") }), _jsx(Input, { placeholder: "Telefono de la clinica", inputMode: "tel", ...form.register("phone") })] }), _jsx(Input, { placeholder: "Email comercial", inputMode: "email", ...form.register("email") }), _jsx(Input, { placeholder: "Direccion", ...form.register("address") }), _jsx(Input, { type: "number", placeholder: "Duracion de turnos", ...form.register("appointmentDuration") }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: "Administrador principal" }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Este usuario entra primero a la plataforma y gestiona la cuenta." })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsx(Input, { placeholder: "Nombre del admin", ...form.register("adminFirstName") }), _jsx(Input, { placeholder: "Apellido del admin", ...form.register("adminLastName") })] }), _jsx(Input, { placeholder: "Email del admin", inputMode: "email", ...form.register("adminEmail") }), _jsx(Input, { type: "password", placeholder: "Password", ...form.register("adminPassword") }), _jsxs("div", { className: "rounded-3xl border border-slate-200 bg-slate-50 p-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-5 w-5 text-teal-700" }), _jsx("p", { className: "font-semibold", children: "Pago del plan" })] }), _jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-3", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [_jsx("input", { type: "radio", value: "SIMULATED", ...form.register("paymentMethod") }), "Simulado"] }), _jsx("p", { className: "mt-2 text-xs text-slate-500", children: "Acepta cualquier tarjeta y habilita acceso inmediato." })] }), _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-3", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [_jsx("input", { type: "radio", value: "BANCARD", ...form.register("paymentMethod") }), "Bancard Ready"] }), _jsx("p", { className: "mt-2 text-xs text-slate-500", children: "El flujo queda preparado para conectar credenciales reales mas adelante." })] })] }), _jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [_jsx(Input, { placeholder: "Titular de la tarjeta", ...form.register("cardholderName") }), _jsx(Input, { placeholder: "Numero de tarjeta", inputMode: "numeric", ...form.register("cardNumber") })] })] }), _jsxs("div", { className: "rounded-3xl bg-slate-950 p-5 text-white", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-white/60", children: "Resumen del plan" }), _jsx("p", { className: "mt-2 text-2xl font-bold", children: currentPlan?.name || "Growth" })] }), _jsx(WalletCards, { className: "h-8 w-8 text-teal-300" })] }), _jsx("p", { className: "mt-4 break-words text-3xl font-extrabold sm:text-4xl", children: currency(billingCycle === "YEARLY" ? currentPlan?.yearlyPrice ?? 0 : currentPlan?.monthlyPrice ?? 0) }), _jsxs("p", { className: "mt-2 text-sm text-white/60", children: ["Cobro ", billingCycle === "YEARLY" ? "anual" : "mensual", " en modo simulado"] }), _jsxs("div", { className: "mt-4 flex items-start gap-2 text-sm text-white/80", children: [_jsx(LockKeyhole, { className: "mt-0.5 h-4 w-4 shrink-0 text-teal-300" }), "Acceso automatico a la plataforma luego del alta."] })] }), _jsx(Button, { type: "submit", className: "w-full text-center", size: "lg", children: "Registrar clinica y activar plan" })] })] })] }) }));
}
