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
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { patientId: "", professionalId: "", type: "", description: "", status: "PLANNED", estimatedCost: 0, finalCost: 0 },
  });
  const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get<any[]>("/patients") });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.get<any[]>("/users") });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => api.post("/treatments", { ...values, professionalId: values.professionalId || null }),
    onSuccess: () => {
      toast.success("Tratamiento creado");
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/treatments");
    },
  });

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Seguimiento</p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Nuevo tratamiento</h1>
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
        <select className="h-11 w-full rounded-xl border border-border px-4" {...form.register("patientId")}>
          <option value="">Paciente</option>
          {patients?.map((patient) => (
            <option key={patient.id} value={patient.id}>{patient.firstName} {patient.lastName}</option>
          ))}
        </select>
        <select className="h-11 w-full rounded-xl border border-border px-4" {...form.register("professionalId")}>
          <option value="">Profesional</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
          ))}
        </select>
        <Input placeholder="Tipo" {...form.register("type")} />
        <Textarea placeholder="Descripcion" {...form.register("description")} />
        <select className="h-11 w-full rounded-xl border border-border px-4" {...form.register("status")}>
          <option value="PLANNED">Planificado</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="COMPLETED">Completado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
        <div className="grid gap-4 md:grid-cols-2">
          <Input type="number" placeholder="Costo estimado" {...form.register("estimatedCost")} />
          <Input type="number" placeholder="Costo final" {...form.register("finalCost")} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">Guardar tratamiento</Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/treatments")}>
            Volver al listado
          </Button>
        </div>
      </form>
    </Card>
  );
}
