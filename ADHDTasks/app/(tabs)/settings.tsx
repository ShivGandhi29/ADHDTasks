import { Text, View } from "react-native";
import AppleSignInButton from "../components/auth/AppleSignInButton";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Settings</Text>
    </View>
  );
}
