import React from "react";
import { Button } from "components/Buttons/Button";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

export function ButtonSSection() {
  const { navigate } = useNavigation();

  async function signWithEmail() {
    navigate("Login")
  }

  return (
    <View>
      {/* <Button
        label="Sign in with Email"
        onPress={signWithEmail}
      /> */}

      {/* <View
        style={styles?.dividerContainer}
      >
      </View> */}
    </View>
  )
}