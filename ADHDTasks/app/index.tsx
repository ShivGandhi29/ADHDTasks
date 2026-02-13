import { useEffect, useState } from "react";
import { View } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";

const USER_NAME_KEY = "@adhdtasks/user_name";

export default function Index() {
  const { colors } = useTheme();
  const [signupDone, setSignupDone] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const name = await AsyncStorage.getItem(USER_NAME_KEY);
        setSignupDone(name != null && name.trim().length > 0);
      } catch {
        setSignupDone(false);
      }
    })();
  }, []);

  if (signupDone === null) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return signupDone ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/signup" />
  );
}
