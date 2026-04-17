import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ onLogout }) {
  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja realmente sair do app?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            onLogout();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível deslogar.");
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{ padding: 20, backgroundColor: "red" }}
    >
      <Text>📍 Perfil de Usúario (Em breve)</Text>
      <Text style={{ color: "white", textAlign: "center" }}>Sair da Conta</Text>
    </TouchableOpacity>
  );
}
