import React from "react";
import { View, Text } from "react-native";
import AppleSignInButton from "./components/auth/AppleSignInButton";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Pebbl</Text>
      <AppleSignInButton />
    </View>
  );
}
