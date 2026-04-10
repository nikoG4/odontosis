import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  Eyebrow, 
  Field, 
  PrimaryButton, 
  Screen, 
  Title, 
  Body,
  SecondaryButton 
} from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";
import { colors, radius } from "../../src/theme";

const schema = z.object({
  clinicName: z.string().min(2, "Requerido"),
  email: z.string().email("Email inválido"),
  adminFirstName: z.string().min(2, "Requerido"),
  adminLastName: z.string().min(2, "Requerido"),
  adminPassword: z.string().min(8, "Mínimo 8 caracteres"),
  planId: z.enum(["START", "GROWTH", "SCALE"]),
});

export default function SignupScreen() {
  const api = useApi();
  const [selectedPlan, setSelectedPlan] = useState<"START" | "GROWTH" | "SCALE">("GROWTH");

  const { data: plansData } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get<any>("/auth/plans"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      clinicName: "",
      email: "",
      adminFirstName: "",
      adminLastName: "",
      adminPassword: "",
      planId: "GROWTH",
    },
  });

  const handleSignup = async (values: z.infer<typeof schema>) => {
    try {
      // Logic for registration
      await api.post("/auth/register", values);
      router.replace("/(public)/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Screen>
      <View style={{ marginBottom: 12 }}>
        <Eyebrow>Alta de clínica</Eyebrow>
        <Title>Crea tu cuenta</Title>
        <Body>Únete a la plataforma líder para odontólogos.</Body>
      </View>

      <Card>
        <Eyebrow>Datos de la clínica</Eyebrow>
        <View style={{ gap: 12, marginTop: 8 }}>
          <Field 
            placeholder="Nombre de la clínica" 
            value={form.watch("clinicName")} 
            onChangeText={v => form.setValue("clinicName", v)} 
          />
          <Field 
            placeholder="Email comercial" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.watch("email")} 
            onChangeText={v => form.setValue("email", v)} 
          />
        </View>
      </Card>

      <Card>
        <Eyebrow>Administrador</Eyebrow>
        <View style={{ gap: 12, marginTop: 8 }}>
          <Field 
            placeholder="Nombre" 
            value={form.watch("adminFirstName")} 
            onChangeText={v => form.setValue("adminFirstName", v)} 
          />
          <Field 
            placeholder="Apellido" 
            value={form.watch("adminLastName")} 
            onChangeText={v => form.setValue("adminLastName", v)} 
          />
          <Field 
            placeholder="Contraseña" 
            secureTextEntry
            value={form.watch("adminPassword")} 
            onChangeText={v => form.setValue("adminPassword", v)} 
          />
        </View>
      </Card>

      <Eyebrow>Selecciona un plan</Eyebrow>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {plansData?.plans?.map((plan: any) => (
          <Pressable 
            key={plan.id}
            onPress={() => {
              setSelectedPlan(plan.id);
              form.setValue("planId", plan.id);
            }}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardActive
            ]}
          >
            <Text style={[styles.planName, selectedPlan === plan.id && { color: "#fff" }]}>{plan.name}</Text>
            <Text style={[styles.planPrice, selectedPlan === plan.id && { color: "#fff" }]}>${plan.monthlyPrice}/mes</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ gap: 12, marginTop: 12 }}>
        <PrimaryButton 
          label="Comenzar ahora" 
          onPress={form.handleSubmit(handleSignup)} 
        />
        <SecondaryButton 
          label="Ya tengo cuenta" 
          onPress={() => router.push("/(public)/login")} 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    width: 200,
    borderWidth: 1,
    borderColor: colors.line,
  },
  planCardActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.teal,
    marginTop: 4,
  }
});
