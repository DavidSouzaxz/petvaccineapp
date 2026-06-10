import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ButtonRollback from "../../components/ButtonRollback";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceUser from "../../services/ServiceUser";
import ServiceSignature from "../../services/ServiceSignature";

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    setLoading(true);
    try {
      const response = await ServiceUser.listById(
        await AsyncStorage.getItem("@userId"),
      );
      setName(response.name);
      setEmail(response.email);
      setPhone(response.contact);
      setCurrentPhotoUrl(response.photoUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("@userId");
    let finalPhotoUrl = currentPhotoUrl;

    try {
      if (image) {
        const authData = await ServiceSignature.getSignature();
        finalPhotoUrl = await ServiceSignature.uploadImage(image, authData);
      }

      const dataUser = {
        name: name,
        email: email,
        contact: phone,
        photoUrl: finalPhotoUrl,
      };

      await ServiceUser.update(userId, dataUser);
      await AsyncStorage.setItem("@userName", name);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    }

    return numbers
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ButtonRollback
          navigation={navigation}
          disabled={loading}
          backgroundColor="transparent"
        />
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Editar perfil</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff7a00" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {image ? (
                // 1. Se o usuário acabou de escolher uma foto nova na galeria/câmera, exibe ela
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : currentPhotoUrl &&
                currentPhotoUrl !== "null" &&
                currentPhotoUrl !== "" ? (
                // 2. Se não escolheu uma nova, mas tem uma foto válida vinda do banco, exibe a do banco
                <Image
                  source={{ uri: currentPhotoUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                // 3. Se não cair em nenhuma das condições acima, exibe o ícone padrão de conta
                <MaterialCommunityIcons
                  name="account-circle"
                  size={90} // Ajustado para 90 para casar com a largura/altura da sua View (45 * 2)
                  color="#e5e5e5"
                />
              )}
            </View>

            <TouchableOpacity style={styles.camera} onPress={pickImage}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
              placeholderTextColor="#B9B1A9"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor="#777"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(text) => setPhone(formatPhone(text))}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#B9B1A9"
              keyboardType="phone-pad"
              maxLength={15}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Salvar alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerBox: {
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 58,
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B2B2B",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 18,
    position: "relative",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f3c39c",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#222",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  camera: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    marginLeft: 65,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff7a00",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 0.6,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5b4",
    color: "#747474", // 👈 FIXADO CONTRA TEXTO BRANCO DO DARK MODE
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#f28c2b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
