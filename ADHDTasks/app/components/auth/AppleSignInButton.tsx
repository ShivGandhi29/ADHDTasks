import React from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../../../supabaseClient";

export default function AppleSignInButton() {
  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Missing Apple identity token");
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });

      if (error) throw error;
      console.log("Signed in!", data.user);
    } catch (e) {
      console.log("Apple Sign-In error", e);
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={{ width: 200, height: 44 }}
      onPress={signInWithApple}
    />
  );
}
