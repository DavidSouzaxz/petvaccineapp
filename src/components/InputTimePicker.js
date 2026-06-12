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
    // Remove tudo que não for número
    let cleaned = text.replace(/\D/g, "");

    // VALIDAÇÃO CORRIGIDA: Só valida o limite de horas quando houver pelo menos 2 dígitos
    if (cleaned.length >= 2) {
      const hours = parseInt(cleaned.slice(0, 2));
      // Se a hora for maior que 23 (ex: 24, 25, 99), limita para 23
      if (hours > 23) {
        cleaned = "23" + cleaned.slice(2);
      }
    }

    // Valida o primeiro dígito dos minutos (não pode ser maior que 5, ex: 13:60 não existe)
    if (cleaned.length >= 3) {
      if (parseInt(cleaned[2]) > 5) {
        cleaned = cleaned.slice(0, 2) + "5";
      }
    }

    // Aplica a máscara de dois-pontos (HH:MM)
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }

    onChange(formatted);
  };

  const handleBlur = () => {
    if (!value) return;

    // Remove qualquer dois-pontos temporário para analisar os números puros
    const digits = value.replace(":", "");

    // Caso 1: Usuário digitou apenas 1 número (ex: "2") -> vira "02:00"
    if (digits.length === 1) {
      onChange(`0${digits}:00`);
    }
    // Caso 2: Usuário digitou as horas completas (ex: "13" ou "13:") -> vira "13:00"
    else if (digits.length === 2) {
      onChange(`${digits}:00`);
    }
    // Caso 3: Usuário digitou horas e metade dos minutos (ex: "13:3") -> vira "13:30"
    else if (digits.length === 3) {
      onChange(`${digits.slice(0, 2)}:${digits.slice(2)}0`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, styleLabel]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
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
