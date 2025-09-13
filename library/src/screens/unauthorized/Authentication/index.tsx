import React, { View } from "react-native";
import Logo from "@assets/logo.svg";
import { authenticationStyle } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonSSection } from "./sections/ButtonsSection";
import { HeroSection } from "./sections/HeroSection";

export default function Authentication() {

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={authenticationStyle.container}>
        {/* <Logo /> */}
        <HeroSection />
        <ButtonSSection />
      </View>
    </SafeAreaView>
  )
}