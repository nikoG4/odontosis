import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, Eyebrow, Screen, Title, Body } from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";
import { colors } from "../../src/theme";

export default function DashboardScreen() {
  const api = useApi();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<any>("/dashboard"),
  });

  if (isLoading) return <Screen><Title>Cargando...</Title></Screen>;

  return (
    <Screen>
      <View>
        <Eyebrow>Resumen operativo</Eyebrow>
        <Title>Dashboard</Title>
      </View>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Turnos Hoy</Text>
          <Text style={styles.statValue}>{data?.todayAppointments ?? 0}</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Tratamientos</Text>
          <Text style={styles.statValue}>{data?.activeTreatments ?? 0}</Text>
        </View>
      </View>

      <Card>
        <Eyebrow>Acciones rápidas</Eyebrow>
        <View style={{ gap: 8, marginTop: 8 }}>
          <Body>• Tienes {data?.pendingPayments?.length ?? 0} pagos pendientes de revisión.</Body>
          <Body>• Los próximos turnos comienzan a las 15:00.</Body>
        </View>
      </Card>

      <Card>
        <Eyebrow>Estado de la clínica</Eyebrow>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: "70%" }]} />
        </View>
        <Body>Ocupación semanal: 70%</Body>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 28, // xxl
    borderWidth: 1,
    borderColor: colors.line,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.teal,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.teal,
  }
});
