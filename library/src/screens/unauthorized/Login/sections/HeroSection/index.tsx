import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

export function HeroSection() {
  return (
    <View style={styles.container}>
      {/* Ícone de livros */}
      <Image
        source={{ uri: "https://img.icons8.com/ios-filled/120/4B2E83/books.png" }}
        style={styles.image}
      />

      {/* Título */}
      <Text style={styles.title}>Bem-vindo de volta</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Insira seu e-mail e senha para acessar sua conta e continuar explorando sua biblioteca.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 40,
    backgroundColor: "#F5F5F8",
    paddingVertical: 24,
    borderRadius: 16,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4B2E83",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6A5ACD",
    textAlign: "center",
    lineHeight: 22,
  },
});
