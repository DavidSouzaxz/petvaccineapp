import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceUser from "../../services/ServiceUser";

// Adicionamos o onSignIn aqui nas props
export default function LoginScreen({ navigation, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Validação básica antes de chamar a API
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const credentials = {
      email: email,
      password: password,
    };

    try {
      const response = await ServiceUser.login(credentials);

      if (response && response.token) {
        await AsyncStorage.setItem("@token", response.token);
        await AsyncStorage.setItem("@userId", response.userId);
        await AsyncStorage.setItem("@userName", response.name);

        Alert.alert("Bem-vindo", `Olá, ${response.name}!`);

        onSignIn(response.token);
      }
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha inválidos.");
      console.log("Erro no login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PetVax</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#F4A361",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#F4A361",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { color: "#F4A361", textAlign: "center", marginTop: 20 },
});
