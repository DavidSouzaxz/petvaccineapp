import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
  Modal,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { AlertModal, ConfirmationModal } from "../../components/modals";
import ServiceUser from "../../services/ServiceUser";
import ServiceSignature from "../../services/ServiceSignature";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../services/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedAvatarType, setSelectedAvatarType] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 11);

    if (limited.length <= 2) {
      return limited.length > 0 ? `(${limited}` : "";
    }
    if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    }
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  const handleContactChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setContact(formatted);
  };

  const handleRegister = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword || !contact) {
      setAlertMessage("Por favor, preencha todos os campos.");
      setAlertVisible(true);
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAlertMessage("Por favor, insira um e-mail válido.");
      setAlertVisible(true);
      setLoading(false);
      return;
    }

    const rawContact = contact.replace(/\D/g, "");
    if (rawContact.length < 11) {
      setAlertMessage("O número de contato deve conter o DDD e 9 dígitos.");
      setAlertVisible(true);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setAlertMessage("A senha deve conter no mínimo 6 caracteres.");
      setAlertVisible(true);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("As senhas não conferem.");
      setAlertVisible(true);
      setLoading(false);
      return;
    }

    try {
      // PASSO 1: Registrar o usuário com photoUrl inicial nula
      const credentials = {
        name: name,
        email: email.trim(),
        password: password,
        contact: rawContact,
        photoUrl: null,
      };
      await ServiceUser.register(credentials);

      // PASSO 2: Efetuar o login imediatamente para pegar o Token
      const loginResponse = await ServiceUser.login({
        email: email.trim(),
        password: password,
      });

      const token = loginResponse?.token;
      const userId = loginResponse?.userId;

      // PASSO 3: Se houver foto, injeta o token no header e faz o processo de upload
      if (
        profileImage &&
        (selectedAvatarType === "gallery" || selectedAvatarType === "camera")
      ) {
        // Injeta nativamente no Axios importado para evitar o 403
        console.log(loginResponse);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const authData = await ServiceSignature.getSignature();
        const photoUrl = await ServiceSignature.uploadImage(
          profileImage,
          authData,
        );

        const dataUser = {
          photoUrl: photoUrl,
        };

        // Atualiza a foto usando o seu endpoint de edição de perfil
        await ServiceUser.update(userId, dataUser);
      }

      // PASSO 4: Grava os registros de configurações padrões locais
      await AsyncStorage.setItem("@token", token); // Salva o token para persistir o login
      await AsyncStorage.setItem(
        "@notificationsEnabled",
        JSON.stringify(false),
      );
      await AsyncStorage.setItem(
        "@notificationsEnabledSaude",
        JSON.stringify(false),
      );
      await AsyncStorage.setItem(
        "@notificationsEnabledVaccine",
        JSON.stringify(false),
      );
      await AsyncStorage.setItem(
        "@notificationsEnabledPromotions",
        JSON.stringify(false),
      );

      setAlertMessage("Conta criada com sucesso!");
      setAlertVisible(true);

      setTimeout(() => {
        navigation.navigate("Login");
      }, 1500);
    } catch (error) {
      const msg = error.response?.data || "Erro ao cadastrar usuário.";
      setAlertMessage(msg);
      setAlertVisible(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSuccess = () => {
    setConfirmVisible(false);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Permissão para acessar galeria foi negada.");
      setAlertVisible(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setSelectedAvatarType("gallery");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Permissão para acessar câmera foi negada.");
      setAlertVisible(true);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setSelectedAvatarType("camera");
    }
  };

  // 👈 ADICIONADO: Função para limpar a foto selecionada
  const removePhoto = () => {
    setProfileImage(null);
    setSelectedAvatarType(null);
  };

  return (
    <ImageBackground
      source={require("../../../assets/background_4.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === "ios" ? 40 : 100}
        extraHeight={Platform.OS === "ios" ? 120 : 150}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Criar Conta</Text>

            {/* Photo Selection Area */}
            <View style={styles.avatarSection}>
              <Text style={styles.avatarLabel}>Foto de Perfil</Text>

              <View style={styles.mainAvatarContainer}>
                <View style={styles.mainAvatarWrapper}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.mainAvatarImage}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={100}
                      color="#e5e5e5"
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  onPress={() => setAvatarModalVisible(true)}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={16}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#B9B1A9"
            />

            <TextInput
              style={styles.input}
              placeholder="Número de Contato"
              value={contact}
              onChangeText={handleContactChange}
              keyboardType="phone-pad"
              placeholderTextColor="#B9B1A9"
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#B9B1A9"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Senha (mínimo 6 caracteres)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#B9B1A9"
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

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#B9B1A9"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#707070"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>
                Já tem conta? Voltar para o Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal Reduzido: Apenas Galeria, Câmera ou Remover */}
      <Modal
        visible={avatarModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAvatarModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                pickImageFromGallery();
                setAvatarModalVisible(false);
              }}
            >
              <View style={styles.smallModalOptionIcon}>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={18}
                  color="#ff7a00"
                />
              </View>
              <Text style={styles.smallModalOptionLabel}>Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                takePhoto();
                setAvatarModalVisible(false);
              }}
            >
              <View style={styles.smallModalOptionIcon}>
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={18}
                  color="#ff7a00"
                />
              </View>
              <Text style={styles.smallModalOptionLabel}>Câmera</Text>
            </TouchableOpacity>

            {/* 👈 ADICIONADO: Opção de limpar a seleção da foto */}
            {profileImage && (
              <TouchableOpacity
                style={[styles.modalOption, styles.modalDeleteOption]}
                onPress={() => {
                  removePhoto();
                  setAvatarModalVisible(false);
                }}
              >
                <View style={styles.smallModalOptionIcon}>
                  <MaterialCommunityIcons
                    name="image-remove"
                    size={18}
                    color="#E74C3C"
                  />
                </View>
                <Text
                  style={[styles.smallModalOptionLabel, styles.deleteLabel]}
                >
                  Remover Foto
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      {/* <ConfirmationModal
        visible={confirmVisible}
        message={confirmMessage}
        onConfirm={handleConfirmSuccess}
        onCancel={() => setConfirmVisible(false)}
      /> */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 30,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    gap: 12,
  },
  avatarSection: {
    marginBottom: 10,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  mainAvatarContainer: {
    alignItems: "center",
    position: "relative",
  },
  mainAvatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ff7a00",
    overflow: "hidden",
  },
  mainAvatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "32%",
    backgroundColor: "#ff7a00",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    paddingRight: "5%",
    paddingBottom: "20%",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 160, // 👈 Ajustado levemente para acomodar o texto de remoção
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 4,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  modalDeleteOption: {
    borderColor: "#FADBD8",
    backgroundColor: "#FDEDEC",
  },
  smallModalOptionIcon: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  smallModalOptionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  deleteLabel: {
    color: "#E74C3C",
  },
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
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff7a00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#707070",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
  },
});
