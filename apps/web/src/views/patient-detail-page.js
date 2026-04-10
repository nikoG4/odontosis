import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";
const noteSchema = z.object({
    professionalId: z.string().min(1),
    reason: z.string().min(2),
    diagnosis: z.string().optional(),
    procedure: z.string().optional(),
    indications: z.string().optional(),
    observations: z.string().optional(),
});
const paymentSchema = z.object({
    treatmentId: z.string().optional(),
    amount: z.coerce.number().positive(),
    method: z.enum(["CASH", "CARD", "TRANSFER", "OTHER"]),
});
export function PatientDetailPage() {
    const { id = "" } = useParams();
    const api = useApi();
    const queryClient = useQueryClient();
    const noteForm = useForm({
        resolver: zodResolver(noteSchema),
        defaultValues: { professionalId: "", reason: "", diagnosis: "", procedure: "", indications: "", observations: "" },
    });
    const paymentForm = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: { treatmentId: "", amount: 0, method: "CASH" },
    });
    const { data: patient } = useQuery({
        queryKey: ["patient", id],
        queryFn: () => api.get(`/patients/${id}`),
    });
    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: () => api.get("/users"),
    });
    const noteMutation = useMutation({
        mutationFn: (values) => api.post("/clinical-notes", { ...values, patientId: id, date: new Date().toISOString() }),
        onSuccess: () => {
            toast.success("Atencion registrada");
            noteForm.reset();
            queryClient.invalidateQueries({ queryKey: ["patient", id] });
        },
    });
    const paymentMutation = useMutation({
        mutationFn: (values) => api.post("/payments", {
            patientId: id,
            treatmentId: values.treatmentId || null,
            amount: values.amount,
            method: values.method,
            paidAt: new Date().toISOString(),
        }),
        onSuccess: () => {
            toast.success("Pago registrado");
            paymentForm.reset();
            queryClient.invalidateQueries({ queryKey: ["patient", id] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-teal-700 sm:text-sm sm:tracking-[0.35em]", children: "Ficha del paciente" }), _jsxs("h1", { className: "mt-2 break-words text-2xl font-extrabold sm:text-3xl", children: [patient?.firstName, " ", patient?.lastName] }), _jsxs("p", { className: "mt-2 break-words text-sm text-slate-500 sm:text-base", children: [patient?.document || "Sin documento", " \u00B7 ", patient?.phone || "Sin telefono"] })] }), _jsxs("div", { className: "w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm sm:w-auto", children: [_jsx("p", { className: "font-semibold", children: "Tratamientos" }), _jsx("p", { children: patient?.treatments?.length ?? 0 })] })] }) }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-2", children: [_jsxs(Card, { children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Registrar atencion" }), _jsxs("form", { className: "mt-4 space-y-3", onSubmit: noteForm.handleSubmit((values) => noteMutation.mutate(values)), children: [_jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...noteForm.register("professionalId"), children: [_jsx("option", { value: "", children: "Seleccionar profesional" }), users?.map((user) => (_jsxs("option", { value: user.id, children: [user.firstName, " ", user.lastName] }, user.id)))] }), _jsx(Input, { placeholder: "Motivo", ...noteForm.register("reason") }), _jsx(Textarea, { placeholder: "Diagnostico", ...noteForm.register("diagnosis") }), _jsx(Textarea, { placeholder: "Procedimiento", ...noteForm.register("procedure") }), _jsx(Textarea, { placeholder: "Indicaciones", ...noteForm.register("indications") }), _jsx(Textarea, { placeholder: "Observaciones", ...noteForm.register("observations") }), _jsx(Button, { type: "submit", className: "w-full", children: "Guardar atencion" })] })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Registrar pago" }), _jsxs("form", { className: "mt-4 space-y-3", onSubmit: paymentForm.handleSubmit((values) => paymentMutation.mutate(values)), children: [_jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...paymentForm.register("treatmentId"), children: [_jsx("option", { value: "", children: "Sin tratamiento asociado" }), patient?.treatments?.map((treatment) => (_jsxs("option", { value: treatment.id, children: [treatment.type, " \u00B7 ", currency(Number(treatment.finalCost ?? treatment.estimatedCost))] }, treatment.id)))] }), _jsx(Input, { type: "number", inputMode: "decimal", placeholder: "Monto", ...paymentForm.register("amount") }), _jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...paymentForm.register("method"), children: [_jsx("option", { value: "CASH", children: "Efectivo" }), _jsx("option", { value: "CARD", children: "Tarjeta" }), _jsx("option", { value: "TRANSFER", children: "Transferencia" }), _jsx("option", { value: "OTHER", children: "Otro" })] }), _jsx(Button, { type: "submit", className: "w-full", children: "Guardar pago" })] })] })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-3", children: [_jsxs(Card, { children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Turnos" }), _jsx("div", { className: "mt-4 space-y-3", children: patient?.appointments?.map((appointment) => (_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx("p", { className: "font-semibold", children: new Date(appointment.startAt).toLocaleString() }), _jsx("p", { className: "text-sm text-slate-500", children: appointment.reason })] }, appointment.id))) })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Notas clinicas" }), _jsx("div", { className: "mt-4 space-y-3", children: patient?.clinicalNotes?.map((note) => (_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx("p", { className: "font-semibold", children: note.reason }), _jsx("p", { className: "text-sm text-slate-500", children: note.diagnosis || "Sin diagnostico" })] }, note.id))) })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-lg font-bold sm:text-xl", children: "Pagos" }), _jsx("div", { className: "mt-4 space-y-3", children: patient?.payments?.map((payment) => (_jsxs("div", { className: "rounded-2xl bg-slate-50 p-4", children: [_jsx("p", { className: "font-semibold", children: currency(Number(payment.amount)) }), _jsx("p", { className: "text-sm text-slate-500", children: new Date(payment.paidAt).toLocaleDateString() })] }, payment.id))) })] })] })] }));
}
