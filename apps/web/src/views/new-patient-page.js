import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useApi } from "../hooks/use-api";
const schema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    document: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    allergies: z.string().optional(),
    medicalHistory: z.string().optional(),
    notes: z.string().optional(),
});
export function NewPatientPage() {
    const api = useApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            document: "",
            phone: "",
            whatsapp: "",
            email: "",
            address: "",
            allergies: "",
            medicalHistory: "",
            notes: "",
        },
    });
    const createMutation = useMutation({
        mutationFn: (values) => api.post("/patients", { ...values, email: values.email || null }),
        onSuccess: () => {
            toast.success("Paciente creado");
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            navigate("/patients");
        },
    });
    return (_jsxs(Card, { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-teal-700", children: "Alta clinica" }), _jsx("h1", { className: "mt-2 text-2xl font-extrabold sm:text-3xl", children: "Nuevo paciente" }), _jsxs("form", { className: "mt-6 space-y-4", onSubmit: form.handleSubmit((values) => createMutation.mutate(values)), children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Input, { placeholder: "Nombre", ...form.register("firstName") }), _jsx(Input, { placeholder: "Apellido", ...form.register("lastName") })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Input, { placeholder: "Documento", ...form.register("document") }), _jsx(Input, { placeholder: "Telefono", ...form.register("phone") })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Input, { placeholder: "WhatsApp", ...form.register("whatsapp") }), _jsx(Input, { placeholder: "Email", ...form.register("email") })] }), _jsx(Input, { placeholder: "Direccion", ...form.register("address") }), _jsx(Textarea, { placeholder: "Alergias", ...form.register("allergies") }), _jsx(Textarea, { placeholder: "Antecedentes", ...form.register("medicalHistory") }), _jsx(Textarea, { placeholder: "Observaciones", ...form.register("notes") }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [_jsx(Button, { type: "submit", className: "w-full sm:w-auto", children: "Guardar paciente" }), _jsx(Button, { type: "button", variant: "outline", className: "w-full sm:w-auto", onClick: () => navigate("/patients"), children: "Volver al listado" })] })] })] }));
}
