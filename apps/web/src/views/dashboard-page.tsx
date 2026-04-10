import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";

export function DashboardPage() {
  const api = useApi();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<any>("/dashboard"),
  });

  const metrics = [
    { label: "Turnos de hoy", value: data?.todayAppointments ?? 0 },
    { label: "Tratamientos activos", value: data?.activeTreatments ?? 0 },
    { label: "Pendientes de confirmacion", value: data?.pendingPatients?.length ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-teal-700 sm:text-sm sm:tracking-[0.35em]">Resumen operativo</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Dashboard</h1>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold sm:text-4xl">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold sm:text-xl">Proximos turnos</h2>
            <Badge>{data?.upcomingAppointments?.length ?? 0}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {data?.upcomingAppointments?.map((appointment: any) => (
              <div key={appointment.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                <p className="text-sm text-slate-500">{new Date(appointment.startAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold sm:text-xl">Pagos pendientes</h2>
            <Badge>{data?.pendingPayments?.length ?? 0}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {data?.pendingPayments?.map((item: any) => (
              <div key={item.treatmentId} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{item.patientName}</p>
                <p className="text-sm text-slate-500">Pendiente: {currency(item.pending)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
