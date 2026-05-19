import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { AlertModal, ConfirmationModal } from "../../components/modals";
import ServiceUser from "../../services/ServiceUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const handleRegister = async () => {
    setLoading(true)
    if (!name || !email || !password) {
      setAlertMessage("Preencha todos os campos.");
      setAlertVisible(true);
      return;
    }
    const credentials = {
      name: name,
      email: email,
      password: password,
    };

    try {

      await ServiceUser.register(credentials);
      setConfirmMessage("Conta criada com sucesso!");
      await AsyncStorage.setItem("@notificationsEnabled", JSON.stringify(false));
      await AsyncStorage.setItem("@notificationsEnabledSaude", JSON.stringify(false));
      await AsyncStorage.setItem("@notificationsEnabledVaccine", JSON.stringify(false));
      await AsyncStorage.setItem("@notificationsEnabledPromotions", JSON.stringify(false));
      setConfirmVisible(true);
    } catch (error) {

      const msg = error.response?.data || "Erro ao cadastrar usuário.";
      setAlertMessage(msg);
      setAlertVisible(true);
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const handleConfirmSuccess = () => {
    setConfirmVisible(false);
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../../../assets/background-4.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={name}
          onChangeText={setName}
        />
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}

        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Já tem conta? Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <ConfirmationModal
        visible={confirmVisible}
        message={confirmMessage}
        onConfirm={handleConfirmSuccess}
        onCancel={() => setConfirmVisible(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.26)",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#fcf4ee",
    textShadowColor: "rgba(58, 54, 54, 0.88)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#333",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: "#F4A361",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  linkText: {
    color: "#e7e7e7",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
    fontSize: 16,
  },
});
