import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useApi } from "../hooks/use-api";

export function PatientsPage() {
  const api = useApi();
  const { data } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get<any[]>("/patients"),
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Base clinica</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Pacientes</h1>
            <p className="mt-2 text-sm text-slate-500">Acceso rapido a ficha, antecedentes, tratamientos, turnos y pagos.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold">{data?.length ?? 0} registrados</div>
            <Link to="/patients/new">
              <Button>Nuevo paciente</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Search className="h-4 w-4" />
            Busqueda y detalle rapido
          </div>
          <p className="mt-2">Cada tarjeta te lleva a la ficha completa del paciente para registrar atencion, revisar tratamientos y cargar pagos.</p>
        </div>

        <div className="mt-6 space-y-3">
          {data?.map((patient) => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              className="block rounded-2xl border border-border bg-slate-50 p-4 transition hover:border-primary hover:bg-white"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{patient.firstName} {patient.lastName}</p>
                  <p className="break-words text-sm text-slate-500">{patient.document || "Sin documento"} · {patient.phone || "Sin telefono"}</p>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-teal-700">Ver ficha</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
