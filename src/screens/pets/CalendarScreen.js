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
import { SPECIES_OPTIONS, SPECIES_IMAGES } from "../../constants/species";

export default function CalendarioScreen({ navigation }) {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [image, setImage] = useState(null);

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
  console.log("Clicado");
  setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  setShowMonthYearPicker(false);
};

  async function loadPets() {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("@userId");
      const data = await ServicePet.getPetsByUser(userId);

      setPets(data || []);
      if (data?.length > 0) setSelectedPet(data[0]);
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
    const today = new Date().toLocaleDateString("en-CA");     //pra pegar o dia de hoje

    
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
      const hasNextDose = events[date].some((item) => item.isNextDose);;

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
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.topBar}>
          <ButtonRollback
            navigation={navigation}
            backgroundColor="#FFF"
            color="#B56A2B"
          />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Calendário de vacinas</Text>
          </View>
          <View style={styles.titleDivider} />
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
              console.log("Clicado no header do calendar");
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

      <Modal visible={showPetSelector} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowPetSelector(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um pet</Text>

            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.petOption,
                  selectedPet?.id === pet.id && styles.petOptionActive,
                ]}
                onPress={() => {
                  setSelectedPet(pet);
                  setShowPetSelector(false);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={
                      pet.photoUrl
                        ? { uri: pet.photoUrl }
                        : SPECIES_IMAGES[pet.specie] ||
                        SPECIES_IMAGES["Cachorro"]
                    }
                    style={styles.petOptionImage}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.petOptionText}>{pet.name}</Text>
                    <Text style={styles.petOptionBreed}>
                      {pet.breed || "Sem raça"}
                    </Text>
                  </View>
                </View>

                {selectedPet?.id === pet.id && (
                  <Ionicons name="checkmark-circle" size={22} color="#F4A361" />
                )}
              </TouchableOpacity>
            ))}
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

  topBar: {
    paddingTop: 58,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 58,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2F2F2F",
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
    marginLeft: 4,
    fontSize: 9,
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
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  petOptionActive: {
    backgroundColor: "#FFF4EC",
    borderRadius: 12,
  },

  petOptionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  petOptionText: {
    fontSize: 15,
    fontWeight: "700",
  },

  petOptionBreed: {
    fontSize: 12,
    color: "#9E948C",
  },
});
