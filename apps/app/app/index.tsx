import { Redirect } from "expo-router";
import { useAuth } from "../src/state/auth";

export default function Index() {
  const { session, isReady } = useAuth();
  if (!isReady) return null;
  return <Redirect href={session ? "/(app)/dashboard" : "/(public)/login"} />;
}
