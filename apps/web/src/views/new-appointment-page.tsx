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
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { patientId: "", professionalId: "", startAt: "", durationMinutes: 30, reason: "" },
  });
  const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get<any[]>("/patients") });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.get<any[]>("/users") });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => api.post("/appointments", { ...values, startAt: new Date(values.startAt).toISOString() }),
    onSuccess: () => {
      toast.success("Turno creado");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/agenda");
    },
  });

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Agenda</p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Nuevo turno</h1>
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
            <option key={user.id} value={user.id}>{user.firstName} {user.lastName} · {user.role}</option>
          ))}
        </select>
        <Input type="datetime-local" {...form.register("startAt")} />
        <Input type="number" placeholder="Duracion" {...form.register("durationMinutes")} />
        <Input placeholder="Motivo" {...form.register("reason")} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">Guardar turno</Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/agenda")}>
            Volver al listado
          </Button>
        </div>
      </form>
    </Card>
  );
}
