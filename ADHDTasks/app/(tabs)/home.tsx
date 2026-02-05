import { Text, View } from "react-native";
import AppleSignInButton from "../components/auth/AppleSignInButton";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home</Text>
    </View>
  );
}
