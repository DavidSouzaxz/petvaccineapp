import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceOccurrences from "../../services/ServiceOccurrences";
import ServicePet from "../../services/ServicePet";

const OCCURRENCE_FILTERS = [
  { id: "all", label: "Todas", icon: "th-large" },
  { id: "symptoms", label: "Sintomas", icon: "notes-medical" },
  { id: "behavior", label: "Comportamento", icon: "dog" },
  { id: "others", label: "Outros", icon: "ellipsis-h" },
];

const OCCURRENCE_TYPE_COLORS = {
  Sintoma: { accent: "#2F8E59", badge: "#E5F5EC", icon: "stomach" },
  Comportamento: { accent: "#3A7BD5", badge: "#E7F0FB", icon: "paw" },
  Outros: { accent: "#D0A44B", badge: "#FFF6DD", icon: "tint" },
};

const petAvatar = require("../../../assets/dogProfile.png");

export default function OccurrencesScreen({ navigation }) {
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showPetSelector, setShowPetSelector] = useState(false);

  const fetchPets = async () => {
    const userId = await AsyncStorage.getItem("@userId");

    try {
      const data = await ServicePet.getPetsByUser(userId);
      setPets(data || []);
      if (data && data.length > 0) {
        setSelectedPet(data[0]);
      }
    } catch (e) {
      console.error("Erro ao buscar pets:", e);
      setPets([]);
    }
  };

  const fetchOccurrences = async (petId) => {
    setLoading(true);
    try {
      const data = await ServiceOccurrences.getByIdPet(petId);
      setOccurrences(data || []);
    } catch (e) {
      console.error("Erro ao buscar ocorrências:", e);
      setOccurrences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet && selectedPet.id) {
      fetchOccurrences(selectedPet.id);
    }
  }, [selectedPet]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5EA" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Ocorrências</Text>
            <Text style={styles.subtitle}>
              Registre sintomas, mudanças de comportamento{"\n"}e outros eventos
              do seu pet.
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={18} color="#4A4A4A" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.petCard}
          onPress={() => setShowPetSelector(true)}
          activeOpacity={0.7}
        >
          <View style={styles.petInfoRow}>
            <Image source={petAvatar} style={styles.petAvatar} />
            <View>
              <Text style={styles.petName}>
                {selectedPet ? selectedPet.name : "Selecione um pet"}
              </Text>
              <Text style={styles.petBreed}>
                {selectedPet ? selectedPet.breed : ""}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={18} color="#8C8C8C" />
        </TouchableOpacity>

        <Modal
          visible={showPetSelector}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPetSelector(false)}
        >
          <TouchableOpacity
            style={styles.petSelectorOverlay}
            activeOpacity={1}
            onPress={() => setShowPetSelector(false)}
          >
            <View style={styles.petSelectorCard}>
              <View style={styles.petSelectorHeader}>
                <Text style={styles.petSelectorTitle}>Selecione um pet</Text>
                <TouchableOpacity onPress={() => setShowPetSelector(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.petSelectorList}>
                {pets.map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.petSelectorItem,
                      selectedPet &&
                        selectedPet.id === pet.id &&
                        styles.petSelectorItemActive,
                    ]}
                    onPress={() => {
                      setSelectedPet(pet);
                      setShowPetSelector(false);
                    }}
                  >
                    <View style={styles.petSelectorItemContent}>
                      <Text
                        style={[
                          styles.petSelectorItemName,
                          selectedPet &&
                            selectedPet.id === pet.id &&
                            styles.petSelectorItemNameActive,
                        ]}
                      >
                        {pet.name}
                      </Text>
                      <Text style={styles.petSelectorItemBreed}>
                        {pet.breed}
                      </Text>
                    </View>
                    {selectedPet && selectedPet.id === pet.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#F49B4B"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 0 }}
        >
          {OCCURRENCE_FILTERS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterChip,
                activeFilter === item.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item.id)}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name={item.icon}
                size={16}
                color={activeFilter === item.id ? "#F49B4B" : "#6F6F6F"}
              />
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.id && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionTitle}>Ocorrências registradas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("OccurrencesAdd", {
                petId: selectedPet?.id,
                petName: selectedPet?.name,
                petColor: "#F49B4B",
              })
            }
          >
            <Ionicons name="add" size={16} color="#F49B4B" />
            <Text style={styles.addButtonText}>Nova ocorrência</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            Carregando...
          </Text>
        ) : occurrences.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            Nenhuma ocorrência encontrada.
          </Text>
        ) : (
          occurrences
            .filter((item) => {
              if (activeFilter === "all") return true;
              if (activeFilter === "symptoms") return item.type === "Sintoma";
              if (activeFilter === "behavior")
                return item.type === "Comportamento";
              if (activeFilter === "others") return item.type === "Outros";
              return true;
            })
            .map((item) => {
              const typeColors =
                OCCURRENCE_TYPE_COLORS[item.type] ||
                OCCURRENCE_TYPE_COLORS["Outros"];
              return (
                <View key={item.id} style={styles.occurrenceCard}>
                  <View style={styles.iconWrapper(typeColors.badge)}>
                    <FontAwesome5
                      name={typeColors.icon}
                      size={18}
                      color={typeColors.accent}
                    />
                  </View>
                  <View style={styles.occurrenceBody}>
                    <View style={styles.occurrenceHeader}>
                      <Text style={styles.occurrenceTitle}>{item.title}</Text>
                      <View style={styles.badge(typeColors.badge)}>
                        <Text style={styles.badgeText(typeColors.accent)}>
                          {item.type}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.occurrenceSubtitle}>
                      {item.subtitle}
                    </Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={14} color="#9A9A9A" />
                      <Text style={styles.metaText}>
                        {item.date} {item.time}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
                </View>
              );
            })
        )}

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="paw" size={18} color="#F49B4B" />
          </View>
          <View style={styles.tipTextWrapper}>
            <Text style={styles.tipTitle}>
              Fique atento aos sinais do seu pet
            </Text>
            <Text style={styles.tipText}>
              Registre qualquer mudança para acompanhar a saúde dele com mais
              precisão.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5EA", paddingTop: 35 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#222" },
  subtitle: { fontSize: 13, color: "#8E8E8E", marginTop: 6 },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  petCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  petInfoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  petAvatar: { width: 44, height: 44, borderRadius: 22 },
  petName: { fontSize: 16, fontWeight: "600", color: "#2D2D2D" },
  petBreed: { fontSize: 13, color: "#8E8E8E", marginTop: 2 },
  filtersRow: {
    marginTop: 18,
  },
  petSelectorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  petSelectorCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  petSelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  petSelectorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  petSelectorList: {
    paddingHorizontal: 0,
  },
  petSelectorItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  petSelectorItemActive: {
    backgroundColor: "#FFF0E2",
  },
  petSelectorItemContent: {
    flex: 1,
  },
  petSelectorItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  petSelectorItemNameActive: {
    color: "#F49B4B",
  },
  petSelectorItemBreed: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 4,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  filterChipActive: { backgroundColor: "#FFF0E2", borderColor: "#FFD8B7" },
  filterText: { fontSize: 12, color: "#6F6F6F", fontWeight: "600" },
  filterTextActive: { color: "#F49B4B" },
  listHeaderRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F0C19D",
    backgroundColor: "#FFFFFF",
  },
  addButtonText: { fontSize: 12, fontWeight: "600", color: "#F49B4B" },
  occurrenceCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapper: (backgroundColor) => ({
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  }),
  occurrenceBody: { flex: 1 },
  occurrenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  occurrenceTitle: { fontSize: 15, fontWeight: "700", color: "#2E2E2E" },
  badge: (backgroundColor) => ({
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor,
  }),
  badgeText: (color) => ({ fontSize: 11, fontWeight: "600", color }),
  occurrenceSubtitle: { fontSize: 12, color: "#8F8F8F", marginTop: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  metaText: { fontSize: 12, color: "#9A9A9A" },
  tipCard: {
    marginTop: 18,
    backgroundColor: "#FFF0E2",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF6EE",
    alignItems: "center",
    justifyContent: "center",
  },
  tipTextWrapper: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: "700", color: "#2E2E2E" },
  tipText: { fontSize: 12, color: "#7D7D7D", marginTop: 4 },
});
