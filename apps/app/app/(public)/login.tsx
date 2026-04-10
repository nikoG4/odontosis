import { useEffect, useMemo } from "react";
import { Linking, Platform, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  Card,
  Eyebrow,
  Field,
  PrimaryButton,
  Screen,
  Title,
  Body,
  SecondaryButton,
} from "../../src/components/ui";
import { useAuth } from "../../src/state/auth";
import { colors } from "../../src/theme";

WebBrowser.maybeCompleteAuthSession();

const schema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Contrasena muy corta"),
});

const googleWebClientId =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "673073717912-6su2u0ofd04gial1gb321cdd9kbsk3fq.apps.googleusercontent.com";
const googleAndroidClientId =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "673073717912-npnceq06jot11a29pt1d1numk68vt9li.apps.googleusercontent.com";
const publicWebUrl = process.env.EXPO_PUBLIC_WEB_URL || "http://204.216.157.94/";

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@demo.com", password: "Admin123!" },
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: googleAndroidClientId,
    webClientId: googleWebClientId,
  });

  const isNative = Platform.OS === "android" || Platform.OS === "ios";

  useEffect(() => {
    if (!isNative) return;
    GoogleSignin.configure({
      webClientId: googleWebClientId,
      offlineAccess: false,
      profileImageSize: 120,
    });
  }, [isNative]);

  useEffect(() => {
    if (isNative) return;
    if (response?.type === "success") {
      const idToken = response.params.id_token;
      if (!idToken) return;
      loginWithGoogle(idToken)
        .then(() => {
          router.replace("/(app)/dashboard");
        })
        .catch((error) => {
          console.error("Google Login Error", error);
        });
    }
  }, [isNative, loginWithGoogle, response]);

  const handleLogin = async (values: z.infer<typeof schema>) => {
    try {
      await login(values.email, values.password);
      router.replace("/(app)/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    if (isNative) {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const result = await GoogleSignin.signIn();
        if (isCancelledResponse(result)) return;
        if (!isSuccessResponse(result)) return;

        const idToken = result.data.idToken ?? (await GoogleSignin.getTokens()).idToken;
        if (!idToken) {
          throw new Error("Google no devolvio un token valido para esta app.");
        }

        await loginWithGoogle(idToken);
        router.replace("/(app)/dashboard");
        return;
      } catch (error) {
        if (isErrorWithCode(error)) {
          if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.error("Google Play Services no disponible");
            return;
          }
          if (error.code === statusCodes.IN_PROGRESS) {
            return;
          }
        }
        console.error("Google native login error", error);
        throw error;
      }
    }

    await promptAsync();
  };

  const googleButtonDisabled = useMemo(() => {
    if (isNative) return false;
    return !request;
  }, [isNative, request]);

  const openAppOrDownload = async () => {
    if (Platform.OS !== "web") return;
    const appUrl = "odontosis://";
    window.location.href = appUrl;
    setTimeout(() => {
      if (document.hasFocus()) {
        window.location.href = "/assets/app-debug.apk";
      }
    }, 1800);
  };

  return (
    <Screen>
      <View style={{ marginBottom: 12 }}>
        <Eyebrow>Acceso plataforma</Eyebrow>
        <Title>OdontoSis</Title>
        <Body>Gestiona tu clinica con la misma experiencia en web y movil.</Body>
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
            placeholder="Contrasena"
            secureTextEntry
            value={form.watch("password")}
            onChangeText={(value) => form.setValue("password", value)}
          />
          <PrimaryButton label="Entrar" onPress={form.handleSubmit(handleLogin)} />

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 4 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
            <Text style={{ color: colors.muted, fontSize: 12 }}>O</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          </View>

          <SecondaryButton label="Continuar con Google" onPress={handleGoogleLogin} disabled={googleButtonDisabled} />
          <SecondaryButton
            label="Crear cuenta"
            onPress={() => {
              if (Platform.OS === "web") {
                window.location.href = `${publicWebUrl}signup`;
                return;
              }
              Linking.openURL(`${publicWebUrl}signup`).catch(() => undefined);
            }}
          />
        </View>
      </Card>

      {Platform.OS === "web" ? (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: colors.slate, fontSize: 14, marginBottom: 8 }}>Prefieres usar la app movil?</Text>
          <SecondaryButton label="Abrir o descargar APK" onPress={openAppOrDownload} />
        </View>
      ) : null}
    </Screen>
  );
}
