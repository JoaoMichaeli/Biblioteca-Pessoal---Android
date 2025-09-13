import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "components/Buttons/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UnsafeStackParamList } from "navigation/types";

type NavigationProps = NativeStackNavigationProp<UnsafeStackParamList>;

export function HeroSection() {
  const { navigate } = useNavigation<NavigationProps>();

  function signWithEmail() {
    navigate("Login");
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://img.icons8.com/ios-filled/120/4B2E83/books.png" }}
        style={styles.image}
      />

      <Text style={styles.title}>Bem-vindo à sua Biblioteca</Text>

      <Text style={styles.subtitle}>
        Acesse sua coleção, descubra novos livros e gerencie sua leitura de forma fácil e rápida.
      </Text>

      <Button
        label="Entrar com Email"
        onPress={signWithEmail}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,               
    justifyContent: "center",
    alignItems: "center",    
    paddingHorizontal: 32,
    backgroundColor: "#F5F5F8",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#4B2E83",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6A5ACD",
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
