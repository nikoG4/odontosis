import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../src/theme";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="patients"
        options={{ title: "Pacientes", tabBarIcon: ({ color, size }) => <MaterialIcons name="people" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="agenda"
        options={{ title: "Agenda", tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-today" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="treatments"
        options={{ title: "Trat.", tabBarIcon: ({ color, size }) => <MaterialIcons name="medical-services" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="payments"
        options={{ title: "Pagos", tabBarIcon: ({ color, size }) => <MaterialIcons name="credit-card" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Config", tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
