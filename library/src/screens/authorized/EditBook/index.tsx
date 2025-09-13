import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert,
  Image
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Input } from "components/Inputs/Input";
import { useAuth } from "hooks/auth";
import Icon from "react-native-vector-icons/Ionicons";

interface Book {
  id: string;
  titulo: string;
  autor: string;
  ano: number;
  genero: string;
}

export default function EditBook({ route, navigation }: any) {
  const { user } = useAuth();
  const { book } = route.params as { book: Book };

  const [titulo, setTitulo] = useState(book.titulo);
  const [autor, setAutor] = useState(book.autor);
  const [ano, setAno] = useState(String(book.ano));
  const [genero, setGenero] = useState(book.genero);
  const [loading, setLoading] = useState(false);

  const [tituloError, setTituloError] = useState("");
  const [autorError, setAutorError] = useState("");
  const [anoError, setAnoError] = useState("");
  const [generoError, setGeneroError] = useState("");

  const currentYear = new Date().getFullYear();

  const validateTitulo = (text: string) => {
    setTitulo(text);
    setTituloError(text.trim() === "" ? "Título é obrigatório" : "");
  };

  const validateAutor = (text: string) => {
    setAutor(text);
    setAutorError(text.trim() === "" ? "Autor é obrigatório" : "");
  };

  const validateAno = (text: string) => {
    setAno(text);
    const num = Number(text);
    if (!text.trim()) setAnoError("Ano é obrigatório");
    else if (isNaN(num) || num <= 0 || num > currentYear) setAnoError("Ano inválido");
    else setAnoError("");
  };

  const validateGenero = (text: string) => {
    setGenero(text);
    setGeneroError(text.trim() === "" ? "Gênero é obrigatório" : "");
  };

  const handleUpdateBook = async () => {
    validateTitulo(titulo);
    validateAutor(autor);
    validateAno(ano);
    validateGenero(genero);

    if (!titulo || !autor || !ano || !genero) return;
    if (tituloError || autorError || anoError || generoError) return;

    if (!user?.id) {
      console.error("Usuário não logado");
      return;
    }

    setLoading(true);
    try {
      await firestore()
        .collection("users")
        .doc(user.id)
        .collection("books")
        .doc(book.id)
        .update({
          titulo,
          autor,
          ano: Number(ano),
          genero,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert("Sucesso", "Livro atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      Alert.alert("Erro", "Não foi possível atualizar o livro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "#f3f3f3" }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Ícone de livro no topo */}
        <View style={styles.iconContainer}>
          <Icon name="book-outline" size={80} color="#6A5ACD" />
        </View>

        <Text style={styles.title}>Editar Livro</Text>

        <Input 
          title="Título" 
          placeholder="Digite o título do livro" 
          value={titulo} 
          onChangeText={validateTitulo} 
          titleStyle={{ color: "#000" }} 
        />
        {tituloError ? <Text style={styles.errorText}>{tituloError}</Text> : null}

        <Input 
          title="Autor" 
          placeholder="Digite o autor do livro" 
          value={autor} 
          onChangeText={validateAutor} 
          titleStyle={{ color: "#000" }} 
        />
        {autorError ? <Text style={styles.errorText}>{autorError}</Text> : null}

        <Input 
          title="Ano" 
          placeholder="Digite o ano de publicação" 
          value={ano} 
          onChangeText={validateAno} 
          keyboardType="numeric" 
          titleStyle={{ color: "#000" }} 
        />
        {anoError ? <Text style={styles.errorText}>{anoError}</Text> : null}

        <Input 
          title="Gênero" 
          placeholder="Digite o gênero do livro" 
          value={genero} 
          onChangeText={validateGenero} 
          titleStyle={{ color: "#000" }} 
        />
        {generoError ? <Text style={styles.errorText}>{generoError}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleUpdateBook} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Atualizar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    justifyContent: "center", 
    gap: 16,
    backgroundColor: "#f3f3f3"
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#4B2E83",
    marginBottom: 20
  },
  button: { 
    backgroundColor: "#6A5ACD", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 5, 
    elevation: 5, 
    marginTop: 20 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 18 
  },
  errorText: { 
    color: "red", 
    fontSize: 12, 
    marginTop: -8, 
    marginBottom: 8 
  },
});
