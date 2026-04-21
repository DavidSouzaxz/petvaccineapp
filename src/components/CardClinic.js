import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardClinic({ clinic, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={require("../../assets/clinic.png")} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {clinic.name}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {clinic.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#F4A361" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: { width: 60, height: 60, borderRadius: 15 },
  info: { flex: 1, marginLeft: 15, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16, color: "#333" },
  address: { fontSize: 12, color: "#888", marginTop: 4 },
});
