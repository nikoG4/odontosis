import { View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Card, Eyebrow, Field, PrimaryButton, Screen, Title } from "../../../src/components/ui";
import { useApi } from "../../../src/hooks/use-api";

const schema = z.object({
  patientId: z.string().min(1),
  professionalId: z.string().optional(),
  type: z.string().min(2),
  description: z.string().min(2),
  estimatedCost: z.coerce.number().nonnegative(),
});

export default function NewTreatmentScreen() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get<any[]>("/patients") });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.get<any[]>("/users") });
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { patientId: "", professionalId: "", type: "", description: "", estimatedCost: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) =>
      api.post("/treatments", { 
        ...values, 
        status: "PLANNED", 
        finalCost: 0, 
        professionalId: values.professionalId || null 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
      router.back();
    },
  });

  return (
    <Screen>
      <View>
        <Eyebrow>Alta</Eyebrow>
        <Title>Nuevo tratamiento</Title>
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

          <Controller
            control={form.control}
            name="professionalId"
            render={({ field }) => (
              <Select
                label="Profesional (Opcional)"
                value={field.value || ""}
                onValueChange={field.onChange}
                options={users?.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u.id })) || []}
              />
            )}
          />

          <Field placeholder="Tipo de tratamiento (ej. Ortodoncia)" value={form.watch("type")} onChangeText={(value) => form.setValue("type", value)} />
          <Field placeholder="Descripción" value={form.watch("description")} onChangeText={(value) => form.setValue("description", value)} />
          <Field
            placeholder="Costo estimado"
            keyboardType="numeric"
            value={form.watch("estimatedCost") ? String(form.watch("estimatedCost")) : ""}
            onChangeText={(value) => form.setValue("estimatedCost", Number(value || 0))}
          />
          <PrimaryButton 
            label="Guardar tratamiento" 
            onPress={form.handleSubmit((values) => createMutation.mutate(values))} 
            loading={createMutation.isPending}
          />
        </View>
      </Card>
    </Screen>
  );
}
