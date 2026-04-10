import { View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Card, Eyebrow, Field, PrimaryButton, Screen, Title, Select } from "../../../src/components/ui";
import { useApi } from "../../../src/hooks/use-api";

const schema = z.object({
  patientId: z.string().min(1, "Requerido"),
  treatmentId: z.string().optional(),
  amount: z.string().min(1, "Requerido"),
  method: z.enum(["CASH", "CARD", "TRANSFER", "OTHER"]),
});

export default function NewPaymentScreen() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get<any[]>("/patients") });
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { patientId: "", treatmentId: "", amount: "", method: "CASH" },
  });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) =>
      api.post("/payments", { 
        ...values, 
        amount: Number(values.amount),
        treatmentId: values.treatmentId || null,
        paidAt: new Date().toISOString() 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      router.back();
    },
  });

  return (
    <Screen>
      <View>
        <Eyebrow>Tesorería</Eyebrow>
        <Title>Nuevo cobro</Title>
      </View>
      
      <Card>
        <View style={{ gap: 12 }}>
          <Controller
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <Select
                label="Paciente"
                value={field.value}
                onValueChange={field.onChange}
                options={patients?.map(p => ({ label: `${p.firstName} ${p.lastName}`, value: p.id })) || []}
              />
            )}
          />

          <Field 
            placeholder="Monto" 
            keyboardType="decimal-pad" 
            value={form.watch("amount")} 
            onChangeText={(value) => form.setValue("amount", value)} 
          />

          <Controller
            control={form.control}
            name="method"
            render={({ field }) => (
              <Select
                label="Método de pago"
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { label: "Efectivo", value: "CASH" },
                  { label: "Tarjeta", value: "CARD" },
                  { label: "Transferencia", value: "TRANSFER" },
                  { label: "Otro", value: "OTHER" },
                ]}
              />
            )}
          />
          
          <PrimaryButton 
            label="Registrar pago" 
            onPress={form.handleSubmit((values) => createMutation.mutate(values))} 
            loading={createMutation.isPending}
          />
        </View>
      </Card>
    </Screen>
  );
}
