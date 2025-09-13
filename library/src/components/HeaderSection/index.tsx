import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import LogoOnlyIcon from "@assets/logo-only.svg";
import ChevronLeftIcon from "@assets/chevron-left.svg";

export function HeaderSection() {
  const { goBack } = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 999
        }}
        onPress={goBack}
      >
        <ChevronLeftIcon />
      </TouchableOpacity>
    </View>
  );
}