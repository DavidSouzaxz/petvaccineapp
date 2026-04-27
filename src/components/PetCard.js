import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function PetCard({ pet, onPress, onEdit }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pet)}>
      <View style={styles.banner}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Ionicons name="paw" size={24} color="#F4A361" />
          </View>
        </View>
      </View>

      {/* Botão de edição */}
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(pet)}>
        <MaterialCommunityIcons name="pencil" size={20} color="#F4A361" />
      </TouchableOpacity>

      {/* Corpo do card */}
      <View style={styles.body}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
        {pet.age && <Text style={styles.age}>{pet.age}</Text>}

        {/* Se você tiver badges, pode usar a estrutura row que você tinha:
        <View style={styles.row}>
           <View style={[styles.badge, styles.badgeBlue]}>
              <Text style={styles.badgeBlueText}>Exemplo</Text>
           </View>
        </View>
        */}
      </View>
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
  banner: {
    height: 64,
    backgroundColor: "#f9f9f9", // Adicionei uma cor leve para diferenciar o banner
    alignItems: "center",
    justifyContent: "flex-end",
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