import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "hooks/auth";
import { useNavigation } from "@react-navigation/native";

interface Book {
  id: string;
  titulo: string;
  autor: string;
  ano: number;
  genero: string;
  favorite?: boolean;
  status?: string;
}

export default function BookDetails({ route }: any) {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { book } = route.params as { book: Book };

  const [isFavorite, setIsFavorite] = useState(book.favorite || false);
  const [status, setStatus] = useState(book.status || "Quero ler");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .doc(user?.id)
      .collection("books")
      .doc(book.id)
      .onSnapshot(doc => {
        if (doc.exists()) {
          setIsFavorite(doc.data()?.favorite || false);
          setStatus(doc.data()?.status || "Quero ler");
        }
      });

    return () => unsubscribe();
  }, [book.id, user?.id]);

  const toggleFavorite = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await firestore()
        .collection("users")
        .doc(user.id)
        .collection("books")
        .doc(book.id)
        .update({ favorite: !isFavorite });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await firestore()
        .collection("users")
        .doc(user.id)
        .collection("books")
        .doc(book.id)
        .update({ status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = () => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o livro "${book.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await firestore()
                .collection("users")
                .doc(user?.id)
                .collection("books")
                .doc(book.id)
                .delete();
              Alert.alert("Sucesso", "Livro excluído com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir livro:", error);
              Alert.alert("Erro", "Não foi possível excluir o livro.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditBook = () => {
    navigation.navigate("EditBook", { book });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.header}>
          <Text style={styles.title}>{book.titulo}</Text>
          <Text style={styles.subtitle}>por {book.autor}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ano de Publicação:</Text>
            <Text style={styles.detailValue}>{book.ano}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gênero:</Text>
            <Text style={styles.detailValue}>{book.genero}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={styles.statusContainer}>
              {["Quero ler", "Lendo", "Lido"].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusButton,
                    status === s && styles.statusActive
                  ]}
                  onPress={() => updateStatus(s)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === s && { color: "#fff" }
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEditBook}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Editar Livro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isFavorite ? styles.unfavoriteButton : styles.favoriteButton]}
            onPress={toggleFavorite}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {isFavorite ? "Desfavoritar" : "Favoritar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteBook}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Excluir Livro</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f3f3f3", 
    paddingTop: 60
  },
  scrollContainer: { 
    padding: 20, 
    paddingTop: 30
  },
  header: { 
    marginBottom: 40, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: "#e0e0e0" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#4B2E83", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 18, 
    color: "#666", 
    fontStyle: "italic" 
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: "#f0f0f0" 
  },
  detailLabel: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#333" 
  },
  detailValue: { 
    fontSize: 16, 
    color: "#666" 
  },
  statusContainer: { 
    flexDirection: "row", 
    gap: 8 
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#eee"
  },
  statusActive: {
    backgroundColor: "#6A5ACD"
  },
  statusText: {
    color: "#333",
    fontWeight: "600"
  },
  buttonContainer: { 
    gap: 16 
  },
  button: { 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    elevation: 3 
  },
  editButton: { backgroundColor: "#6A5ACD" },
  favoriteButton: { backgroundColor: "#FFD700" },
  unfavoriteButton: { backgroundColor: "#888" },
  deleteButton: { backgroundColor: "#FF6B6B" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
