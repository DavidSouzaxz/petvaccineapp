import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  SafeAreaViewBase,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ onLogout }) {
  const [user, setUser] = useState(AsyncStorage.getItem("@userName"));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
          </View>
        </View>

        <View style={styles.nameSection}>
          <Text style={styles.name}>{user}</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Tutor(a) de pets</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTA</Text>
          <View style={styles.menuCard}>
            {[
              { label: "Editar perfil", danger: false },
              { label: "Notificações", danger: false },
              { label: "Sair", danger: true, onPress: onLogout },
            ].map((item, index, arr) => (
              <TouchableOpacity
                key={item.label}
                onPress={item.onPress}
                style={[
                  styles.menuItem,
                  index < arr.length - 1 && styles.menuItemBorder,
                ]}
              >
                <Text style={[styles.menuLabel, item.danger && styles.danger]}>
                  {item.label}
                </Text>
                <Text style={[styles.menuArrow, item.danger && styles.danger]}>
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BLUE = "#007AFF";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: { backgroundColor: BLUE, height: 115, position: "relative" },
  avatarWrapper: {
    position: "absolute",
    bottom: -36,
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#B5D4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "500", color: "#0C447C" },

  nameSection: { alignItems: "center", marginTop: 44, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: "600", color: "#111" },
  email: { fontSize: 13, color: "#888", marginTop: 2 },
  badge: {
    marginTop: 8,
    backgroundColor: "#E6F1FB",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, color: "#185FA5" },

  section: { marginHorizontal: 16, marginTop: 24 },
  sectionTitle: {
    fontSize: 11,
    color: "#aaa",
    letterSpacing: 0.5,
    fontWeight: "600",
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 0.5, borderBottomColor: "#ebebeb" },
  menuLabel: { fontSize: 15, color: "#111" },
  menuArrow: { fontSize: 18, color: "#ccc" },
  danger: { color: "#E24B4A" },
});
