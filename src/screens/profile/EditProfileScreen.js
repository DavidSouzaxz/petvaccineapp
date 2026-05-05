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
  StatusBar,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");

  const [vacinas, setVacinas] = useState(true);
  const [dicas, setDicas] = useState(true);
  const [promocoes, setPromocoes] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("@userName").then((value) => value && setName(value));
    AsyncStorage.getItem("@userEmail").then(
      (value) => value && setEmail(value)
    );
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("@userName", name);
    await AsyncStorage.setItem("@userEmail", email);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
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

            {/* ajustar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>  
              {name ? name.charAt(0).toUpperCase() : "A"} 
            </Text>
          </View>

          <TouchableOpacity style={styles.camera}>
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
            onChangeText={setEmail}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput
            style={styles.input}
            value={birth}
            onChangeText={setBirth}
            placeholder="00/00/0000"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Sua cidade"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Sobre você</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={about}
            onChangeText={setAbout}
            placeholder="Conte um pouco sobre você"
            placeholderTextColor="#999"
            multiline
          />

          <Text style={styles.sectionTitle}>
            Preferências de notificação
          </Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Lembretes de vacinas</Text>
            <Switch value={vacinas} onValueChange={setVacinas} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Atividades e dicas</Text>
            <Switch value={dicas} onValueChange={setDicas} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Promoções e novidades</Text>
            <Switch value={promocoes} onValueChange={setPromocoes} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: StatusBar.currentHeight || 20,
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