import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useApi } from "../hooks/use-api";
const schema = z.object({
    patientId: z.string().min(1),
    professionalId: z.string().min(1),
    startAt: z.string().min(1),
    durationMinutes: z.coerce.number().min(15),
    reason: z.string().min(2),
});
export function NewAppointmentPage() {
    const api = useApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { patientId: "", professionalId: "", startAt: "", durationMinutes: 30, reason: "" },
    });
    const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get("/patients") });
    const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.get("/users") });
    const createMutation = useMutation({
        mutationFn: (values) => api.post("/appointments", { ...values, startAt: new Date(values.startAt).toISOString() }),
        onSuccess: () => {
            toast.success("Turno creado");
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            navigate("/agenda");
        },
    });
    return (_jsxs(Card, { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Agenda" }), _jsx("h1", { className: "mt-2 text-2xl font-extrabold sm:text-3xl", children: "Nuevo turno" }), _jsxs("form", { className: "mt-6 space-y-4", onSubmit: form.handleSubmit((values) => createMutation.mutate(values)), children: [_jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...form.register("patientId"), children: [_jsx("option", { value: "", children: "Paciente" }), patients?.map((patient) => (_jsxs("option", { value: patient.id, children: [patient.firstName, " ", patient.lastName] }, patient.id)))] }), _jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...form.register("professionalId"), children: [_jsx("option", { value: "", children: "Profesional" }), users?.map((user) => (_jsxs("option", { value: user.id, children: [user.firstName, " ", user.lastName, " \u00B7 ", user.role] }, user.id)))] }), _jsx(Input, { type: "datetime-local", ...form.register("startAt") }), _jsx(Input, { type: "number", placeholder: "Duracion", ...form.register("durationMinutes") }), _jsx(Input, { placeholder: "Motivo", ...form.register("reason") }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [_jsx(Button, { type: "submit", className: "w-full sm:w-auto", children: "Guardar turno" }), _jsx(Button, { type: "button", variant: "outline", className: "w-full sm:w-auto", onClick: () => navigate("/agenda"), children: "Volver al listado" })] })] })] }));
}
