import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  Eyebrow, 
  Field, 
  PrimaryButton, 
  Screen, 
  Title, 
  Textarea, 
  Select, 
  Body,
  Pill
} from "../../../src/components/ui";
import { useApi } from "../../../src/hooks/use-api";
import { colors, radius } from "../../../src/theme";

const noteSchema = z.object({
  professionalId: z.string().min(1, "Requerido"),
  reason: z.string().min(2, "Requerido"),
  diagnosis: z.string().optional(),
  procedure: z.string().optional(),
  indications: z.string().optional(),
  observations: z.string().optional(),
});

const paymentSchema = z.object({
  amount: z.string().min(1, "Requerido"),
  method: z.enum(["CASH", "CARD", "TRANSFER", "OTHER"]),
});

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => api.get<any>(`/patients/${id}`),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<any[]>("/users"),
  });

  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { professionalId: "", reason: "" },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: "", method: "CASH" },
  });

  const noteMutation = useMutation({
    mutationFn: (values: z.infer<typeof noteSchema>) =>
      api.post("/clinical-notes", { ...values, patientId: id, date: new Date().toISOString() }),
    onSuccess: () => {
      noteForm.reset();
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (values: z.infer<typeof paymentSchema>) =>
      api.post("/payments", {
        patientId: id,
        amount: Number(values.amount),
        method: values.method,
        paidAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      paymentForm.reset();
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
  });

  if (isLoading) return <Screen><Title>Cargando...</Title></Screen>;

  return (
    <Screen>
      <View>
        <Eyebrow>Ficha del paciente</Eyebrow>
        <Title>{patient?.firstName} {patient?.lastName}</Title>
        <Body>{patient?.document || "Sin documento"} · {patient?.phone || "Sin teléfono"}</Body>
      </View>

      <Card>
        <Eyebrow>Registrar Atención</Eyebrow>
        <View style={{ gap: 12, marginTop: 8 }}>
          <Controller
            control={noteForm.control}
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
          <Field placeholder="Motivo" value={noteForm.watch("reason")} onChangeText={val => noteForm.setValue("reason", val)} />
          <Textarea placeholder="Diagnóstico / Procedimiento" value={noteForm.watch("diagnosis")} onChangeText={val => noteForm.setValue("diagnosis", val)} />
          <PrimaryButton 
            label="Guardar atención" 
            onPress={noteForm.handleSubmit(v => noteMutation.mutate(v))} 
            loading={noteMutation.isPending}
          />
        </View>
      </Card>

      <Card>
        <Eyebrow>Registrar Pago</Eyebrow>
        <View style={{ gap: 12, marginTop: 8 }}>
          <Field 
            placeholder="Monto" 
            keyboardType="decimal-pad" 
            value={paymentForm.watch("amount")} 
            onChangeText={val => paymentForm.setValue("amount", val)} 
          />
          <Controller
            control={paymentForm.control}
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
            label="Guardar pago" 
            onPress={paymentForm.handleSubmit(v => paymentMutation.mutate(v))} 
            loading={paymentMutation.isPending}
          />
        </View>
      </Card>

      <Eyebrow>Historial Reciente</Eyebrow>
      
      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Notas Clínicas</Text>
        {patient?.clinicalNotes?.length === 0 && <Body>Sin notas aún</Body>}
        {patient?.clinicalNotes?.map((note: any) => (
          <Card key={note.id}>
            <Text style={styles.itemTitle}>{note.reason}</Text>
            <Text style={styles.itemSubtitle}>{new Date(note.date).toLocaleDateString()}</Text>
            {note.diagnosis && <Text style={styles.itemBody}>{note.diagnosis}</Text>}
          </Card>
        ))}
      </View>

      <View style={{ gap: 12, marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Pagos</Text>
        {patient?.payments?.length === 0 && <Body>Sin pagos aún</Body>}
        {patient?.payments?.map((payment: any) => (
          <View key={payment.id} style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>${payment.amount}</Text>
              <Text style={styles.itemSubtitle}>{new Date(payment.paidAt).toLocaleDateString()}</Text>
            </View>
            <Pill label={payment.method} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 14,
    color: colors.slate,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  }
});
