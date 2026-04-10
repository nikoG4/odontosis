import { Injectable } from "@nestjs/common";

export type BillingPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  setupLabel: string;
  description: string;
  features: string[];
  recommended?: boolean;
};

@Injectable()
export class BillingService {
  private readonly plans: BillingPlan[] = [
    {
      id: "START",
      name: "Start",
      monthlyPrice: 199000,
      yearlyPrice: 1980000,
      setupLabel: "Ideal para clinicas nuevas o consultorios de 1 a 2 sillones",
      description: "Todo lo esencial para comenzar a vender y ordenar la operacion diaria.",
      features: [
        "Hasta 5 usuarios",
        "Agenda, pacientes, atenciones y pagos",
        "Recordatorios preparados para WhatsApp",
        "Dashboard operativo",
      ],
    },
    {
      id: "GROWTH",
      name: "Growth",
      monthlyPrice: 349000,
      yearlyPrice: 3490000,
      setupLabel: "El mejor punto para clinicas que ya tienen volumen",
      description: "Mas usuarios, mas automatizacion y una presencia mas profesional para recepcion y direccion.",
      features: [
        "Hasta 15 usuarios",
        "Seguimientos automaticos y anti-ausencias",
        "Reportes de pendientes y cobranza",
        "Soporte prioritario",
      ],
      recommended: true,
    },
    {
      id: "SCALE",
      name: "Scale",
      monthlyPrice: 599000,
      yearlyPrice: 5990000,
      setupLabel: "Para clinicas consolidadas o multi-sede",
      description: "Preparado para crecer con integraciones, mas personal y control comercial.",
      features: [
        "Usuarios ilimitados",
        "Preparado para multi-sede",
        "IA y automatizaciones priorizadas",
        "Acompañamiento de onboarding",
      ],
    },
  ];

  getPlans() {
    return {
      currency: "PYG",
      provider: "SIMULATED",
      bancardReady: true,
      plans: this.plans,
    };
  }

  getPlan(planId: string) {
    return this.plans.find((plan) => plan.id === planId) ?? this.plans[1];
  }

  simulateCheckout(input: {
    planId: string;
    billingCycle: "MONTHLY" | "YEARLY";
    cardholderName: string;
    cardLast4: string;
  }) {
    const plan = this.getPlan(input.planId);
    const amount = input.billingCycle === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice;

    return {
      provider: "SIMULATED",
      status: "APPROVED",
      amount,
      currency: "PYG",
      planId: plan.id,
      billingCycle: input.billingCycle,
      transactionId: `SIM-${Date.now()}`,
      cardLast4: input.cardLast4,
      cardholderName: input.cardholderName,
      bancard: {
        ready: true,
        environment: "sandbox",
        note: "Preparado para reemplazar el simulador por integracion real Bancard.",
      },
    };
  }
}
