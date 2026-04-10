import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";

export function AgendaPage() {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => api.get<any[]>("/appointments"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/appointments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Agenda</h1>
          <Link to="/agenda/new">
            <Button>Nuevo turno</Button>
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {appointments?.map((appointment) => (
            <div key={appointment.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                  <p className="break-words text-sm text-slate-500">
                    {new Date(appointment.startAt).toLocaleString()} · {appointment.reason}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{appointment.status}</Badge>
                  <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: appointment.id, status: "CONFIRMED" })}>Confirmar</Button>
                  <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: appointment.id, status: "ATTENDED" })}>Asistio</Button>
                  <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: appointment.id, status: "NO_SHOW" })}>No asistio</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
