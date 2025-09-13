import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Input } from "components/Inputs/Input";
import { useAuth } from "hooks/auth";

export default function CreateBook({ navigation }: any) {
  const { user } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [ano, setAno] = useState("");
  const [genero, setGenero] = useState("");
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

  const handleAddBook = async () => {
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
      const userRef = firestore().collection("users").doc(user.id);
      console.log("ID do usuário logado:", user.id);

      const doc = await userRef.get();
      if (!doc.exists) {
        console.error("Documento do usuário não encontrado no Firestore!");
        setLoading(false);
        return;
      }

      await userRef.collection("books").add({
        titulo,
        autor,
        ano: Number(ano),
        genero,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log("Livro salvo na coleção do usuário!");

      setTitulo(""); setAutor(""); setAno(""); setGenero("");
      setTituloError(""); setAutorError(""); setAnoError(""); setGeneroError("");

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f3f3f3" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Adicionar Livro</Text>

        <Input title="Título" placeholder="Digite o título do livro" value={titulo} onChangeText={validateTitulo} titleStyle={{ color: "#000" }} />
        {tituloError ? <Text style={styles.errorText}>{tituloError}</Text> : null}

        <Input title="Autor" placeholder="Digite o autor do livro" value={autor} onChangeText={validateAutor} titleStyle={{ color: "#000" }} />
        {autorError ? <Text style={styles.errorText}>{autorError}</Text> : null}

        <Input title="Ano" placeholder="Digite o ano de publicação" value={ano} onChangeText={validateAno} keyboardType="numeric" titleStyle={{ color: "#000" }} />
        {anoError ? <Text style={styles.errorText}>{anoError}</Text> : null}

        <Input title="Gênero" placeholder="Digite o gênero do livro" value={genero} onChangeText={validateGenero} titleStyle={{ color: "#000" }} />
        {generoError ? <Text style={styles.errorText}>{generoError}</Text> : null}

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleAddBook} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>Salvar</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center", gap: 12 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#4B2E83" },
  button: { backgroundColor: "#6A5ACD", padding: 16, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5, marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  errorText: { color: "red", fontSize: 12, marginTop: -8, marginBottom: 8 },
});
