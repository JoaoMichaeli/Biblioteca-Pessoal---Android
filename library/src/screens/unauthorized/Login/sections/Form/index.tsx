import React, { useState } from "react";
import { Input } from "components/Inputs/Input";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import MailIcon from "@assets/mail-01.svg";
import LockUnlocked from "@assets/lock-unlocked-04.svg";
import { Button } from "components/Buttons/Button";
import { useAuth } from "hooks/auth";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UnsafeStackParamList } from "navigation/types";

export function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation<NavigationProp<UnsafeStackParamList, "Login">>();

  const validateEmail = (text: string) => {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(text) ? "Email inválido, formato: email@email.com" : "");
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(text.length < 6 ? "Senha deve ter pelo menos 6 caracteres" : "");
  };

  const submit = async () => {
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    let valid = true;

    if (!emailTrimmed || emailError) valid = false;
    if (!passwordTrimmed || passwordError) valid = false;
    if (!valid) return;

    setLoading(true);
    try {
      await login({ email: emailTrimmed, password: passwordTrimmed });
    } catch (error: any) {
      if (error.code === "auth/user-not-found") setEmailError("Usuário não encontrado");
      else if (error.code === "auth/wrong-password") setPasswordError("Senha incorreta");
      else setPasswordError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Email */}
      <Input
        title="Email"
        icon={MailIcon}
        placeholder="Digite seu email"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
        titleStyle={{ color: "#333" }}
        style={styles.input}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Senha */}
      <Input
        title="Senha"
        icon={LockUnlocked}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={validatePassword}
        secureTextEntry
        placeholderTextColor="#999"
        titleStyle={{ color: "#333" }}
        style={styles.input}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* Opções */}
      <View style={styles.options}>
        <Text style={styles.optionText}>Lembrar-me</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      {/* Botão */}
      <Button label={loading ? "" : "Entrar"} onPress={submit} style={styles.button}>
        {loading && <ActivityIndicator color="#fff" />}
      </Button>

      {/* Divisor */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OU</Text>
        <View style={styles.divider} />
      </View>

      {/* Cadastro */}
      <View style={styles.registerContainer}>
        <Text style={styles.noAccountText}>Não possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    backgroundColor: "#F9F9FC",
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },
  options: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 4 
  },
  optionText: { color: "#666", fontSize: 12 },
  forgotText: { color: "#6A5ACD", fontWeight: "600", fontSize: 12 },
  button: { 
    backgroundColor: "#6A5ACD", 
    borderRadius: 10, 
    paddingVertical: 12, 
    marginTop: 10,
  },
  errorText: { color: "red", fontSize: 10, marginTop: -3, marginBottom: 2 },
  dividerContainer: { flexDirection: "row", alignItems: "center", gap: 6, marginVertical: 10 },
  divider: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { color: "#999", fontWeight: "500", fontSize: 12 },
  registerContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  noAccountText: { color: "#333", fontSize: 12 },
  registerText: { color: "#6A5ACD", fontWeight: "600", fontSize: 12 },
});


