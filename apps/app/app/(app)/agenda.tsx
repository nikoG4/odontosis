import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Card, Eyebrow, PrimaryButton, Screen, Title, Body } from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";
import { colors } from "../../src/theme";

export default function AgendaScreen() {
  const api = useApi();
  const { data, isLoading } = useQuery({ 
    queryKey: ["appointments"], 
    queryFn: () => api.get<any[]>("/appointments") 
  });

  if (isLoading) return <Screen><Title>Cargando...</Title></Screen>;

  return (
    <Screen>
      <View>
        <Eyebrow>Agenda del día</Eyebrow>
        <Title>Turnos</Title>
      </View>
      
      <PrimaryButton label="Nuevo turno" onPress={() => router.push("/agenda/new")} />
      
      <View style={{ gap: 12 }}>
        {(data ?? []).length === 0 && <Body>No hay turnos programados</Body>}
        {(data ?? []).map((item) => (
          <Card key={item.id}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.timeText}>
                {new Date(item.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={styles.statusPill} />
            </View>
            <Text style={styles.patientName}>
              {item.patient?.firstName} {item.patient?.lastName}
            </Text>
            <Text style={styles.reasonText}>{item.reason}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.teal,
  },
  statusPill: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  reasonText: {
    fontSize: 14,
    color: colors.slate,
    marginTop: 2,
  },
});
