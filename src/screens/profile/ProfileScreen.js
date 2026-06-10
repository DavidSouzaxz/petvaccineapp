import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
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

  const petsEmDia = pets.filter((pet) => {
    const vacs = Array.isArray(pet.vaccines)
      ? pet.vaccines
      : pet.vaccines
        ? [pet.vaccines]
        : [];
    if (vacs.length === 0) return true;
    return vacs.every((v) => v.isApplied === true);
  }).length;

  const petsPendentes = pets.filter((pet) => {
    const vacs = Array.isArray(pet.vaccines)
      ? pet.vaccines
      : pet.vaccines
        ? [pet.vaccines]
        : [];
    return vacs.some((v) => v.isApplied === false);
  }).length;

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await ServiceUser.listById(
        await AsyncStorage.getItem("@userId"),
      );
      setUser(response.name);
      setEmail(response.email);
      setPhone(response.contact);
      setProfileImage(response.photoUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
      fetchPets(); // 👈 Garante atualização das estatísticas ao voltar pra tela
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffe4ce" />
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff7a00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerBg}>
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {profileImage &&
                  profileImage !== "null" &&
                  profileImage !== "" ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={94}
                      color="#e5e5e5"
                    />
                  )}
                </View>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user || "Usuário"}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {email}
                </Text>

                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark" size={14} color="#c6670f" />
                  <Text style={styles.badgeText}>Tutor responsável</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card Meus Pets */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Meus pets</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home", { screen: "Pets" })}
              >
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
                  {pets.length === 0 ? 0 : petsEmDia}
                </Text>
                <Text style={styles.statLabel}>em dia</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.stat}>
                <Text style={styles.statNumber}>{petsPendentes}</Text>
                <Text style={styles.statLabel}>com pendências</Text>
              </View>
            </View>
          </View>

          {/* Lista de Configurações */}
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Notifications")}
            >
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Privacy")}
            >
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("About")}
            >
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

            <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
              <View style={styles.menuLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#e74d3c30" }]}
                >
                  <Ionicons name="exit-outline" size={18} color="#e74c3c" />
                </View>
                <Text style={[styles.menuText, styles.logoutTextColor]}>
                  Sair da conta
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  headerBg: {
    backgroundColor: "#ffe4ce",
    paddingTop: 30,
    paddingBottom: 60, // 👈 Aumentado para criar a área de respiro perfeita
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 16,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff", // 👈 Alterado para branco para destacar o ícone account-circle
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#f09b56",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: "hidden",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdb06840",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: "#c6670f",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30, // 👈 O pulo do gato: Faz o card flutuar por cima do fundo bege arredondado
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  link: {
    color: "#ff7a00",
    fontWeight: "700",
    fontSize: 14,
    marginRight: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    flexWrap: "wrap",
    width: "86%",
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#77777777",
  },
  menuCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 40,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444", // 👈 Protege o texto contra sumiço no Dark Mode do celular
  },
  logoutTextColor: {
    color: "#e74c3c",
  },
});
