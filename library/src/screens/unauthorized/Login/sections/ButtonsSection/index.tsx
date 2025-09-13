import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UnsafeStackParamList } from "navigation/types";

import { styles } from "./styles";

type AuthStackProp = NavigationProp<UnsafeStackParamList, "Login">;

export function ButtonSSection() {
  const navigation = useNavigation<AuthStackProp>();

  return (
    <View style={{ gap: 10 }}>
      {/* Divisor */}
      <View style={styles?.dividerContainer}>
        <View style={[styles.divider]} />
        <View />
      </View>
    </View>
  );
}
