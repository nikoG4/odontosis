import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card, Eyebrow, PrimaryButton, Screen, Title } from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";
import { colors } from "../../src/theme";

export default function PatientsScreen() {
  const api = useApi();
  const { data, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.get<any[]>("/patients"),
  });

  if (isLoading) return <Screen><Title>Cargando...</Title></Screen>;

  return (
    <Screen>
      <View>
        <Eyebrow>Base clínica</Eyebrow>
        <Title>Pacientes</Title>
      </View>
      
      <PrimaryButton label="Nuevo paciente" onPress={() => router.push("/patients/new")} />
      
      <Card>
        {(data ?? []).length === 0 && <Body>No hay pacientes registrados</Body>}
        {(data ?? []).map((patient) => (
          <Pressable 
            key={patient.id} 
            onPress={() => router.push(`/patients/${patient.id}`)}
            style={({ pressed }) => [
              styles.patientItem,
              pressed && { backgroundColor: colors.surfaceAlt }
            ]}
          >
            <View>
              <Text style={styles.patientName}>
                {patient.firstName} {patient.lastName}
              </Text>
              <Text style={styles.patientDoc}>{patient.document || "Sin documento"}</Text>
            </View>
            <View style={styles.arrow} />
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  patientItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  patientDoc: {
    fontSize: 14,
    color: colors.slate,
    marginTop: 2,
  },
  arrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.line,
    transform: [{ rotate: "45deg" }],
  }
});
