import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ServiceVaccine from "../../services/ServiceVaccine";
import ServicePet from "../../services/ServicePet";
import ButtonRollback from "../../components/ButtonRollback";


export default function CalendarioScreen({ navigation }) {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetSelector, setShowPetSelector] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Selecione uma data";

    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  async function loadPets() {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("@userId");
      const data = await ServicePet.getPetsByUser(userId);

      setPets(data || []);

      if (data?.length > 0) {
        setSelectedPet(data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVaccines(pet = selectedPet) {
  if (!pet) return;

  try {
    setLoading(true);

    const data = await ServiceVaccine.listAll();

    const petVaccines = (data || []).filter(
      (item) => item?.pet?.id === pet.id || item?.petId === pet.id
    );

    const formatted = {};

    petVaccines.forEach((vac) => {
      let rawDate = vac.applicationDate;

      if (!rawDate) return;

      const date = rawDate.substring(0, 10);

      if (!formatted[date]) {
        formatted[date] = [];
      }

      formatted[date].push({
        id: vac.id,
        name: vac.name || "Vacina",
        applied: vac.isApplied,
        status: vac.isApplied ? "Aplicada" : "Próxima dose",
      });
    });

    setEvents(formatted);

    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
        } catch (error) {
          console.log("Erro vacinas:", error);
        } finally {
          setLoading(false);
  }
}
  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (selectedPet) loadVaccines(selectedPet);
  }, [selectedPet]);

  useFocusEffect(
    useCallback(() => {
      if (selectedPet) loadVaccines(selectedPet);
    }, [selectedPet])
  );

  const markedDates = useMemo(() => {
    const marks = {};

    Object.keys(events).forEach((date) => {
      const hasPending = events[date].some((item) => !item.applied);

      marks[date] = {
        marked: true,
        dotColor: hasPending ? "#F4A361" : "#47C266",
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: "#F4A361",
      };
    }

    return marks;
  }, [events, selectedDate]);

  const upcomingVaccines = Object.values(events)
    .flat()
    .filter((item) => !item.applied)
    .slice(0, 3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />
        <ActivityIndicator size="large" color="#F4A361" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
        <ButtonRollback
          navigation={navigation}
          backgroundColor="#FFF"
          color="#B56A2B"
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Calendário de vacinas</Text>
        </View>
      </View>

        {/* precisa ajustar */}
        <TouchableOpacity                  
          style={styles.petCard}
          onPress={() => setShowPetSelector(true)}
        >
          <View style={styles.petInfoRow}>
            <Image
              source={
                selectedPet?.photoUrl
                  ? { uri: selectedPet.photoUrl }
                  : require("../../../assets/dogProfile.png")
              }
              style={styles.petImage}
            />

            <View>
              <Text style={styles.petName}>{selectedPet?.name}</Text>
              <Text style={styles.petBreed}>
                {selectedPet?.breed || "Sem raça"}
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          style={styles.calendar}
          theme={{
            todayTextColor: "#F4A361",
            arrowColor: "#F4A361",
            selectedDayBackgroundColor: "#F4A361",
            selectedDayTextColor: "#FFF",
            monthTextColor: "#333",
            textMonthFontWeight: "700",
            textDayFontWeight: "600",
          }}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{formatDate(selectedDate)}</Text>

          {selectedDate && events[selectedDate] ? (
            events[selectedDate].map((item) => (
              <View key={item.id} style={styles.eventCard}>
                <Ionicons
                  name={item.applied ? "checkmark-circle" : "time"}
                  size={20}
                  color={item.applied ? "#47C266" : "#F4A361"}
                />

                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.eventTitle}>{item.name}</Text>
                  <Text style={styles.eventSubtitle}>{item.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Nenhum evento neste dia</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas doses</Text>

          {upcomingVaccines.length > 0 ? (
            upcomingVaccines.map((item) => (
              <View key={item.id} style={styles.eventCard}>
                <Ionicons name="alarm" size={20} color="#F4A361" />
                <Text style={{ marginLeft: 12, fontWeight: "600" }}>
                  {item.name}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Nenhuma próxima dose</Text>
          )}
        </View>
      </ScrollView>

      <Modal visible={showPetSelector} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPetSelector(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um pet</Text>

            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petOption}
                onPress={() => {
                  setSelectedPet(pet);
                  setShowPetSelector(false);
                }}
              >
                <Text style={styles.petOptionText}>{pet.name}</Text>

                {selectedPet?.id === pet.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#F4A361"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF4E7",
  },

  topBar: {
    paddingTop: 58,
    paddingHorizontal: 20,
    justifyContent: "center",
    position: "relative",
},

  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2F2F2F",
    textAlign: "center",
  },

  petCard: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
},

  petInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  petImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  petName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F2F2F",
  },

  petBreed: {
    fontSize: 13,
    color: "#8B7A6B",
    marginTop: 2,
  },

  calendar: {
    marginTop: 18,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 2,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#2F2F2F",
  },

  eventCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F2F2F",
  },

  eventSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  extraInfo: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  petOption: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  petOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});