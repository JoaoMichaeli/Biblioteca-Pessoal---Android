import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Input } from "components/Inputs/Input";
import MailIcon from "@assets/mail-01.svg";
import LockUnlocked from "@assets/lock-unlocked-04.svg";
import { Button } from "components/Buttons/Button";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UnsafeStackParamList } from "navigation/types";
import { HeaderSection } from "components/HeaderSection";
import { Keyboard } from "components/Keyboard";
import { useAuth } from "hooks/auth";

export default function Register() {
  const navigation = useNavigation<NavigationProp<UnsafeStackParamList, "Register">>();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const validateName = (text: string) => {
    setName(text);
    setNameError(text.trim() === "" ? "nome é obrigatório" : "");
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(text) ? "Email inválido, formato: email@email.com" : "");
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(text.length < 6 ? "Senha deve ter pelo menos 6 caracteres" : "");
  };

const handleRegister = async () => {
  let valid = true;

    if (!name.trim()) {
    setNameError("Preencha seu nome");
    valid = false;
  }

  if (!email) {
    setEmailError("Preencha o email");
    valid = false;
  } else if (emailError) {
    valid = false;
  }

  if (!password) {
    setPasswordError("Preencha a senha");
    valid = false;
  } else if (passwordError) {
    valid = false;
  }

  if (!valid) return;

  setLoading(true);
  try {
    await register({ email, password, name });

    console.log("Usuário registrado com sucesso!");

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.getParent()?.navigate("Login");
    }
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") setEmailError("Email já cadastrado");
    else setPasswordError(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Keyboard>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderSection />

          <View style={styles.container}>
            <Text style={styles.title}>Criar Conta</Text>

            <Input
              title="Nome"
              placeholder="Digite seu nome"
              value={name}
              onChangeText={validateName}
              titleStyle={{ color: "#000" }}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <Input
              title="Email"
              icon={MailIcon}
              placeholder="Digite seu email"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
              titleStyle={{ color: "#000" }}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Input
              title="Senha"
              icon={LockUnlocked}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={validatePassword}
              secureTextEntry
              placeholderTextColor="#666"
              titleStyle={{ color: "#000" }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <Button label={loading ? "" : "Cadastrar"} onPress={handleRegister} style={styles.button}>
              {loading && <ActivityIndicator color="#fff" />}
            </Button>

            <View style={styles.loginRedirect}>
              <Text style={styles.noAccountText}>Já possui uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.registerText}>Entre</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Keyboard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: "#F9F9FC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: -4,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#6A5ACD",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  loginRedirect: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 14,
  },
  noAccountText: { color: "#333", fontSize: 12 },
  registerText: { color: "#6A5ACD", fontWeight: "600", fontSize: 12 },
});

