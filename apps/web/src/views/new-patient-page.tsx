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
  const form = useForm<z.infer<typeof schema>>({
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
    mutationFn: (values: z.infer<typeof schema>) => api.post("/patients", { ...values, email: values.email || null }),
    onSuccess: () => {
      toast.success("Paciente creado");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      navigate("/patients");
    },
  });

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Alta clinica</p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Nuevo paciente</h1>
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Nombre" {...form.register("firstName")} />
          <Input placeholder="Apellido" {...form.register("lastName")} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Documento" {...form.register("document")} />
          <Input placeholder="Telefono" {...form.register("phone")} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="WhatsApp" {...form.register("whatsapp")} />
          <Input placeholder="Email" {...form.register("email")} />
        </div>
        <Input placeholder="Direccion" {...form.register("address")} />
        <Textarea placeholder="Alergias" {...form.register("allergies")} />
        <Textarea placeholder="Antecedentes" {...form.register("medicalHistory")} />
        <Textarea placeholder="Observaciones" {...form.register("notes")} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">Guardar paciente</Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/patients")}>
            Volver al listado
          </Button>
        </div>
      </form>
    </Card>
  );
}
