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
  ActivityIndicator,
} from "react-native";
import ServiceUser from "../../services/ServiceUser";
import ServicePet from "../../services/ServicePet";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
    if (vacs.length === 0) return true; // sem vacinas = considerado em dia
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

  const vaccinesPending = pets.reduce((sum, pet) => {
    const vacs = Array.isArray(pet.vaccines)
      ? pet.vaccines
      : pet.vaccines
      ? [pet.vaccines]
      : [];
    return sum + vacs.filter((v) => v.isApplied === false).length;
  }, 0);

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
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5EA" />
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff7a00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerBg}>
            <View style={styles.header}></View>

            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {user ? user[0] : "U"}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user}</Text>
                <Text style={styles.userEmail}>{email}</Text>

                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark" size={14} color="#c6670fff" />
                  <Text style={styles.badgeText}>Tutor responsável</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Meus pets</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Home", { screen: "Pets" })}>
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
                <Text style={styles.statLabel}>com pendências</Text>
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
                  style={[styles.iconCircle, { backgroundColor: "#e74d3c57" }]}
                >
                  <Ionicons name="exit-outline" size={20} color="#e74c3c" />
                </View>
                <Text style={styles.menuText}>Sair</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* <View style={styles.help}>
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
          </TouchableOpacity> */}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },

  headerBg: {
    backgroundColor: "#ffe4ce",
    paddingBottom: 50,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    paddingHorizontal: 20,
    paddingTop: 25,
    gap: 16,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3c39c",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#f09b56",
    elevation: 4,
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  userInfo: {
    alignItems: "flex-start",
    justifyContent: "center",
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 13,
    color: "#727272ff",
    marginBottom: 10,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdb06873",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#c6670fff",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 2,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: -25,
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
    marginBottom: 30,
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

    margin: 10,
    padding: 15,
    borderRadius: 16,
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
