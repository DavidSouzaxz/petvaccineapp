import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InputTimePicker({
  label,
  value,
  onChange,
  styleLabel,
}) {
  const handleTextChange = (text) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length >= 1) {
      if (parseInt(cleaned[0]) > 2) cleaned = "2";
    }
    if (cleaned.length >= 2) {
      if (parseInt(cleaned.slice(0, 2)) > 23) cleaned = "23" + cleaned.slice(2);
    }
    if (cleaned.length >= 3) {
      if (parseInt(cleaned[2]) > 5) cleaned = cleaned.slice(0, 2) + "5";
    }

    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }

    onChange(formatted);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, styleLabel]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder="00:00"
          placeholderTextColor="#B9B1A9"
          keyboardType="numeric"
          maxLength={5}
        />
        <Ionicons name="time-outline" size={20} color="#E98B3A" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "700", color: "#444", marginBottom: 8 },
  inputContainer: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#2B2B2B" },
});
