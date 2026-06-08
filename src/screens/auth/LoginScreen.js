import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AlertModal } from "../../components/modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceUser from "../../services/ServiceUser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NotificationManager } from "../../components/NotificationManager";

export default function LoginScreen({ navigation, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage("Por favor, preencha todos os campos.");
      setAlertVisible(true);
      return;
    }

    const credentials = {
      email: email,
      password: password,
    };
    setLoading(true);

    try {
      const response = await ServiceUser.login(credentials);

      if (response && response.token) {
        await AsyncStorage.setItem("@token", response.token);
        await AsyncStorage.setItem("@userId", response.userId);
        await AsyncStorage.setItem("@userName", response.name);
        await AsyncStorage.setItem("@userEmail", email);
        await NotificationManager.requestPermissions();

        // 2. Dispara o teste de boas-vindas
        await NotificationManager.sendWelcomeNotification(
          response.name || "Tutor",
        );

        onSignIn(response.token);
      }
    } catch (error) {
      setAlertMessage(error.response?.data);
      setAlertVisible(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../../../assets/background_4.png")}
        style={styles.background}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
        onLoadEnd={handleImageLoad}
      >
        {!imageLoaded ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F4A361" />
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>
            <View style={styles.containerInputs}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#B9B1A9"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Senha"
                  placeholderTextColor="#B9B1A9"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#707070"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        )}
        <AlertModal
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: "cover",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
    color: "#fcf4ee",
    textShadowColor: "rgba(58, 54, 54, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  containerInputs: { gap: 10 },
  input: {
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#333", // 👈 FIXADO CONTRA DARK MODE
  },
  eyeButton: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff7a00",
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
