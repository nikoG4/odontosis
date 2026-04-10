import { useQuery } from "@tanstack/react-query";
import { Card, Eyebrow, Screen, Title, Body } from "../../src/components/ui";
import { useApi } from "../../src/hooks/use-api";

export default function SettingsScreen() {
  const api = useApi();
  const { data } = useQuery({ queryKey: ["clinic"], queryFn: () => api.get<any>("/clinic/me") });

  return (
    <Screen>
      <Eyebrow>SaaS ready</Eyebrow>
      <Title>Configuracion</Title>
      <Card>
        <Body>Clinica: {data?.name ?? "-"}</Body>
        <Body>Plan: {data?.subscriptionPlan ?? "-"}</Body>
        <Body>Estado: {data?.subscriptionStatus ?? "-"}</Body>
      </Card>
    </Screen>
  );
}
