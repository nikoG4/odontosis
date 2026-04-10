import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeDollarSign, CircleDollarSign } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";

export function PaymentsPage() {
  const api = useApi();
  const { data } = useQuery({
    queryKey: ["payments"],
    queryFn: () => api.get<any[]>("/payments"),
  });

  const totals = useMemo(() => {
    const payments = data ?? [];
    const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const cash = payments
      .filter((payment) => payment.method === "CASH")
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    return { total, cash };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <BadgeDollarSign className="h-7 w-7 text-teal-700" />
          <p className="mt-4 text-sm text-slate-500">Cobrado total</p>
          <p className="mt-2 text-3xl font-extrabold">{currency(totals.total)}</p>
        </Card>
        <Card>
          <CircleDollarSign className="h-7 w-7 text-teal-700" />
          <p className="mt-4 text-sm text-slate-500">Cobrado en efectivo</p>
          <p className="mt-2 text-3xl font-extrabold">{currency(totals.cash)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Movimientos</p>
          <p className="mt-2 text-3xl font-extrabold">{data?.length ?? 0}</p>
          <p className="mt-2 text-sm text-slate-500">Historial de ingresos registrados en la plataforma.</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Tesoreria</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Pagos</h1>
          </div>
          <Badge>{data?.length ?? 0} movimientos</Badge>
        </div>
        <div className="mt-6 space-y-3">
          {data?.map((payment) => (
            <div key={payment.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{payment.patient.firstName} {payment.patient.lastName}</p>
                  <p className="break-words text-sm text-slate-500">{new Date(payment.paidAt).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold">{currency(Number(payment.amount))}</p>
                  <p className="text-sm text-slate-500">{payment.method}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
