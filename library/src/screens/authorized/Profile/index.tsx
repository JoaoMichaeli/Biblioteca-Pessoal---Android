import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "hooks/auth";
import firestore from "@react-native-firebase/firestore";

export default function Profile({ navigation }: any) {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({ total: 0, lidos: 0, lendo: 0, favoritos: 0 });

  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribeUser = firestore()
      .collection("users")
      .doc(user.id)
      .onSnapshot(doc => {
        if (doc.exists()) {
          setUserName(doc.data()?.name || user.displayName || "Usuário");
        }
      });

    return () => unsubscribeUser();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribeStats = firestore()
      .collection("users")
      .doc(user.id)
      .collection("books")
      .onSnapshot(snapshot => {
        const total = snapshot.size;
        const lidos = snapshot.docs.filter(doc => doc.data().status === "Lido").length;
        const lendo = snapshot.docs.filter(doc => doc.data().status === "Lendo").length;
        const favoritos = snapshot.docs.filter(doc => doc.data().favorite).length;
        setStats({ total, lidos, lendo, favoritos });
        setLoading(false);
      });

    return () => unsubscribeStats();
  }, [user?.id]);


  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => logout() },
    ]);
  };

  const getInitials = () => {
    const name = userName || "Usuário";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{user?.email || "sem email"}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{userName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || "sem email"}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.statsTitle}>📊 Estatísticas de Leitura</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#6A5ACD" />
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total de livros:</Text>
              <Text style={styles.value}>{stats.total}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Livros lidos:</Text>
              <Text style={styles.value}>{stats.lidos}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Lendo:</Text>
              <Text style={styles.value}>{stats.lendo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Favoritos:</Text>
              <Text style={styles.value}>{stats.favoritos}</Text>
            </View>
          </>
        )}
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3", padding: 16 },
  header: { marginBottom: 22, alignItems: "center" },
  avatar: {
    width: 99,
    height: 99,
    borderRadius: 49.5,
    backgroundColor: "#6A5ACD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 11,
  },
  avatarText: { color: "#fff", fontSize: 34, fontWeight: "bold" },
  name: { fontSize: 23, fontWeight: "bold", color: "#4B2E83", marginBottom: 5 },
  email: { fontSize: 14, color: "#666", marginBottom: 14 },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.9 },
    shadowOpacity: 0.09,
    shadowRadius: 1.8,
    elevation: 1.8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: { fontSize: 14.5, fontWeight: "600", color: "#333" },
  value: { fontSize: 14.5, color: "#666" },
  statsTitle: { fontSize: 16.2, fontWeight: "700", color: "#4B2E83", marginBottom: 9 },
  buttonContainer: { gap: 14, marginTop: 14 },
  button: {
    padding: 14,
    borderRadius: 12.6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.9 },
    shadowOpacity: 0.09,
    shadowRadius: 1.8,
    elevation: 1.8,
  },
  editButton: { backgroundColor: "#6A5ACD" },
  logoutButton: { backgroundColor: "#FF6B6B" },
  buttonText: { color: "#fff", fontSize: 14.5, fontWeight: "bold" },
});
