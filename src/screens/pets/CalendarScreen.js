import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StatusBar
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceVaccine from "../../services/ServiceVaccine";
import ServicePet from "../../services/ServicePet";

export default function CalendarioScreen({ navigation }) {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetSelector, setShowPetSelector] = useState(false);

  async function loadPets() {
    const userId = await AsyncStorage.getItem("@userId");
    try {
      const data = await ServicePet.getPetsByUser(userId);
      setPets(data || []);
      if (data && data.length > 0) {
        setSelectedPet(data[0]);
      }
    } catch (e) {
      setPets([]);
    }
  }

  async function loadVaccines() {
    if (!selectedPet) return;

    try {
      const data = await ServiceVaccine.listAll();

      const petVaccines = (data || []).filter(
        (item) =>
          item?.pet?.id === selectedPet?.id ||
          item?.petId === selectedPet?.id
      );

      const formatted = {};

      petVaccines.forEach((vac) => {
        const date = vac.applicationDate?.split("T")[0];
        if (!date) return;

        if (!formatted[date]) formatted[date] = [];

        formatted[date].push({
          id: vac.id,
          name: vac.name,
          applied: vac.isApplied,
          status: vac.isApplied ? "Aplicada" : "Próxima dose",
        });
      });

      setEvents(formatted);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    loadVaccines();
  }, [selectedPet]);

  useFocusEffect(
    useCallback(() => {
      if (selectedPet) loadVaccines();
    }, [selectedPet])
  );

  const markedDates = {};

  Object.keys(events).forEach((date) => {
    const hasPending = events[date].some((item) => !item.applied);

    markedDates[date] = {
      marked: true,
      dotColor: hasPending ? "#F4A361" : "#47C266",
    };
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: "#F4A361",
    };
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5EA" />
        <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
            
          <Ionicons name="chevron-back" size={20} color="#2B2B2B" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Calendário</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe vacinas e próximas doses do seu pet!
          </Text>
        </View>
      </View>

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
            <Text style={styles.petName}>
              {selectedPet ? selectedPet.name : "Selecione um pet"}
            </Text>
            <Text style={styles.petBreed}>
              {selectedPet ? selectedPet.breed : ""}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-down" size={18} color="#777" />
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

            <ScrollView>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petSelectorItem,
                    selectedPet?.id === pet.id &&
                      styles.petSelectorItemActive,
                  ]}
                  onPress={() => {
                    setSelectedPet(pet);
                    setShowPetSelector(false);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.petSelectorItemName,
                        selectedPet?.id === pet.id && {
                          color: "#F49B4B",
                        },
                      ]}
                    >
                      {pet.name}
                    </Text>
                    <Text style={styles.petSelectorItemBreed}>
                      {pet.breed}
                    </Text>
                  </View>

                  {selectedPet?.id === pet.id && (
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

      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        style={styles.calendar}
        theme={{
          backgroundColor: "#FFF",
          calendarBackground: "#FFF",
          todayTextColor: "#F4A361",
          arrowColor: "#F4A361",
          selectedDayBackgroundColor: "#F4A361",
          textDayFontWeight: "600",
          textMonthFontWeight: "700",
          monthTextColor: "#333",
          textDayStyle: { color: "#333" },
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedDate || "Selecione uma data"}
        </Text>

        {selectedDate && events[selectedDate] ? (
          events[selectedDate].map((item) => (
            <View key={item.id} style={styles.eventCard}>
              <View>
                <Text style={styles.eventTitle}>{item.name}</Text>
                <Text style={styles.eventSubtitle}>{item.status}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Nenhum evento neste dia</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EA",
  },

    header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1E2D1",
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#9B9B9B",
    marginTop: 4,
  },

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

  petCard: {
    marginTop: 18,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  petInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  petImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  petName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },

  petBreed: {
    fontSize: 13,
    color: "#8E8E8E",
    marginTop: 2,
  },

  calendar: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 3,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 25,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 15,
  },

  eventCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  eventSubtitle: {
    marginTop: 4,
    color: "#777",
  },

  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
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
  },

  petSelectorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  petSelectorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },

  petSelectorItemActive: {
    backgroundColor: "#FFF0E2",
  },

  petSelectorItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },

  petSelectorItemBreed: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 4,
  },
});