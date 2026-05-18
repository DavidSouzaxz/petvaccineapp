import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationToggleButton() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const loadSetting = async () => {
      const storedSetting = await AsyncStorage.getItem(
        "@notificationsEnabledVaccine",
      );
      setIsEnabled(storedSetting === "true");
    };
    loadSetting();
  }, []);

  const handleToggle = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    await AsyncStorage.setItem(
      "@notificationsEnabledVaccine",
      newState.toString(),
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isEnabled ? "notifications" : "notifications-off-outline"}
        size={20}
        color={isEnabled ? "#E98B3A" : "#A19284"} // Laranja se ativo, bege/cinza se inativo
      />
      {/* O pontinho só aparece se as notificações estiverem ativas */}
      {isEnabled && <View style={styles.notificationDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40, // Aumentado levemente para melhor área de toque (UX)
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#F3E8DD",
    // Sombra sutil para dar o efeito de elevação que você usa nas telas
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#27AE60", // Pontinho verde discreto indicando que o sistema está operando
  },
});
