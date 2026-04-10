import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";

export function TreatmentsPage() {
  const api = useApi();
  const { data: treatments } = useQuery({
    queryKey: ["treatments"],
    queryFn: () => api.get<any[]>("/treatments"),
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Tratamientos</h1>
          <Link to="/treatments/new">
            <Button>Nuevo tratamiento</Button>
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {treatments?.map((treatment) => (
            <div key={treatment.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-semibold">{treatment.type} · {treatment.patient.firstName} {treatment.patient.lastName}</p>
                  <p className="break-words text-sm text-slate-500">{treatment.description}</p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge>{treatment.status}</Badge>
                  <p className="mt-2 text-sm font-semibold">{currency(Number(treatment.finalCost ?? treatment.estimatedCost))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
