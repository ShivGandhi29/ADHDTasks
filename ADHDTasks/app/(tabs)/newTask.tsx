import { Text, View } from "react-native";
import AppleSignInButton from "../components/auth/AppleSignInButton";

export default function NewTask() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>New Task</Text>
    </View>
  );
}
