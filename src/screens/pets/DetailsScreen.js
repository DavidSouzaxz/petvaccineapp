import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // IMPORTANTE
import { Ionicons } from "@expo/vector-icons";
import VaccineItem from "../../components/VaccineItem";
import ServiceVaccine from "../../services/ServiceVaccine";
import ButtonRollback from "../../components/ButtonRollback";
import FormatDateDisplay from "../../core/FormatDateDisplay";

export default function DetailsScreen({ route, navigation }) {
  const { pet, petColor = "#F4A361" } = route.params;

  const [vaccines, setVaccines] = useState(route.params?.pet?.vaccines || []);
  const [loading, setLoading] = useState(false);

  const confirmVaccineApplication = async (item) => {
    setLoading(true);

    try {
      await ServiceVaccine.vaccineIsApplied(item.id);

      await loadVaccines();

      Alert.alert("Sucesso", "Vacina marcada como aplicada!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao atualizar status da vacina.");
    } finally {
      setLoading(false);
    }
  };

  const loadVaccines = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ServiceVaccine.listAll();
      const petVaccines = (data || []).filter(
        (item) => item?.pet?.id === pet.id || item?.petId === pet.id,
      );
      setVaccines(petVaccines);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pet.id]);

  useFocusEffect(
    useCallback(() => {
      loadVaccines();
    }, [loadVaccines]),
  );

  const petStatus = useMemo(() => {
    const today = new Date();
    const hasOverdue = vaccines.some((item) => {
      if (item?.isApplied) return false;
      if (!item?.applicationDate) return false;
      const date = new Date(item.applicationDate.replace(" ", "T"));
      return date < today;
    });
    const hasPending = vaccines.some((item) => !item?.isApplied);

    if (hasOverdue) {
      return {
        label: "Atrasada",
        color: "#C62828",
        background: "#FCE9E9",
        icon: "alert-circle",
      };
    }

    if (hasPending) {
      return {
        label: "Atencao",
        color: "#C88719",
        background: "#FFF4E0",
        icon: "time",
      };
    }

    return {
      label: "Em dia",
      color: "#2E7D32",
      background: "#E9F7EE",
      icon: "checkmark-circle",
    };
  }, [vaccines]);

  const calendarVaccines = useMemo(() => {
    return [...(vaccines || [])].sort((a, b) => {
      const dateA = a?.applicationDate
        ? new Date(a.applicationDate.replace(" ", "T"))
        : 0;
      const dateB = b?.applicationDate
        ? new Date(b.applicationDate.replace(" ", "T"))
        : 0;
      return dateA - dateB;
    });
  }, [vaccines]);

  const historyVaccines = useMemo(() => {
    return [...(vaccines || [])].sort((a, b) => {
      const dateA = a?.applicationDate
        ? new Date(a.applicationDate.replace(" ", "T"))
        : 0;
      const dateB = b?.applicationDate
        ? new Date(b.applicationDate.replace(" ", "T"))
        : 0;
      return dateB - dateA;
    });
  }, [vaccines]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4A361" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <ButtonRollback
              navigation={navigation}
              backgroundColor="#FFF"
              color="#B56A2B"
              disabled={loading}
            />
            <View style={styles.flexSpacer} />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditPet", { pet })}
            >
              <Ionicons name="pencil-outline" size={20} color="#B56A2B" />
            </TouchableOpacity>
          </View>

          <View style={styles.petCard}>
            <Image
              source={require("../../../assets/dogProfile.png")}
              style={styles.petAvatar}
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petMeta}>
                {pet.breed || "Sem raca"}
                {pet.age ? ` - ${pet.age}` : ""}
              </Text>
              <View
                style={[
                  styles.petStatus,
                  { backgroundColor: petStatus.background },
                ]}
              >
                <Ionicons
                  name={petStatus.icon}
                  size={14}
                  color={petStatus.color}
                  style={styles.petStatusIcon}
                />
                <Text
                  style={[styles.petStatusText, { color: petStatus.color }]}
                >
                  {petStatus.label}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tabs}>
            <Text style={styles.tabMuted}>Resumo</Text>
            <View style={styles.tabActive}>
              <Text style={styles.tabTextActive}>Vacinas</Text>
              <View style={styles.tabUnderline} />
            </View>
            <Text style={styles.tabMuted}>Informacoes</Text>
          </View>

          <Text style={styles.sectionTitle}>Calendario de vacinas</Text>
          {calendarVaccines.length > 0 ? (
            <View style={styles.calendarList}>
              {calendarVaccines.map((item, index) => (
                <VaccineItem
                  key={item.id}
                  item={item}
                  onConfirm={confirmVaccineApplication}
                  petColor={petColor}
                  index={index}
                  total={calendarVaccines.length}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={44} color="#D3D3D3" />
              <Text style={styles.emptyText}>Nenhuma vacina registrada.</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AddVaccine", { petId: pet.id, petColor })
            }
          >
            <Ionicons
              name="add"
              size={18}
              color="#E98B3A"
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>Adicionar vacina</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Historico de vacinas</Text>
          <View style={styles.historyCard}>
            {historyVaccines.length > 0 ? (
              historyVaccines.map((item, index) => (
                <View
                  key={`history-${item.id}`}
                  style={[
                    styles.historyRow,
                    index === historyVaccines.length - 1 &&
                      styles.historyRowLast,
                  ]}
                >
                  <Text style={styles.historyName}>{item.name}</Text>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyDate}>
                      {FormatDateDisplay(item.applicationDate)}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color="#C7C7C7"
                      style={styles.historyChevron}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.historyEmptyText}>Sem historico ainda.</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="medical"
              size={22}
              color="#E98B3A"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Mantenha as vacinas do seu pet sempre em dia para garantir a saude
              e o bem-estar dele.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },
  scrollContent: { paddingBottom: 40 },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2F2F2F",
  },
  flexSpacer: { flex: 1 },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  petCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#FBECDC",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  petAvatar: { width: 72, height: 72, borderRadius: 18, marginRight: 14 },
  petInfo: { flex: 1 },
  petName: { fontSize: 20, fontWeight: "700", color: "#2F2F2F" },
  petMeta: { fontSize: 13, color: "#8B7A6B", marginTop: 4 },
  petStatus: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 10,
  },
  petStatusIcon: { marginRight: 4 },
  petStatusText: { fontSize: 12, fontWeight: "700" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 10,
  },
  tabMuted: { fontSize: 13, color: "#B3A59A" },
  tabActive: { alignItems: "center" },
  tabTextActive: { fontSize: 13, fontWeight: "700", color: "#E98B3A" },
  tabUnderline: {
    height: 2,
    width: 48,
    backgroundColor: "#E98B3A",
    marginTop: 6,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F2F2F",
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  calendarList: { paddingHorizontal: 20 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#FFF",
    borderRadius: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  addButton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E7B892",
    backgroundColor: "#FFF7F0",
  },
  addButtonIcon: { marginRight: 6 },
  addButtonText: { color: "#E98B3A", fontSize: 14, fontWeight: "700" },
  historyCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3EFEA",
  },
  historyRowLast: { borderBottomWidth: 0 },
  historyName: { fontSize: 14, color: "#3A3A3A", fontWeight: "600" },
  historyRight: { flexDirection: "row", alignItems: "center" },
  historyDate: { fontSize: 12, color: "#9A9A9A" },
  historyChevron: { marginLeft: 6 },
  historyEmptyText: {
    textAlign: "center",
    color: "#9A9A9A",
    paddingVertical: 16,
    fontSize: 13,
  },
  infoCard: {
    marginTop: 18,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF2E4",
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: { marginRight: 10 },
  infoText: {
    flex: 1,
    color: "#7D5A3B",
    fontSize: 13,
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
