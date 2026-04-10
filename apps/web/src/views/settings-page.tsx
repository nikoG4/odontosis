import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BadgeCheck, Bot, CreditCard, MessageSquareMore } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApi } from "../hooks/use-api";
import { currency } from "../lib/utils";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),
  appointmentDuration: z.coerce.number().min(15),
});

const prices: Record<string, { monthly: number; yearly: number }> = {
  START: { monthly: 199000, yearly: 1980000 },
  GROWTH: { monthly: 349000, yearly: 3490000 },
  SCALE: { monthly: 599000, yearly: 5990000 },
};

export function SettingsPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["clinic"],
    queryFn: () => api.get<any>("/clinic/me"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: {
      name: data?.name || "",
      phone: data?.phone || "",
      email: data?.email || "",
      address: data?.address || "",
      appointmentDuration: data?.appointmentDuration || 30,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => api.put("/clinic/me", values),
    onSuccess: () => {
      toast.success("Clinica actualizada");
      queryClient.invalidateQueries({ queryKey: ["clinic"] });
    },
  });

  const planPrice =
    data?.subscriptionPlan && prices[data.subscriptionPlan]
      ? data.billingCycle === "YEARLY"
        ? prices[data.subscriptionPlan].yearly
        : prices[data.subscriptionPlan].monthly
      : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CreditCard className="h-7 w-7 text-teal-700" />
          <p className="mt-4 text-sm text-slate-500">Plan actual</p>
          <p className="mt-2 text-3xl font-extrabold">{data?.subscriptionPlan || "GROWTH"}</p>
          <p className="mt-2 text-sm text-slate-500">{planPrice ? currency(planPrice) : "Precio disponible en pricing"}</p>
        </Card>
        <Card>
          <BadgeCheck className="h-7 w-7 text-teal-700" />
          <p className="mt-4 text-sm text-slate-500">Estado</p>
          <p className="mt-2 text-3xl font-extrabold">{data?.subscriptionStatus || "ACTIVE"}</p>
          <p className="mt-2 text-sm text-slate-500">Ciclo {data?.billingCycle === "YEARLY" ? "anual" : "mensual"}</p>
        </Card>
        <Card>
          <MessageSquareMore className="h-7 w-7 text-teal-700" />
          <p className="mt-4 text-sm text-slate-500">Integraciones</p>
          <p className="mt-2 text-3xl font-extrabold">Ready</p>
          <p className="mt-2 text-sm text-slate-500">Bancard, WhatsApp e IA listos para conectar.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Configuracion</h1>
          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <Input placeholder="Nombre de clinica" {...form.register("name")} />
            <Input placeholder="Telefono" {...form.register("phone")} />
            <Input placeholder="Email" {...form.register("email")} />
            <Input placeholder="Direccion" {...form.register("address")} />
            <Input type="number" placeholder="Duracion de turnos" {...form.register("appointmentDuration")} />
            <Button type="submit" className="w-full sm:w-auto">Guardar configuracion</Button>
          </form>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Arquitectura preparada</h2>
              <p className="mt-2 text-sm text-slate-500">Base comercial y tecnica para seguir escalando producto.</p>
            </div>
            <Badge className="bg-teal-100 text-teal-900">SaaS Ready</Badge>
          </div>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <Bot className="h-5 w-5 text-teal-700" />
              <p className="mt-3 font-semibold text-slate-900">IA Stub</p>
              <p className="mt-2">Preparada para interpretar intencion, sugerir horarios, generar mensajes y resumir consultas.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <MessageSquareMore className="h-5 w-5 text-teal-700" />
              <p className="mt-3 font-semibold text-slate-900">WhatsApp Stub</p>
              <p className="mt-2">Recordatorios desacoplados para futuro proveedor de WhatsApp Business API.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <CreditCard className="h-5 w-5 text-teal-700" />
              <p className="mt-3 font-semibold text-slate-900">Bancard Ready</p>
              <p className="mt-2">Checkout simulado activo hoy y estructura lista para credenciales reales despues.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
