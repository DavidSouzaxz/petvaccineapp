import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FormatDateDisplay from "../core/FormatDateDisplay";
import { useNavigation } from '@react-navigation/native';

export default function VaccineAlertCard({ vaccine }) {
  if (!vaccine) return null;

  const navigation = useNavigation();

  return (
    <View style={styles.card}>

      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PENDENTE</Text>
        </View>
        <MaterialCommunityIcons name="shield-alert" size={20} color="#F4A361" />
      </View>


      <View style={styles.body}>
        <Text style={styles.petName}>{vaccine.pet?.name || "Sem nome"}</Text>
        <Text style={styles.vaccineName}>{vaccine.name}</Text>
        <Text style={styles.dateLabel}>
          Vence em: <Text style={styles.dateValue}>{FormatDateDisplay(vaccine.applicationDate)}</Text>
        </Text>
      </View>


      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Details', { pet: vaccine.pet })}>
        <Text style={styles.buttonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    margin: 8,
    width: "45%",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#FFF1E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F4A361",
    letterSpacing: 0.5,
  },
  body: { marginBottom: 12 },
  petName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  vaccineName: { fontSize: 14, color: "#666", marginTop: 2 },
  dateLabel: { fontSize: 12, color: "#999", marginTop: 8 },
  dateValue: { color: "#333", fontWeight: "600" },
  button: {
    backgroundColor: "#F4A361",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
});