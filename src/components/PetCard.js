import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function PetCard({ pet, onPress, onEdit }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pet)}>
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(pet)}>
        <MaterialCommunityIcons name="pencil" size={20} color="#F4A361" />
      </TouchableOpacity>

      <Ionicons name="paw" size={24} color="#F4A361" />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.breed}>{pet.breed}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "47%",
    margin: "1.5%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  breed: {
    fontSize: 14,
    color: "#666",
  },
});
