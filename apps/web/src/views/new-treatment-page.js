import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useApi } from "../hooks/use-api";
const schema = z.object({
    patientId: z.string().min(1),
    professionalId: z.string().optional(),
    type: z.string().min(2),
    description: z.string().min(2),
    status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
    estimatedCost: z.coerce.number().nonnegative(),
    finalCost: z.coerce.number().nonnegative().optional(),
});
export function NewTreatmentPage() {
    const api = useApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { patientId: "", professionalId: "", type: "", description: "", status: "PLANNED", estimatedCost: 0, finalCost: 0 },
    });
    const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get("/patients") });
    const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.get("/users") });
    const createMutation = useMutation({
        mutationFn: (values) => api.post("/treatments", { ...values, professionalId: values.professionalId || null }),
        onSuccess: () => {
            toast.success("Tratamiento creado");
            queryClient.invalidateQueries({ queryKey: ["treatments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            navigate("/treatments");
        },
    });
    return (_jsxs(Card, { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Seguimiento" }), _jsx("h1", { className: "mt-2 text-2xl font-extrabold sm:text-3xl", children: "Nuevo tratamiento" }), _jsxs("form", { className: "mt-6 space-y-4", onSubmit: form.handleSubmit((values) => createMutation.mutate(values)), children: [_jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...form.register("patientId"), children: [_jsx("option", { value: "", children: "Paciente" }), patients?.map((patient) => (_jsxs("option", { value: patient.id, children: [patient.firstName, " ", patient.lastName] }, patient.id)))] }), _jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...form.register("professionalId"), children: [_jsx("option", { value: "", children: "Profesional" }), users?.map((user) => (_jsxs("option", { value: user.id, children: [user.firstName, " ", user.lastName] }, user.id)))] }), _jsx(Input, { placeholder: "Tipo", ...form.register("type") }), _jsx(Textarea, { placeholder: "Descripcion", ...form.register("description") }), _jsxs("select", { className: "h-11 w-full rounded-xl border border-border px-4", ...form.register("status"), children: [_jsx("option", { value: "PLANNED", children: "Planificado" }), _jsx("option", { value: "IN_PROGRESS", children: "En progreso" }), _jsx("option", { value: "COMPLETED", children: "Completado" }), _jsx("option", { value: "CANCELLED", children: "Cancelado" })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Input, { type: "number", placeholder: "Costo estimado", ...form.register("estimatedCost") }), _jsx(Input, { type: "number", placeholder: "Costo final", ...form.register("finalCost") })] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [_jsx(Button, { type: "submit", className: "w-full sm:w-auto", children: "Guardar tratamiento" }), _jsx(Button, { type: "button", variant: "outline", className: "w-full sm:w-auto", onClick: () => navigate("/treatments"), children: "Volver al listado" })] })] })] }));
}
