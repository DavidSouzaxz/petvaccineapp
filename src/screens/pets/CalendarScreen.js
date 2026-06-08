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
import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ServiceVaccine from "../../services/ServiceVaccine";
import ServicePet from "../../services/ServicePet";
import ButtonRollback from "../../components/ButtonRollback";
import MonthYearPickerModal from "../../components/modals/MonthYearPickerModal";
import { getLatestVaccines } from "../../core/GetLatestVaccines";
import "../../constants/calender";
import { SPECIES_IMAGES } from "../../constants/species";
import { useRoute } from "@react-navigation/native";

export default function CalendarioScreen({ navigation }) {
  const route = useRoute();
  const petFromRoute = route.params?.pet;
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Selecione uma data";

    const [year, month, day] = dateString.split("-");

    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
  };
  const handleMonthYearConfirm = (date) => {
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    setShowMonthYearPicker(false);
  };

  async function loadPets() {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("@userId");
      const data = await ServicePet.getPetsByUser(userId);

      setPets(data || []);
      if (petFromRoute) {
        setSelectedPet(petFromRoute);
      } else if (data?.length > 0) {
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
        (item) => item?.pet?.id === pet.id || item?.petId === pet.id,
      );

      // Obter apenas as vacinas mais recentes de cada tipo
      const latestVaccines = getLatestVaccines(petVaccines);

      const formatted = {};

      // DATA DE HOJE
      const now = new Date();
      const today = new Date().toLocaleDateString("en-CA"); //pra pegar o dia de hoje

      petVaccines.forEach((vac) => {
        // DATA DE APLICAÇÃO
        if (vac.applicationDate) {
          const date = vac.applicationDate.substring(0, 10);

          if (!formatted[date]) formatted[date] = [];

          const isLate = !vac.isApplied && date < today;
          const isPending = !vac.isApplied && date >= today;

          formatted[date].push({
            id: vac.id,
            uniqueId: `${vac.id}-${date}-applied`,
            name: vac.name || "Vacina",

            applied: vac.isApplied,
            late: isLate,
            pending: isPending,
            isNextDose: false,

            date: date,
          });
        }

        // PRÓXIMA DOSE
        if (vac.nextApplicationDate && vac.isApplied) {
          const date = vac.nextApplicationDate.substring(0, 10);

          if (!formatted[date]) formatted[date] = [];

          const isLate = date < today;

          formatted[date].push({
            id: vac.id,
            uniqueId: `${vac.id}-${date}-next`,
            name: vac.name || "Vacina",

            applied: false,
            late: isLate,

            pending: false,
            isNextDose: true,

            date: date,
          });
        }
      });

      setEvents(formatted);
      setSelectedDate(today);
    } catch (error) {
      console.log(error);
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
    }, [selectedPet]),
  );

  const markedDates = useMemo(() => {
    const marks = {};

    Object.keys(events).forEach((date) => {
      const hasLate = events[date].some((item) => item.late);
      const hasPending = events[date].some((item) => item.pending);
      const hasNextDose = events[date].some((item) => item.isNextDose);

      let dotColor = "#47C266";
      if (hasLate) dotColor = "#E74C3C";
      else if (hasPending) dotColor = "#F4A361";
      else if (hasNextDose) dotColor = "#F7D154";

      marks[date] = { marked: true, dotColor };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "#F4A361",
      };
    }

    return marks;
  }, [events, selectedDate]);

  const getToday = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const upcomingVaccines = Object.entries(events)
    .flatMap(([date, items]) => items.map((item) => ({ ...item, date })))
    .filter((item) => {
      const itemDate = new Date(item.date);

      return (
        !item.applied &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />
        <ActivityIndicator size="large" color="#F4A361" />
      </View>
    );
  }

  const renderItem = (item) => (
    <View key={item.uniqueId} style={styles.vaccineItem}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: item.applied
              ? "#E8F7EE"
              : item.late
                ? "#FDECEA"
                : item.pending
                  ? "#FFF4EC"
                  : "#FFF4EC",
          },
        ]}
      >
        <Ionicons
          name={
            item.applied
              ? "checkmark-circle"
              : item.late
                ? "alert-circle"
                : "time"
          }
          size={20}
          color={
            item.applied
              ? "#47C266"
              : item.late
                ? "#E74C3C"
                : item.isNextDose
                  ? "#F7D154" //  próxima dose
                  : "#F4A361" //  pendente
          }
        />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventSubtitle}>{formatDate(item.date)}</Text>
      </View>

      <View
        style={[
          styles.badge,
          {
            backgroundColor: item.applied
              ? "#E8F7EE"
              : item.late
                ? "#FDECEA"
                : item.isNextDose
                  ? "#FFF9E6" //  leve
                  : "#FFF4EC", //  leve
          },
        ]}
      >
        <Text
          style={{
            color: item.applied
              ? "#47C266"
              : item.late
                ? "#E74C3C"
                : item.isNextDose
                  ? "#F7D154" //  próxima dose
                  : "#F4A361", //  pendente
            fontWeight: "700",
            fontSize: 12,
          }}
        >
          {item.applied
            ? "Aplicada"
            : item.late
              ? "Atrasada"
              : item.isNextDose
                ? "Próxima dose"
                : "Pendente"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ButtonRollback
          navigation={navigation}
          disabled={loading}
          backgroundColor="transparent"
        />
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Calendário de vacinas</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <TouchableOpacity
          style={styles.petCard}
          onPress={() => setShowPetSelector(true)}
        >
          <View style={styles.petInfoRow}>
            <Image
              source={
                selectedPet?.photoUrl
                  ? { uri: selectedPet.photoUrl }
                  : SPECIES_IMAGES[selectedPet?.specie] ||
                    SPECIES_IMAGES["Cachorro"]
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

        <View style={{ position: "relative" }}>
          <Calendar
            key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
            locale="pt-br"
            current={currentDate.toLocaleDateString("en-CA")}
            onMonthChange={(m) => {
              setCurrentDate(new Date(m.year, m.month - 1, 1));
            }}
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            style={[styles.calendar, { transform: [{ scaleY: 0.94 }] }]}
            theme={{
              todayTextColor: "#F4A361",
              arrowColor: "#F4A361",
              selectedDayBackgroundColor: "#F4A361",
              selectedDayTextColor: "#FFF",
              textDayFontSize: 14,
              textMonthFontSize: 14,
              textDayHeaderFontSize: 10,
              textMonthFontWeight: "700",
            }}
          />
          <TouchableOpacity
            style={styles.calendarHeaderOverlay}
            onPress={() => {
              setShowMonthYearPicker(true);
            }}
            activeOpacity={0.7}
          />
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <Ionicons name="checkmark-circle" size={14} color="#47C266" />
            <Text style={styles.legendText}>Aplicada</Text>
          </View>

          <View style={styles.legendItem}>
            <Ionicons name="time" size={14} color="#F4A361" />
            <Text style={styles.legendText}>Pendente</Text>
          </View>

          <View style={styles.legendItem}>
            <Ionicons name="time" size={14} color="#F7D154" />
            <Text style={styles.legendText}>Próxima dose</Text>
          </View>

          <View style={styles.legendItem}>
            <Ionicons name="alert-circle" size={14} color="#E74C3C" />
            <Text style={styles.legendText}>Atrasada</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.vaccineCard}>
            <View style={styles.vaccineHeader}>
              <Text style={styles.vaccineDate}>{formatDate(selectedDate)}</Text>
              <View style={styles.vaccineBadgeTop}>
                <Text style={styles.vaccineBadgeTopText}>
                  {events[selectedDate]?.length || 0} eventos
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {events[selectedDate]?.length ? (
              events[selectedDate].map(renderItem)
            ) : (
              <Text style={styles.empty}>Nenhum evento neste dia</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.vaccineCard}>
            <View style={styles.vaccineHeader}>
              <Text style={styles.vaccineDate}>Próximas doses</Text>
            </View>

            {upcomingVaccines.length ? (
              upcomingVaccines.map(renderItem)
            ) : (
              <Text style={styles.empty}>Nenhuma próxima dose</Text>
            )}
          </View>
        </View>
      </ScrollView>

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
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedPet(pet);
                    setShowPetSelector(false);
                  }}
                >
                  <View style={styles.petSelectorItemContent}>
                    <Image
                      source={
                        pet.photoUrl
                          ? { uri: pet.photoUrl }
                          : SPECIES_IMAGES[pet.specie] ||
                            SPECIES_IMAGES["Cachorro"]
                      }
                      style={styles.petSelectorItemImage}
                    />
                    <View>
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
                        {pet.breed || "Sem raça"}
                      </Text>
                    </View>
                  </View>

                  {selectedPet && selectedPet.id === pet.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#F4A361"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <MonthYearPickerModal
        visible={showMonthYearPicker}
        value={currentDate}
        onConfirm={handleMonthYearConfirm}
        onCancel={() => setShowMonthYearPicker(false)}
      />
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

  headerBox: {
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#f3e8dd98",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B2B2B",
  },

  petCard: {
    marginTop: 20,
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
  },

  calendar: {
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 2,
  },

  calendarHeaderOverlay: {
    position: "absolute",

    top: 20,
    left: 145,
    right: 100,
    height: 45,
    width: 100,
    zIndex: 10,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  vaccineCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
  },

  vaccineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  vaccineDate: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  vaccineBadgeTop: {
    backgroundColor: "#FFF4EC",
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  vaccineBadgeTopText: {
    color: "#F4A361",
    fontWeight: "600",
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },

  vaccineItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  eventTitle: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },

  eventSubtitle: {
    fontSize: 13,
    color: "#777",
  },

  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
  },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
    gap: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendText: {
    color: "#000",
    marginLeft: 4,
    fontSize: 9,
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
    flexDirection: "row",
    alignItems: "center",
  },

  petSelectorItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  petSelectorItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },

  petSelectorItemNameActive: {
    color: "#F4A361",
  },

  petSelectorItemBreed: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 4,
  },
});
