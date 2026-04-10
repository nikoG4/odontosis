import { View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Card, Eyebrow, Field, PrimaryButton, Screen, Title } from "../../../src/components/ui";
import { useApi } from "../../../src/hooks/use-api";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  document: z.string().optional(),
  phone: z.string().optional(),
});

export default function NewPatientScreen() {
  const api = useApi();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", document: "", phone: "" },
  });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => api.post("/patients", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.back();
    },
  });

  return (
    <Screen>
      <Eyebrow>Alta</Eyebrow>
      <Title>Nuevo paciente</Title>
      <Card>
        <View style={{ gap: 12 }}>
          <Field placeholder="Nombre" value={form.watch("firstName")} onChangeText={(value) => form.setValue("firstName", value)} />
          <Field placeholder="Apellido" value={form.watch("lastName")} onChangeText={(value) => form.setValue("lastName", value)} />
          <Field placeholder="Documento" value={form.watch("document")} onChangeText={(value) => form.setValue("document", value)} />
          <Field placeholder="Telefono" value={form.watch("phone")} onChangeText={(value) => form.setValue("phone", value)} />
          <PrimaryButton label="Guardar paciente" onPress={form.handleSubmit((values) => createMutation.mutate(values))} />
        </View>
      </Card>
    </Screen>
  );
}
