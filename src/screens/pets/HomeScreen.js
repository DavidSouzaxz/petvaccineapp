import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ServicePet from "../../services/ServicePet";
import ServiceVaccine from "../../services/ServiceVaccine";
import FormatDateDisplay from "../../core/FormatDateDisplay";

const { width } = Dimensions.get("window");

const PET_CARD_WIDTH = width - 40;
const TIP_CARD_WIDTH = (width - 60) / 3;

const PET_MESSAGES = [
  {
    id: "1",
    title: "Sabia que um ronrono pode ajudar",
    text: "a reduzir o estresse?",
    icon: "cat",
  },
  {
    id: "2",
    title: "Hidratacao e",
    text: "essencial para a saude do seu pet.",
    icon: "tint",
  },
  {
    id: "3",
    title: "Brincadeiras diarias",
    text: "fortalecem o vinculo entre voces.",
    icon: "heart",
  },
  {
    id: "4",
    title: "Um passeio cairia bem",
    text: "leve seu amigo para sair.",
    icon: "heart",
  },
];

const PET_STATUS = [
  {
    label: "Em dia",
    color: "#2E7D32",
    backgroundColor: "#E9F7EE",
    icon: "checkmark-circle",
  },
  {
    label: "Atencao",
    color: "#C88719",
    backgroundColor: "#FFF4E0",
    icon: "alert-circle",
  },
  {
    label: "Atrasado",
    color: "#C62828",
    backgroundColor: "#FCE9E9",
    icon: "close-circle",
  },
];

const dogProfile = require("../../../assets/dogProfile.png");
const reminderIcon = require("../../../assets/clinic.png");

export default function HomeScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [activeMenuPetId, setActiveMenuPetId] = useState(null);

  const fetchHomeData = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    if (!userId) return;

    try {
      setLoading(true);
      const [petResponse, vaccineResponse] = await Promise.all([
        ServicePet.getPetsByUser(userId),
        ServiceVaccine.listVaccinesPendentes(userId),
      ]);
      setPets(petResponse || []);
      setVaccines(vaccineResponse || []);
    } catch (error) {
      console.log("Erro ao buscar dados da home:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, []),
  );

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem("@userName");
      if (name) setUserName(name);
    };
    loadUserName();
  }, []);

  const upcomingVaccines = useMemo(() => vaccines.slice(0, 3), [vaccines]);

  const nextVaccineForPet = useCallback(
    (petId) => vaccines.find((item) => item.pet?.id === petId),
    [vaccines],
  );

  const goToAddPet = useCallback(() => {
    navigation.navigate("AddPet");
  }, [navigation]);

  const closeMenu = useCallback(() => {
    setActiveMenuPetId(null);
  }, []);

  const openMenu = useCallback((petId) => {
    setActiveMenuPetId((current) => (current === petId ? null : petId));
  }, []);

  return (
    <Pressable style={styles.container} onPress={closeMenu}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5EA" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Hi, {userName}</Text>
          <Text style={styles.headerSubtitle}>Seja bem-vinda!</Text>
        </View>
        <TouchableOpacity
          onPress={() => setNotifications(!notifications)}
          style={styles.notificationButton}
        >
          <Ionicons
            name={notifications ? "notifications" : "notifications-outline"}
            size={22}
            color="#333"
          />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4A361" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.containerImage}>
            <Image
              source={require("../../../assets/petcard.png")}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus pets</Text>
            <TouchableOpacity style={styles.sectionAction} onPress={goToAddPet}>
              <Ionicons name="add" size={16} color="#F4A361" />
              <Text style={styles.sectionActionText}>Adicionar pet</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.petListWrapper}>
            {pets.length > 0 ? (
              pets.map((pet, index) => {
                const status = PET_STATUS[index % PET_STATUS.length];
                const nextVaccine = nextVaccineForPet(pet.id);

                return (
                  <View
                    key={pet.id || `${pet.name}-${index}`}
                    style={styles.petCard}
                  >
                    <View style={styles.petProfileWrapper}>
                      <Image
                        source={dogProfile}
                        style={styles.petProfileImage}
                      />
                    </View>
                    <View style={styles.petInfo}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petMeta}>
                        {pet.breed || "Sem raca"}
                        {pet.age ? ` - ${pet.age}` : ""}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: status.backgroundColor },
                        ]}
                      >
                        <Ionicons
                          name={status.icon}
                          size={14}
                          color={status.color}
                        />
                        <Text
                          style={[styles.statusText, { color: status.color }]}
                        >
                          {status.label}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.petVaccineInfo}>
                      <Text style={styles.petVaccineLabel}>Proxima vacina</Text>
                      <Text style={styles.petVaccineName}>
                        {nextVaccine?.name || "Sem vacinas"}
                      </Text>
                      <View style={styles.petVaccineDateRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#888"
                        />
                        <Text style={styles.petVaccineDate}>
                          {nextVaccine?.applicationDate
                            ? FormatDateDisplay(nextVaccine.applicationDate)
                            : "--/--/----"}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={() => openMenu(pet.id)}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={16}
                        color="#999"
                      />
                    </TouchableOpacity>
                    {activeMenuPetId === pet.id && (
                      <View style={styles.menuCard}>
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            closeMenu();
                            navigation.navigate("Details", { pet });
                          }}
                        >
                          <Ionicons
                            name="eye-outline"
                            size={16}
                            color="#6F5A49"
                          />
                          <Text style={styles.menuText}>Visualizar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.menuItem, styles.menuItemLast]}
                          onPress={() => {
                            closeMenu();
                            navigation.navigate("EditPet", { pet });
                          }}
                        >
                          <Ionicons
                            name="pencil-outline"
                            size={16}
                            color="#6F5A49"
                          />
                          <Text style={styles.menuText}>Editar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhum pet cadastrado.</Text>
              </View>
            )}
          </View>

          <Text style={styles.reminderTitle}>Lembrete</Text>
          <View style={styles.reminderCard}>
            <View style={styles.reminderIconWrapper}>
              <Image source={reminderIcon} style={styles.reminderIcon} />
            </View>
            <Text style={styles.reminderText}>
              {vaccines.length > 0
                ? `${vaccines.length} vacina(s) pendente(s)`
                : "Nenhuma vacina pendente!"}
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Proximas vacinas</Text>
            <TouchableOpacity
              style={styles.sectionAction}
              onPress={() => navigation.navigate("Pets")}
            >
              <Text style={styles.sectionActionText}>Ver calendario</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.upcomingWrapper}>
            {upcomingVaccines.length > 0 ? (
              upcomingVaccines.map((vaccine, index) => (
                <View
                  key={vaccine.id || `${vaccine.name}-${index}`}
                  style={styles.upcomingItem}
                >
                  <Image source={dogProfile} style={styles.upcomingAvatar} />
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingPet}>{vaccine.pet?.name}</Text>
                    <Text style={styles.upcomingVaccine}>{vaccine.name}</Text>
                  </View>
                  <View style={styles.upcomingDateWrapper}>
                    <Ionicons name="calendar-outline" size={14} color="#777" />
                    <Text style={styles.upcomingDate}>
                      {FormatDateDisplay(vaccine.applicationDate)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#B5B5B5" />
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Sem vacinas cadastradas.</Text>
              </View>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dicas e Curiosidades</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsCarousel}
          >
            {PET_MESSAGES.map((item) => (
              <View key={item.id} style={styles.tipCard}>
                <View style={styles.tipIconWrapper}>
                  <FontAwesome5 name={item.icon} size={18} color="#F4A361" />
                </View>
                <Text style={styles.tipTitle}>{item.title}</Text>
                <Text style={styles.tipText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={goToAddPet}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EA" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerGreeting: { fontSize: 22, fontWeight: "700", color: "#2B2B2B" },
  headerSubtitle: { fontSize: 14, color: "#9B9B9B", marginTop: 4 },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1E2D1",
  },
  notificationDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F4A361",
  },
  scrollContent: { paddingBottom: 120 },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reminderTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2B2B2B",
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 20,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#2B2B2B" },
  sectionAction: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionActionText: { color: "#F4A361", fontWeight: "600", fontSize: 13 },
  petListWrapper: { paddingHorizontal: 20, gap: 14 },
  petCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4E7D7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: PET_CARD_WIDTH,
    alignSelf: "center",
    position: "relative",
  },
  petProfileWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFEFE1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  petProfileImage: { width: 52, height: 52, borderRadius: 26 },
  petInfo: { flex: 1 },
  petName: { fontSize: 16, fontWeight: "700", color: "#2B2B2B" },
  petMeta: { fontSize: 12, color: "#8F8F8F", marginTop: 2 },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: { fontSize: 11, fontWeight: "600" },
  petVaccineInfo: { marginRight: 12, alignItems: "flex-end" },
  moreButton: {
    padding: 6,
    marginLeft: 4,
  },
  menuCard: {
    position: "absolute",
    top: 42,
    right: 10,
    width: 140,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1E2D1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F4E7D7",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#6F5A49",
    fontWeight: "600",
  },
  petVaccineLabel: { fontSize: 11, color: "#A3A3A3" },
  petVaccineName: { fontSize: 12, fontWeight: "600", color: "#2B2B2B" },
  petVaccineDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: width - 40,
    height: 200,
    borderRadius: 20,

    backgroundColor: "#F4E7D7",

    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    elevation: 5,
  },
  petVaccineDate: { fontSize: 11, color: "#777" },
  reminderCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFEFD8",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reminderIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  reminderIcon: { width: 20, height: 20, resizeMode: "contain" },
  reminderText: { fontSize: 13, color: "#6D5B49", fontWeight: "600" },
  upcomingWrapper: { marginHorizontal: 20, gap: 8 },
  upcomingItem: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#F4E7D7",
  },
  upcomingAvatar: { width: 34, height: 34, borderRadius: 17 },
  upcomingInfo: { flex: 1 },
  upcomingPet: { fontSize: 13, fontWeight: "600", color: "#2B2B2B" },
  upcomingVaccine: { fontSize: 12, color: "#9A9A9A" },
  upcomingDateWrapper: { flexDirection: "row", alignItems: "center", gap: 4 },
  upcomingDate: { fontSize: 12, color: "#666" },
  tipsCarousel: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
    gap: 12,
  },
  tipCard: {
    width: TIP_CARD_WIDTH + 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4E7D7",
  },
  tipIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF3E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2B2B2B",
    textAlign: "center",
  },
  tipText: {
    fontSize: 10,
    color: "#8F8F8F",
    textAlign: "center",
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F4E7D7",
  },
  emptyText: { color: "#9B9B9B", fontStyle: "italic" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    backgroundColor: "#F4A361",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
