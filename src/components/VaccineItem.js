import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FormatDateDisplay from "../core/FormatDateDisplay";

const getVaccineStatus = (item) => {
  const today = new Date();
  const applicationDate = item?.applicationDate
    ? new Date(item.applicationDate.replace(" ", "T"))
    : null;

  if (item?.isApplied) {
    return {
      label: "Aplicada",
      color: "#2E7D32",
      background: "#E9F7EE",
      icon: "checkmark-circle",
    };
  }

  if (applicationDate && applicationDate < today) {
    return {
      label: "Atrasada",
      color: "#C62828",
      background: "#FCE9E9",
      icon: "alert-circle",
    };
  }

  return {
    label: "Proxima dose",
    color: "#C88719",
    background: "#FFF4E0",
    icon: "time",
  };
};

export default function VaccineItem({ item, onPress, petColor, index, total }) {
  const status = useMemo(() => getVaccineStatus(item), [item]);
  const safeTotal = typeof total === "number" && total > 0 ? total : 1;
  const showLine = index !== safeTotal - 1;
  const nextDate = item?.nextApplicationDate || item?.nextDate || null;

  return (
    <View style={styles.row}>
      <View style={styles.timelineColumn}>
        <View style={[styles.timelineDot, { borderColor: status.color }]}>
          <Ionicons name={status.icon} size={12} color={status.color} />
        </View>
        {showLine && (
          <View
            style={[styles.timelineLine, { backgroundColor: status.color }]}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.vaccineCard}
        onPress={() => onPress(item)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.vaccineName}>{item.name}</Text>
          <View style={styles.cardHeaderRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: status.background },
              ]}
            >
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="#C7C7C7"
              style={styles.chevronIcon}
            />
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>
              {item.isApplied ? "Aplicada em" : "Ultima dose"}
            </Text>
            <Text style={styles.dateValue}>
              {FormatDateDisplay(item.applicationDate)}
            </Text>
          </View>
          <View style={styles.dateDivider} />
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Proxima dose</Text>
            <Text style={styles.dateValue}>
              {nextDate ? FormatDateDisplay(nextDate) : "--/--/----"}
            </Text>
          </View>
        </View>

        <View style={[styles.colorGlow, { backgroundColor: petColor }]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  timelineColumn: {
    width: 28,
    alignItems: "center",
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  vaccineCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flex: 1,
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevronIcon: { marginLeft: 8 },
  vaccineName: { fontSize: 16, fontWeight: "700", color: "#2F2F2F" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateBlock: { flex: 1 },
  dateLabel: { fontSize: 11, color: "#9A9A9A", marginBottom: 4 },
  dateValue: { fontSize: 13, fontWeight: "600", color: "#3A3A3A" },
  dateDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#EFEFEF",
    marginHorizontal: 12,
  },
  colorGlow: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.08,
  },
});
