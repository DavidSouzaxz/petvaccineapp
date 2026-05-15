import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ActionButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.button}>
        <Ionicons name="paw" size={32} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -20, // Faz o botão flutuar acima da TabBar
    justifyContent: "center",
    alignItems: "center",
    // Sombras para iOS
    shadowColor: "#F4A361",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Sombra para Android
    elevation: 8,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F4A361",
    justifyContent: "center",
    alignItems: "center",
  },
});
