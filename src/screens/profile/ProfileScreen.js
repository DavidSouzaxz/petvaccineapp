import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import ServiceUser from "../../services/ServiceUser";
import ServicePet from "../../services/ServicePet";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation, onLogout }) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pets, setPets] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const petsEmDia = pets.filter(
    (pet) => pet.vaccines.isApplied === true,
  ).length;
  const petsPendentes = pets.filter(
    (pet) => pet.vaccines.isApplied === false,
  ).length;

  const loadUserData = async () => {
    const response = await ServiceUser.listById(
      await AsyncStorage.getItem("@userId"),
    );
    setUser(response.name);
    setEmail(response.email);
    setPhone(response.contact);
    setProfileImage(response.photoUrl);
  };

  const fetchPets = async () => {
    const userId = await AsyncStorage.getItem("@userId");

    try {
      setLoading(true);
      const data = await ServicePet.getPetsByUser(userId);
      setPets(data || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pets.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    fetchPets();
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5EA" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>
            Gerencie sua conta e cuide{"\n"}
            cada vez melhor dos seus pets.
          </Text>

          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>{user ? user[0] : "U"}</Text>
                )}
              </View>

              <View style={styles.camera}>
                <Ionicons name="camera" size={16} color="#ff7a00" />
              </View>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{user}</Text>
              <Text style={styles.email}>{email}</Text>

              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={15} color="#ff7a00" />
                <Text style={styles.badgeText}> Tutor responsável</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Meus pets</Text>
            <TouchableOpacity onPress={() => navigation.navigate("PetsScreen")}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.link}>Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color="#ff7a00" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{pets.length}</Text>
              <Text style={styles.statLabel}>cadastrados</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {petsEmDia === 0 ? pets.length : petsEmDia}
              </Text>
              <Text style={styles.statLabel}>em dia</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Text style={styles.statNumber}>{petsPendentes}</Text>
              <Text style={styles.statLabel}>pendentes</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.menuLeft}>
              <View
                style={[styles.iconCircle, { backgroundColor: "#ff7a0020" }]}
              >
                <Ionicons name="person-outline" size={18} color="#ff7a00" />
              </View>
              <Text style={styles.menuText}>Editar perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[styles.iconCircle, { backgroundColor: "#7b61ff20" }]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color="#7b61ff"
                />
              </View>
              <Text style={styles.menuText}>Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[styles.iconCircle, { backgroundColor: "#2ecc7120" }]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color="#2ecc71"
                />
              </View>
              <Text style={styles.menuText}>Privacidade</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View
                style={[styles.iconCircle, { backgroundColor: "#3498db20" }]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#3498db"
                />
              </View>
              <Text style={styles.menuText}>Sobre</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.help}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color="#ff7a00"
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            <Text style={styles.helpText}>
              Fale conosco ou acesse a central.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logout} onPress={onLogout}>
          <Ionicons name="exit-outline" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
    marginTop: 4,
    fontSize: 13,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f3c39c",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "700",
  },

  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    marginLeft: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  email: {
    color: "#777",
  },

  badge: {
    flexDirection: "row",
    backgroundColor: "#ffe8d6",
    padding: 5,
    borderRadius: 20,
    marginTop: 5,
  },

  badgeText: {
    color: "#ff7a00",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    padding: 15,
    elevation: 0.6,
    marginBottom: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: "700",
  },

  link: {
    color: "#ff7a00",
    marginHorizontal: 5,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 15,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: 12,
    color: "#777",
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
  },

  sectionTitle: {
    fontWeight: "700",
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 5,
  },

  menuCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    marginBottom: 0,
    elevation: 0.6,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  menuText: {
    marginLeft: 10,
  },

  arrow: {
    color: "#ccc",
  },

  help: {
    flexDirection: "row",
    backgroundColor: "#fdf0e1ff",
    margin: 20,
    padding: 15,
    borderRadius: 16,
    elevation: 0.3,
  },

  helpTitle: {
    fontWeight: "700",
  },

  helpText: {
    fontSize: 12,
    color: "#777",
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe1deff",
    margin: 20,
    padding: 15,
    borderRadius: 16,
    elevation: 0.3,
    marginTop: 3,
  },

  logoutText: {
    marginLeft: 10,
    color: "#e74c3c",
    fontWeight: "600",
  },
});
