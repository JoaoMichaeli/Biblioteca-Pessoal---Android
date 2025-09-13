import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Input } from "components/Inputs/Input";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "hooks/auth";
import debounce from "lodash.debounce";
import { Picker } from "@react-native-picker/picker";

interface Book {
  id: string;
  titulo: string;
  autor: string;
  ano: number;
  genero: string;
  status?: "quero ler" | "lendo" | "lido";
  favorite?: boolean;
  createdAt?: any;
}

export default function BookList({ navigation }: any) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"titulo" | "createdAt">("createdAt");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const PAGE_SIZE = 10;

  const fetchBooks = async (loadMore = false) => {
    if (!user?.id) return;

    try {
      let query: any = firestore()
        .collection("users")
        .doc(user.id)
        .collection("books")
        .orderBy(sortBy, sortBy === "titulo" ? "asc" : "desc")
        .limit(PAGE_SIZE);

      if (loadMore && lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();

      const data: Book[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

      if (loadMore) {
        setBooks(prev => [...prev, ...data]);
        applyFilters([...books, ...data], search, filterGenre, filterStatus);
      } else {
        setBooks(data);
        applyFilters(data, search, filterGenre, filterStatus);
      }
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBooks();
  }, [user?.id, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    fetchBooks();
  };

  const applyFilters = (booksList: Book[], searchText: string, genre?: string | null, status?: string | null) => {
    let filtered = booksList;

    if (searchText) {
      filtered = filtered.filter(book =>
        book.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter(book => book.genero === genre);
    }

    if (status) {
      filtered = filtered.filter(book => book.status === status);
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = useCallback(
    debounce((text: string) => {
      applyFilters(books, text, filterGenre, filterStatus);
    }, 300),
    [books, filterGenre, filterStatus]
  );

  const onChangeSearch = (text: string) => {
    setSearch(text);
    handleSearch(text);
  };

  const onChangeGenre = (value: string | null) => {
    setFilterGenre(value === "all" ? null : value);
    applyFilters(books, search, value === "all" ? null : value, filterStatus);
  };

  const onChangeStatus = (value: string | null) => {
    setFilterStatus(value === "all" ? null : value);
    applyFilters(books, search, filterGenre, value === "all" ? null : value);
  };

  const onChangeSort = (value: "title" | "createdAt") => {
    setSortBy(value);
    setLastDoc(null);
    setLoading(true);
    fetchBooks();
  };

  const loadMore = () => {
    if (!loadingMore && lastDoc) {
      setLoadingMore(true);
      fetchBooks(true);
    }
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Input
        placeholder="Buscar por título ou autor"
        value={search}
        onChangeText={onChangeSearch}
        style={{ color: "#000" }}
      />

      <View style={styles.filtersContainer}>
        <Picker
          selectedValue={filterGenre || "all"}
          onValueChange={onChangeGenre}
          style={styles.picker}
        >
          <Picker.Item label="Todos os gêneros" value="all" />
          <Picker.Item label="Ficção" value="Ficção" />
          <Picker.Item label="Romance" value="Romance" />
          <Picker.Item label="Fantasia" value="Fantasia" />
          <Picker.Item label="Não-ficção" value="Não-ficção" />
        </Picker>

        <Picker
          selectedValue={filterStatus || "all"}
          onValueChange={onChangeStatus}
          style={styles.picker}
        >
          <Picker.Item label="Todos os status" value="all" />
          <Picker.Item label="Quero Ler" value="quero ler" />
          <Picker.Item label="Lendo" value="lendo" />
          <Picker.Item label="Lido" value="lido" />
        </Picker>

        <Picker
          selectedValue={sortBy}
          onValueChange={onChangeSort}
          style={styles.picker}
        >
          <Picker.Item label="Data de cadastro" value="createdAt" />
          <Picker.Item label="Ordem alfabética" value="titulo" />
        </Picker>
      </View>

      {filteredBooks.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("BookDetails", { book: item })}
            >
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardAuthor}>{item.autor}</Text>
              <Text style={styles.cardYear}>{item.ano}</Text>
              <Text style={styles.cardGenre}>{item.genero}</Text>
              {item.status && <Text style={styles.cardStatus}>{item.status}</Text>}
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6A5ACD"]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#6A5ACD" /> : null}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateBook")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3", padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  filtersContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  picker: { flex: 1, color: "#000", marginHorizontal: 4 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 18, color: "#4B2E83", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#6A5ACD",
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#4B2E83", marginBottom: 4 },
  cardAuthor: { fontSize: 16, color: "#333", marginBottom: 2 },
  cardYear: { fontSize: 14, color: "#666" },
  cardGenre: { fontSize: 14, color: "#666" },
  cardStatus: { fontSize: 14, fontWeight: "600", color: "#6A5ACD", marginTop: 2 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#6A5ACD",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
});
