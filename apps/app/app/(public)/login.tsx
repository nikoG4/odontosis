import { Platform, View, Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
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
import { useAuth } from "../../src/state/auth";
import { colors } from "../../src/theme";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña muy corta"),
});

export default function LoginScreen() {
  const { login } = useAuth();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@odontosis.com", password: "admin123" },
  });

  const handleLogin = async (values: z.infer<typeof schema>) => {
    try {
      await login(values.email, values.password);
      router.replace("/(app)/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  const openOrDownloadApp = () => {
    if (Platform.OS !== "web") return;
    
    // Attempt deep link
    window.location.href = "odontosis://";
    
    // Timeout for download if app not installed
    setTimeout(() => {
      if (document.hasFocus()) {
        // We'll put the APK in apps/app/dist/assets/app.apk
        window.location.href = "/assets/app.apk";
      }
    }, 2000);
  };

  return (
    <Screen>
      <View style={{ marginBottom: 12 }}>
        <Eyebrow>Acceso plataforma</Eyebrow>
        <Title>OdontoSis</Title>
        <Body>Gestiona tu clínica con la mejor experiencia.</Body>
      </View>

      <Card>
        <View style={{ gap: 12 }}>
          <Field 
            placeholder="Email" 
            keyboardType="email-address" 
            autoCapitalize="none"
            value={form.watch("email")} 
            onChangeText={(value) => form.setValue("email", value)} 
          />
          <Field 
            placeholder="Contraseña" 
            secureTextEntry 
            value={form.watch("password")} 
            onChangeText={(value) => form.setValue("password", value)} 
          />
          <PrimaryButton label="Entrar" onPress={form.handleSubmit(handleLogin)} />
          <SecondaryButton label="Crear cuenta" onPress={() => router.push("/(public)/signup")} />
        </View>
      </Card>

      {Platform.OS === "web" && (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: colors.slate, fontSize: 14, marginBottom: 8 }}>
            ¿Prefieres usar la app móvil?
          </Text>
          <SecondaryButton label="📱 Abrir o Descargar App" onPress={openOrDownloadApp} />
        </View>
      )}
    </Screen>
  );
}
