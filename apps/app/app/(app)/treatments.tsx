import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Card, Eyebrow, PrimaryButton, Screen, Title, Body, Pill } from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";
import { colors } from "../../src/theme";

export default function TreatmentsScreen() {
  const api = useApi();
  const { data, isLoading } = useQuery({ 
    queryKey: ["treatments"], 
    queryFn: () => api.get<any[]>("/treatments") 
  });

  if (isLoading) return <Screen><Title>Cargando...</Title></Screen>;

  return (
    <Screen>
      <View>
        <Eyebrow>Servicios médicos</Eyebrow>
        <Title>Tratamientos</Title>
      </View>

      <PrimaryButton label="Nuevo tratamiento" onPress={() => router.push("/treatments/new")} />

      <View style={{ gap: 12 }}>
        {(data ?? []).length === 0 && <Body>No hay tratamientos activos</Body>}
        {(data ?? []).map((item) => (
          <Card key={item.id}>
            <View style={styles.header}>
              <Text style={styles.typeText}>{item.type}</Text>
              <Pill label={`$${item.estimatedCost}`} />
            </View>
            <Text style={styles.patientName}>
              {item.patient?.firstName} {item.patient?.lastName}
            </Text>
            <Text style={styles.descText}>{item.description}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  typeText: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.teal,
  },
  descText: {
    fontSize: 14,
    color: colors.slate,
    marginTop: 2,
  },
});

