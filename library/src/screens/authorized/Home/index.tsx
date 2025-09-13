import { useAuth } from "hooks/auth";
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

export default function Home({ navigation }: any) {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
    navigation.replace("Login");
  }, [logout, navigation]);

  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80" }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao App de Livros</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("BookList")}
        >
          <Text style={styles.buttonText}>Meus Livros</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("CreateBook")}
        >
          <Text style={styles.buttonText}>Adicionar Livro</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Perfil")} // <-- use o mesmo nome da aba
        >
          <Text style={styles.buttonText}>Meu Perfil</Text>
        </TouchableOpacity>


        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#4B2E83",
  },
  button: {
    backgroundColor: "#6A5ACD",
    padding: 16,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButton: { backgroundColor: "#FF6B6B" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
