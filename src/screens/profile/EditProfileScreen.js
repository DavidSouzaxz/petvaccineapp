import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ServiceUser from "../../services/ServiceUser";
import ServiceSignature from "../../services/ServiceSignature";

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [image, setImage] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");

  const [vacinas, setVacinas] = useState(true);
  const [dicas, setDicas] = useState(true);
  const [promocoes, setPromocoes] = useState(false);

  useEffect(() => {
    loadingData()
  }, []);

  const loadingData = async () => {
    const response = await ServiceUser.listById(await AsyncStorage.getItem("@userId"))
    setName(response.name)
    setEmail(response.email)
    setPhone(response.contact)
    setCurrentPhotoUrl(response.photoUrl)
    console.log(response)
  }

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
        photoUrl: finalPhotoUrl
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7efe5" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>

          <Text style={styles.title}>Editar perfil</Text>

          <View style={styles.headerIcon} />
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.avatarImage}
              />
            ) : currentPhotoUrl ? (
              <Image
                source={{ uri: currentPhotoUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{name ? name[0] : ""}</Text>
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
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false}
            selectTextOnFocus={false}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Telephone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>

            {loading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Salvar alterações</Text>)}

          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  headerIcon: {
    width: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 18,
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
    right: 135,
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
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 8,
    color: "#222",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },

  switchText: {
    fontSize: 14,
    color: "#333",
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