import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function PetCard({ pet, onPress, onEdit }) {
  const [from, to] = getBanenerColor(pet.id);

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
    borderRadius: 16,
    width: "47%",
    margin: "1.5%",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  banner: {
    height: 64,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  editButton: {
    position: "absolute",
    top: 6,
    right: 6,
    padding: 4,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingTop: 26,
    paddingHorizontal: 10,
    paddingBottom: 12,
    alignItems: "center",
  },
  name: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 1 },
  breed: { fontSize: 11, color: "#888", marginBottom: 4 },
  age: { fontSize: 11, color: "#aaa", marginBottom: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 3,
  },
  rowLabel: { fontSize: 10, color: "#555", flex: 1, marginLeft: 2 },
  badge: { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  badgeBlue: { backgroundColor: "#E6F1FB" },
  badgeBlueText: { fontSize: 9, color: "#185FA5", fontWeight: "500" },
});
