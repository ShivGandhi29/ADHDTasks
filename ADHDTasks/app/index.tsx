import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = true; //change this to false once we have authentication

  return isAuthenticated ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
