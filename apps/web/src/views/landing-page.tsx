import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users2,
  WalletCards,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { api } from "../lib/api";
import { currency } from "../lib/utils";

const features = [
  {
    icon: CalendarClock,
    title: "Agenda con anti-ausencias",
    text: "Turnos, confirmaciones pendientes, reprogramaciones y base preparada para recordatorios por WhatsApp.",
  },
  {
    icon: Users2,
    title: "Pacientes y ficha completa",
    text: "Datos clinicos, antecedentes, tratamientos, seguimientos y estado financiero en una sola vista.",
  },
  {
    icon: Stethoscope,
    title: "Atencion clinica ordenada",
    text: "Notas, diagnosticos, procedimientos e indicaciones con foco en velocidad operativa.",
  },
  {
    icon: CreditCard,
    title: "Cobranza y planes claros",
    text: "Pagos, saldos pendientes y estructura lista para vender el sistema como SaaS desde el dia uno.",
  },
];

const faqs = [
  {
    q: "Ya puedo cobrar a mis clientes con esto?",
    a: "Si. El alta comercial ya esta modelada con seleccion de plan y checkout simulado, y el backend quedo preparado para conectar Bancard.",
  },
  {
    q: "Sirve para una clinica chica y tambien para crecer?",
    a: "Si. El producto es multi-tenant desde la base, asi que una clinica puede operar hoy y escalar manana sin rehacer arquitectura.",
  },
  {
    q: "Que incluye el MVP comercial?",
    a: "Landing, onboarding, suscripcion, login y plataforma operativa con pacientes, agenda, atencion, tratamientos y pagos.",
  },
];

const steps = [
  "Publicas la propuesta comercial y captas una clinica interesada.",
  "La clinica elige plan, completa datos y simula el pago.",
  "El admin entra directo a la plataforma con su tenant activo.",
];

export function LandingPage() {
  const { data } = useQuery({
    queryKey: ["public-plans"],
    queryFn: () => api<any>("/auth/plans"),
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbfb_0%,#edf5f5_38%,#fff7ed_100%)] text-slate-900">
      <section className="border-b border-slate-200/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-700">OdontoSis</p>
            <p className="mt-1 text-sm text-slate-500">SaaS para clinicas odontologicas</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Ingresar</Link>
            <Link to="/signup">
              <Button>Empezar ahora</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="space-y-6">
          <Badge className="bg-teal-100 text-teal-900">Hecho para venderse como SaaS real</Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Menos caos operativo. Mas control, mas pacientes atendidos y mejor cobranza.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            OdontoSis centraliza agenda, pacientes, evolucion clinica, tratamientos y pagos en una plataforma moderna lista para comercializacion.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="lg" className="gap-2">Crear clinica y activar plan <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Ver plataforma</Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="rounded-2xl p-5">
              <p className="text-3xl font-extrabold">+30%</p>
              <p className="mt-2 text-sm text-slate-500">Mas orden en recepcion y seguimiento de confirmaciones.</p>
            </Card>
            <Card className="rounded-2xl p-5">
              <p className="text-3xl font-extrabold">1 vista</p>
              <p className="mt-2 text-sm text-slate-500">Paciente, agenda, notas clinicas y cobranza conectados.</p>
            </Card>
            <Card className="rounded-2xl p-5">
              <p className="text-3xl font-extrabold">SaaS</p>
              <p className="mt-2 text-sm text-slate-500">Alta comercial, planes y cobro listos para iterar.</p>
            </Card>
          </div>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border-slate-200 bg-slate-950 p-0 text-white">
          <div className="border-b border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-300">Vista ejecutiva</p>
            <h2 className="mt-3 text-2xl font-bold">Una clinica mas profesional desde el primer dia</h2>
          </div>
          <div className="grid gap-4 p-6">
            <div className="rounded-3xl bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">Turnos de hoy</p>
                  <p className="mt-2 text-4xl font-extrabold">18</p>
                </div>
                <Badge className="bg-emerald-400/20 text-emerald-200">94% confirmados</Badge>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <MessageCircleMore className="h-6 w-6 text-teal-300" />
                <p className="mt-4 font-semibold">WhatsApp preparado</p>
                <p className="mt-2 text-sm text-white/65">Recordatorios y mensajes desacoplados para integrar proveedor real.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <Sparkles className="h-6 w-6 text-amber-300" />
                <p className="mt-4 font-semibold">IA preparada</p>
                <p className="mt-2 text-sm text-white/65">Sugerencias de horarios, resumenes y asistencias futuras desde arquitectura lista.</p>
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-r from-teal-500/20 to-amber-400/20 p-5">
              <p className="text-sm text-white/70">Onboarding comercial</p>
              <p className="mt-2 text-xl font-bold">Registro de clinica + plan + acceso inmediato a la plataforma</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Que vende el producto</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Todo lo que una clinica necesita para operar mejor</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-[2rem]">
              <feature.icon className="h-10 w-10 text-teal-700" />
              <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Planes</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Pricing listo para salir a vender</h2>
          </div>
          <Link to="/signup">
            <Button variant="outline">Activar una clinica</Button>
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {data?.plans?.map((plan: any) => (
            <Card key={plan.id} className={`rounded-[2rem] ${plan.recommended ? "border-teal-300 bg-teal-50/70" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {plan.recommended ? <Badge className="bg-amber-100 text-amber-900">Mas elegido</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{plan.setupLabel}</p>
                </div>
                <WalletCards className="h-8 w-8 text-teal-700" />
              </div>
              <p className="mt-5 text-4xl font-extrabold">{currency(plan.monthlyPrice)}</p>
              <p className="mt-1 text-sm text-slate-500">mensual o {currency(plan.yearlyPrice)} anual</p>
              <p className="mt-4 text-sm text-slate-700">{plan.description}</p>
              <div className="mt-5 space-y-3">
                {plan.features.map((feature: string) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="mt-6 block">
                <Button className="w-full">{plan.recommended ? "Elegir este plan" : "Quiero este plan"}</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <Card className="rounded-[2rem] bg-slate-950 text-white">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-teal-300">Por que conviene</p>
              <h2 className="mt-3 text-3xl font-extrabold">Disenado para validacion comercial rapida</h2>
              <p className="mt-4 text-white/70">
                No es una demo linda sin sustancia. La plataforma esta pensada para mostrar valor real frente al dueno de clinica.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Multi-tenant desde la base",
                "Roles por perfil operativo",
                "Seguimientos y anti-ausencias",
                "Base lista para Bancard e IA",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white/5 p-5">
                  <BadgeCheck className="h-5 w-5 text-teal-300" />
                  <p className="mt-3 font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem]">
            <TrendingUp className="h-10 w-10 text-teal-700" />
            <h3 className="mt-5 text-2xl font-bold">Como se ve el embudo comercial</h3>
            <div className="mt-5 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-900">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="rounded-[2rem]">
            <ShieldCheck className="h-10 w-10 text-teal-700" />
            <h3 className="mt-5 text-2xl font-bold">Base tecnica lista para crecer</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold">Cobro hoy</p>
                <p className="mt-2 text-sm text-slate-600">Checkout simulado para validar oferta y cerrar las primeras clinicas.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold">Bancard ready</p>
                <p className="mt-2 text-sm text-slate-600">Estructura persistida para conectar credenciales y reemplazar el simulador.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold">IA ready</p>
                <p className="mt-2 text-sm text-slate-600">Arquitectura preparada para sugerencias, resumenes y automatizaciones futuras.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold">Operacion real</p>
                <p className="mt-2 text-sm text-slate-600">Pacientes, turnos, notas, tratamientos y pagos ya corriendo sobre el producto.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal-700">Preguntas frecuentes</p>
            <h2 className="mt-3 text-3xl font-extrabold">Lo que normalmente pregunta una clinica</h2>
          </div>
          <Link to="/signup">
            <Button variant="outline">Activar una demo comercial</Button>
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {faqs.map((faq) => (
            <Card key={faq.q} className="rounded-[2rem]">
              <ShieldCheck className="h-8 w-8 text-teal-700" />
              <h3 className="mt-4 text-xl font-bold">{faq.q}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
