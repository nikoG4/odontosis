import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Card, Eyebrow, PrimaryButton, Screen, Title, Body, Pill } from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";
import { colors } from "../../src/theme";

export default function PaymentsScreen() {
  const api = useApi();
  const { data, isLoading } = useQuery({ 
    queryKey: ["payments"], 
    queryFn: () => api.get<any[]>("/payments") 
  });

  if (isLoading) return <Screen><Title>Cargando...</Title></Screen>;

  return (
    <Screen>
      <View>
        <Eyebrow>Tesorería</Eyebrow>
        <Title>Pagos</Title>
      </View>
      
      <PrimaryButton label="Registrar cobro" onPress={() => router.push("/payments/new")} />
      
      <View style={{ gap: 12 }}>
        {(data ?? []).length === 0 && <Body>No hay pagos registrados</Body>}
        {(data ?? []).map((item) => (
          <Card key={item.id}>
            <View style={styles.header}>
              <Text style={styles.amountText}>${item.amount}</Text>
              <Pill label={item.method} />
            </View>
            <Text style={styles.patientName}>
              {item.patient?.firstName} {item.patient?.lastName}
            </Text>
            <Text style={styles.dateText}>
              {new Date(item.paidAt).toLocaleDateString()}
            </Text>
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
  amountText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.teal,
  },
  dateText: {
    fontSize: 14,
    color: colors.slate,
    marginTop: 2,
  },
});
