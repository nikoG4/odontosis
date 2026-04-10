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
  professionalId: z.string().min(1),
  startAt: z.string().min(1),
  durationMinutes: z.coerce.number().min(15),
  reason: z.string().min(2),
});

export default function NewAppointmentScreen() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { data: patients } = useQuery({ queryKey: ["patients"], queryFn: () => api.get<any[]>("/patients") });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => api.get<any[]>("/users") });
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { patientId: "", professionalId: "", startAt: "2026-04-10T15:00", durationMinutes: 30, reason: "" },
  });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => api.post("/appointments", { ...values, startAt: new Date(values.startAt).toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.back();
    },
  });

  return (
    <Screen>
      <View>
        <Eyebrow>Agenda</Eyebrow>
        <Title>Nuevo turno</Title>
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
                label="Profesional"
                value={field.value}
                onValueChange={field.onChange}
                options={users?.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u.id })) || []}
              />
            )}
          />

          <Field 
            placeholder="Fecha y hora (YYYY-MM-DDTHH:MM)" 
            value={form.watch("startAt")} 
            onChangeText={(value) => form.setValue("startAt", value)} 
          />
          
          <Field
            placeholder="Duración (minutos)"
            keyboardType="numeric"
            value={String(form.watch("durationMinutes"))}
            onChangeText={(value) => form.setValue("durationMinutes", Number(value || 0))}
          />
          
          <Field 
            placeholder="Motivo de la consulta" 
            value={form.watch("reason")} 
            onChangeText={(value) => form.setValue("reason", value)} 
          />
          
          <PrimaryButton 
            label="Guardar turno" 
            onPress={form.handleSubmit((values) => createMutation.mutate(values))} 
            loading={createMutation.isPending}
          />
        </View>
      </Card>
    </Screen>
  );
}
