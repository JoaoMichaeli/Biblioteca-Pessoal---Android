import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "hooks/auth";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; // ícones (coração)

interface Book {
  id: string;
  titulo: string;
  autor: string;
  ano: number;
  genero: string;
  favorite: boolean;
}

export default function Favorites() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.id)
      .collection("books")
      .where("favorite", "==", true)
      .onSnapshot(
        snapshot => {
          const favBooks: Book[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Book, "id">),
          }));
          setBooks(favBooks);
          setLoading(false);
        },
        error => {
          console.error("Erro ao buscar livros favoritos:", error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [user?.id]);

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BookDetails", { book: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.titulo}</Text>
        <MaterialIcons name="favorite" size={24} color="#FF6B6B" />
      </View>
      <Text style={styles.subtitle}>por {item.autor}</Text>
      <Text style={styles.info}>{item.genero} | {item.ano}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum livro favoritado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#4B2E83", flexShrink: 1 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 4 },
  info: { fontSize: 14, color: "#888" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#666" },
});
