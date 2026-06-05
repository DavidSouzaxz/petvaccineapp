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
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AlertModal, ConfirmationModal } from "../../components/modals";
import ServiceUser from "../../services/ServiceUser";
import ServiceSignature from "../../services/ServiceSignature";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const handleRegister = async () => {
    setLoading(true);
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !contact ||
      !profileImage
    ) {
      setAlertMessage("Preencha todos os campos e selecione um avatar.");
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

    let photoUrl = null;

    try {
      // Se for galeria ou câmera, fazer upload da imagem
      if (selectedAvatarType === "gallery" || selectedAvatarType === "camera") {
        const authData = await ServiceSignature.getSignature();
        photoUrl = await ServiceSignature.uploadImage(profileImage, authData);
      } else if (selectedAvatarType === "avatar1") {
        photoUrl = "avatar1";
      } else if (selectedAvatarType === "avatar2") {
        photoUrl = "avatar2";
      }

      const credentials = {
        name: name,
        email: email,
        password: password,
        contact: contact,
        photoUrl: photoUrl,
      };

      await ServiceUser.register(credentials);
      setConfirmMessage("Conta criada com sucesso!");
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
      setConfirmVisible(true);
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
    navigation.navigate("Login");
  };

  const selectProfileImage = (imageType) => {
    if (imageType === "avatar1") {
      setProfileImage(require("../../../assets/profile_man.png"));
      setSelectedAvatarType("avatar1");
    } else if (imageType === "avatar2") {
      setProfileImage(require("../../../assets/profile_male.png"));
      setSelectedAvatarType("avatar2");
    }
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

  return (
    <ImageBackground
      source={require("../../../assets/background-4.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      <View style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Criar Conta</Text>

            {/* Avatar Selection */}
            <View style={styles.avatarSection}>
              <Text style={styles.avatarLabel}>Escolha seu avatar</Text>

              {/* Main Avatar Display with Edit Button */}
              <View style={styles.mainAvatarContainer}>
                <View style={styles.mainAvatarWrapper}>
                  {profileImage ? (
                    <Image
                      source={
                        selectedAvatarType === "gallery" ||
                        selectedAvatarType === "camera"
                          ? { uri: profileImage }
                          : profileImage
                      }
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
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Número de Contato"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />

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
      </View>
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
                selectProfileImage("avatar1");
                setAvatarModalVisible(false);
              }}
            >
              <View style={styles.smallModalOptionImage}>
                <Image
                  source={require("../../../assets/profile_man.png")}
                  style={styles.smallModalOptionImg}
                />
              </View>
              <Text style={styles.smallModalOptionLabel}>Avatar 1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                selectProfileImage("avatar2");
                setAvatarModalVisible(false);
              }}
            >
              <View style={styles.smallModalOptionImage}>
                <Image
                  source={require("../../../assets/profile_male.png")}
                  style={styles.smallModalOptionImg}
                />
              </View>
              <Text style={styles.smallModalOptionLabel}>Avatar 2</Text>
            </TouchableOpacity>

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
                  size={15}
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
                  size={15}
                  color="#ff7a00"
                />
              </View>
              <Text style={styles.smallModalOptionLabel}>Câmera</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    gap: 8,
  },
  avatarSection: {
    marginBottom: 20,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  mainAvatarContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    right: "25%",
    backgroundColor: "#ff7a00",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  avatarOption: {
    width: "48%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  avatarOptionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  avatarOptionImg: {
    width: 40,
    height: 50,
    borderRadius: 25,
  },
  avatarOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff5ea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarOptionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    right: "2%",
    bottom: 34,
    justifyContent: "center",
    alignItems: "flex-end",
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
    width: 150,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
    marginVertical: 4,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  smallModalOptionImage: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  smallModalOptionImg: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  smallModalOptionIcon: {
    width: 25,
    height: 25,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  smallModalOptionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    flex: 1,
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
  button: {
    backgroundColor: "#ff7a00",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    elevation: 0,
    shadowColor: "transparent",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#707070",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
  },
});
