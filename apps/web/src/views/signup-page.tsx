import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BadgeCheck, CreditCard, LockKeyhole, WalletCards } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";
import { currency } from "../lib/utils";

const schema = z.object({
  clinicName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(4),
  appointmentDuration: z.coerce.number().min(15).max(120),
  adminFirstName: z.string().min(2),
  adminLastName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  planId: z.enum(["START", "GROWTH", "SCALE"]),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  paymentMethod: z.enum(["SIMULATED", "BANCARD"]),
  cardholderName: z.string().min(2),
  cardNumber: z.string().min(12),
});

export function SignupPage() {
  const navigate = useNavigate();
  const { registerClinic } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"START" | "GROWTH" | "SCALE">("GROWTH");
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api<any>("/auth/plans"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      clinicName: "",
      phone: "",
      email: "",
      address: "",
      appointmentDuration: 30,
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      adminPassword: "",
      planId: "GROWTH",
      billingCycle: "MONTHLY",
      paymentMethod: "SIMULATED",
      cardholderName: "",
      cardNumber: "4111111111111111",
    },
  });

  const billingCycle = form.watch("billingCycle");
  const currentPlan = useMemo(
    () => data?.plans?.find((plan: any) => plan.id === selectedPlan) ?? data?.plans?.[1],
    [data?.plans, selectedPlan],
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbfb_0%,#edf5f5_38%,#fff7ed_100%)] px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Alta comercial</p>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">Crea la clinica, activa el plan y entra a la plataforma.</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Checkout simulado para acelerar validacion. La integracion real con Bancard ya queda preparada en backend.
            </p>
          </div>

          <div className="grid gap-4">
            {data?.plans?.map((plan: any) => {
              const selected = selectedPlan === plan.id;
              const price = billingCycle === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    form.setValue("planId", plan.id);
                  }}
                  className={`rounded-[2rem] border p-4 text-left transition sm:p-5 ${selected ? "border-teal-600 bg-teal-50 shadow-lg shadow-teal-100" : "border-slate-200 bg-white/80 hover:border-slate-300"}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold sm:text-2xl">{plan.name}</h2>
                        {plan.recommended ? <Badge className="bg-amber-100 text-amber-900">Recomendado</Badge> : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{plan.setupLabel}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-extrabold sm:text-3xl">{currency(price)}</p>
                      <p className="text-sm text-slate-500">por {billingCycle === "YEARLY" ? "ano" : "mes"}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-700">{plan.description}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {plan.features.map((feature: string) => (
                      <div key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Card className="rounded-[2rem] p-4 sm:p-7 xl:sticky xl:top-6 xl:self-start">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Checkout</p>
              <h2 className="mt-2 text-xl font-bold sm:text-2xl">Activa tu cuenta</h2>
            </div>
            <div className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1 sm:w-auto">
              {["MONTHLY", "YEARLY"].map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${billingCycle === cycle ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
                  onClick={() => form.setValue("billingCycle", cycle as "MONTHLY" | "YEARLY")}
                >
                  {cycle === "MONTHLY" ? "Mensual" : "Anual"}
                </button>
              ))}
            </div>
          </div>

          <form
            className="mt-6 space-y-5"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                const session = await registerClinic({ ...values, planId: selectedPlan });
                toast.success(`Pago ${session.onboarding?.checkout.status?.toLowerCase() || "aprobado"} y acceso habilitado`);
                navigate("/dashboard");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "No se pudo activar la cuenta");
              }
            })}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">Datos de la clinica</p>
              <p className="mt-1 text-sm text-slate-500">Informacion comercial y operativa basica para crear el tenant.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Nombre de la clinica" {...form.register("clinicName")} />
              <Input placeholder="Telefono de la clinica" inputMode="tel" {...form.register("phone")} />
            </div>
            <Input placeholder="Email comercial" inputMode="email" {...form.register("email")} />
            <Input placeholder="Direccion" {...form.register("address")} />
            <Input type="number" placeholder="Duracion de turnos" {...form.register("appointmentDuration")} />

            <div>
              <p className="text-sm font-semibold text-slate-900">Administrador principal</p>
              <p className="mt-1 text-sm text-slate-500">Este usuario entra primero a la plataforma y gestiona la cuenta.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Nombre del admin" {...form.register("adminFirstName")} />
              <Input placeholder="Apellido del admin" {...form.register("adminLastName")} />
            </div>
            <Input placeholder="Email del admin" inputMode="email" {...form.register("adminEmail")} />
            <Input type="password" placeholder="Password" {...form.register("adminPassword")} />

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-700" />
                <p className="font-semibold">Pago del plan</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="radio" value="SIMULATED" {...form.register("paymentMethod")} />
                    Simulado
                  </label>
                  <p className="mt-2 text-xs text-slate-500">Acepta cualquier tarjeta y habilita acceso inmediato.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input type="radio" value="BANCARD" {...form.register("paymentMethod")} />
                    Bancard Ready
                  </label>
                  <p className="mt-2 text-xs text-slate-500">El flujo queda preparado para conectar credenciales reales mas adelante.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input placeholder="Titular de la tarjeta" {...form.register("cardholderName")} />
                <Input placeholder="Numero de tarjeta" inputMode="numeric" {...form.register("cardNumber")} />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">Resumen del plan</p>
                  <p className="mt-2 text-2xl font-bold">{currentPlan?.name || "Growth"}</p>
                </div>
                <WalletCards className="h-8 w-8 text-teal-300" />
              </div>
              <p className="mt-4 break-words text-3xl font-extrabold sm:text-4xl">
                {currency(billingCycle === "YEARLY" ? currentPlan?.yearlyPrice ?? 0 : currentPlan?.monthlyPrice ?? 0)}
              </p>
              <p className="mt-2 text-sm text-white/60">Cobro {billingCycle === "YEARLY" ? "anual" : "mensual"} en modo simulado</p>
              <div className="mt-4 flex items-start gap-2 text-sm text-white/80">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                Acceso automatico a la plataforma luego del alta.
              </div>
            </div>

            <Button type="submit" className="w-full text-center" size="lg">Registrar clinica y activar plan</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
