import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function VaccineItem({ item, onConfirm }) {
  return (
    <TouchableOpacity
      style={styles.vaccineCard}
      onPress={() => onConfirm(item)}
    >
      <View>
        <Text style={styles.vaccineName}>{item.name}</Text>
        <Text style={styles.vaccineDate}>Data: {item.date}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: item.applied ? "#C8E6C9" : "#FFCDD2" },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: item.applied ? "#2E7D32" : "#C62828" },
          ]}
        >
          {item.applied ? "Aplicada" : "Pendente"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  vaccineCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
  },
  vaccineName: { fontSize: 16, fontWeight: "bold" },
  vaccineDate: { fontSize: 14, color: "#666" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "bold" },
});
