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
  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { professionalId: "", reason: "", diagnosis: "", procedure: "", indications: "", observations: "" },
  });
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { treatmentId: "", amount: 0, method: "CASH" },
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => api.get<any>(`/patients/${id}`),
  });
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<any[]>("/users"),
  });

  const noteMutation = useMutation({
    mutationFn: (values: z.infer<typeof noteSchema>) =>
      api.post("/clinical-notes", { ...values, patientId: id, date: new Date().toISOString() }),
    onSuccess: () => {
      toast.success("Atencion registrada");
      noteForm.reset();
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (values: z.infer<typeof paymentSchema>) =>
      api.post("/payments", {
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

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-700 sm:text-sm sm:tracking-[0.35em]">Ficha del paciente</p>
            <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl">{patient?.firstName} {patient?.lastName}</h1>
            <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">{patient?.document || "Sin documento"} · {patient?.phone || "Sin telefono"}</p>
          </div>
          <div className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm sm:w-auto">
            <p className="font-semibold">Tratamientos</p>
            <p>{patient?.treatments?.length ?? 0}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold sm:text-xl">Registrar atencion</h2>
          <form className="mt-4 space-y-3" onSubmit={noteForm.handleSubmit((values) => noteMutation.mutate(values))}>
            <select className="h-11 w-full rounded-xl border border-border px-4" {...noteForm.register("professionalId")}>
              <option value="">Seleccionar profesional</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
              ))}
            </select>
            <Input placeholder="Motivo" {...noteForm.register("reason")} />
            <Textarea placeholder="Diagnostico" {...noteForm.register("diagnosis")} />
            <Textarea placeholder="Procedimiento" {...noteForm.register("procedure")} />
            <Textarea placeholder="Indicaciones" {...noteForm.register("indications")} />
            <Textarea placeholder="Observaciones" {...noteForm.register("observations")} />
            <Button type="submit" className="w-full">Guardar atencion</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-bold sm:text-xl">Registrar pago</h2>
          <form className="mt-4 space-y-3" onSubmit={paymentForm.handleSubmit((values) => paymentMutation.mutate(values))}>
            <select className="h-11 w-full rounded-xl border border-border px-4" {...paymentForm.register("treatmentId")}>
              <option value="">Sin tratamiento asociado</option>
              {patient?.treatments?.map((treatment: any) => (
                <option key={treatment.id} value={treatment.id}>{treatment.type} · {currency(Number(treatment.finalCost ?? treatment.estimatedCost))}</option>
              ))}
            </select>
            <Input type="number" inputMode="decimal" placeholder="Monto" {...paymentForm.register("amount")} />
            <select className="h-11 w-full rounded-xl border border-border px-4" {...paymentForm.register("method")}>
              <option value="CASH">Efectivo</option>
              <option value="CARD">Tarjeta</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="OTHER">Otro</option>
            </select>
            <Button type="submit" className="w-full">Guardar pago</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="text-lg font-bold sm:text-xl">Turnos</h2>
          <div className="mt-4 space-y-3">
            {patient?.appointments?.map((appointment: any) => (
              <div key={appointment.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{new Date(appointment.startAt).toLocaleString()}</p>
                <p className="text-sm text-slate-500">{appointment.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold sm:text-xl">Notas clinicas</h2>
          <div className="mt-4 space-y-3">
            {patient?.clinicalNotes?.map((note: any) => (
              <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{note.reason}</p>
                <p className="text-sm text-slate-500">{note.diagnosis || "Sin diagnostico"}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold sm:text-xl">Pagos</h2>
          <div className="mt-4 space-y-3">
            {patient?.payments?.map((payment: any) => (
              <div key={payment.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{currency(Number(payment.amount))}</p>
                <p className="text-sm text-slate-500">{new Date(payment.paidAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
