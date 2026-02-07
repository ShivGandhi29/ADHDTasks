import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../components/ui/ThemeColors";
import AppleSignInButton from "../components/auth/AppleSignInButton";

export default function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text>Settings</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.White,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
