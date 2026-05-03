import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Entypo, AntDesign, Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ onLogout }) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
  AsyncStorage.getItem("@userName").then((name) => {
    if (name) setUser(name);
  });

  AsyncStorage.getItem("@userEmail").then((mail) => {
    if (mail) setEmail(mail);
  });
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.topContainer}>
          <Text style={styles.title}>Perfil</Text>

          <Text style={[styles.subtitle, { width: 200 }]}>    
          Gerencie sua conta e cuide cada vez melhor dos seus pets.
          </Text>

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user[0]}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{user}</Text>
              <Text style={styles.email}>{email || "email nao carregada"}</Text>

              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={15} color="#a85b1f" style={{ marginRight: 5 }} />
                <Text style={styles.badgeText}>Tutor Responsável</Text>
              </View>

              
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={20} color="#F4A361" />
                <Text style={styles.menuLabel}>Editar perfil</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="notifications-outline" size={20} color="#7b61ff" />
                <Text style={styles.menuLabel}>Notificações</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#2ecc71" />
                <Text style={styles.menuLabel}>Privacidade e segurança</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="information-circle-outline" size={20} color="#3498db" />
                <Text style={styles.menuLabel}>Sobre o aplicativo</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>


          <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="exit-outline" size={20} color="#e74c3c" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FDF4E7",
  },

  topContainer: {
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    marginBottom: 20,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  avatar: {
    width: 79,
    height: 79,
    borderRadius: 39.5,
    backgroundColor: "#f3c39c",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 26,
    fontWeight: "700",
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  email: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },

  badge: {
    marginTop: 6,
    backgroundColor: "#fde7d3",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },

  badgeText: {
    fontSize: 11,
    color: "#a85b1f",
    fontWeight: "500",
  },

  section: {
    marginHorizontal: 16,
    marginTop: 25,
  },

  menuCard: {
    backgroundColor: "#fffcf7ff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    marginTop: 10,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: "#222",
  },

  menuArrow: {
    fontSize: 18,
    color: "#c0c0c0ff",
  },
 
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  }, 

  logoutText: {
    marginLeft: 10,
    color: "#e74c3c",
    fontWeight: "600",
  },
});