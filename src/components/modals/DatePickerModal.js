import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { calendar } from "../../constants";

const ITEM_HEIGHT = 40;
const PICKER_HEIGHT = 180;

export default function DatePickerModal({
  visible,
  value,
  mode = "date",
  dateMode = "past",
  excludeToday = false,
  onConfirm,
  onCancel,
}) {
  const [selectedDay, setSelectedDay] = useState(
    value?.getDate() || new Date().getDate(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    value?.getMonth() || new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState(
    value?.getFullYear() || 2026,
  );

  const dayScrollRef = useRef(null);
  const monthScrollRef = useRef(null);
  const yearScrollRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedDay(value.getDate());
      setSelectedMonth(value.getMonth());
      setSelectedYear(value.getFullYear());
    }
  }, [value, visible]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const optionHeight = ITEM_HEIGHT;

        dayScrollRef.current?.scrollTo({
          y: (selectedDay - 1) * optionHeight,
          animated: false,
        });

        // Calcular índice do mês nas meses permitidos
        const maxMonthInYear = getMaxMonthInYear(selectedYear);
        const permittedMonthsList = months.slice(0, maxMonthInYear + 1);
        const monthIndex = permittedMonthsList.indexOf(months[selectedMonth]);

        monthScrollRef.current?.scrollTo({
          y: monthIndex >= 0 ? monthIndex * optionHeight : selectedMonth * optionHeight,
          animated: false,
        });

        yearScrollRef.current?.scrollTo({
          y: (selectedYear - constraints.minYear) * optionHeight,
          animated: false,
        });
      }, 100);
    }
  }, [visible, selectedDay, selectedMonth, selectedYear]);

  // Validar e ajustar mês se necessário quando ano muda
  useEffect(() => {
    const maxMonthInYear = getMaxMonthInYear(selectedYear);
    if (selectedMonth > maxMonthInYear) {
      setSelectedMonth(maxMonthInYear);
    }
  }, [selectedYear]);

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const getDateConstraints = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (dateMode) {
      case "future":
        return {
          minYear: today.getFullYear(),
          maxYear: today.getFullYear() + 50,
        };
      case "all":
        return { minYear: 1980, maxYear: today.getFullYear() + 50 };
      case "past":
      default:
        const maxYear = excludeToday ? yesterday.getFullYear() : today.getFullYear();
        return { minYear: 1980, maxYear };
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMaxMonthInYear = (year) => {
    if (!excludeToday) return 11; // Todos os 12 meses (0-11)

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (year === today.getFullYear()) {
      return yesterday.getMonth(); // Máximo é o mês anterior (ou o mês atual se o dia for maior que 1)
    }

    return 11; // Anos anteriores permitem todos os meses
  };

  const getMaxDayInMonth = (month, year) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
    const isYesterdayMonth = month === yesterday.getMonth() && year === yesterday.getFullYear();

    if (excludeToday && isCurrentMonth) {
      // Permite dias até ontem (dia anterior ao atual)
      return today.getDate() - 1;
    }

    if (excludeToday && isYesterdayMonth && isCurrentMonth === false) {
      // Se for um mês anterior ao atual
      return yesterday.getDate();
    }

    return getDaysInMonth(month, year);
  };

  const constraints = getDateConstraints();
  const years = Array.from(
    { length: constraints.maxYear - constraints.minYear + 1 },
    (_, i) => constraints.minYear + i,
  );

  // Filtrar meses permitidos
  const maxMonthInYear = getMaxMonthInYear(selectedYear);
  const permittedMonths = months.slice(0, maxMonthInYear + 1);

  const days = Array.from(
    { length: getMaxDayInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1,
  );

  const handleConfirm = () => {
    // Validar se a data é permitida
    if (excludeToday) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

      if (selectedDate > yesterday) {
        // Se a data selecionada é futura ou hoje, ajustar para ontem
        onConfirm(yesterday);
        return;
      }
    }

    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onConfirm(newDate);
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>Confirmar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.labelsRow}>
            <Text style={styles.pickerLabel}>Dia</Text>
            <Text style={styles.pickerLabel}>Mês</Text>
            <Text style={styles.pickerLabel}>Ano</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <ScrollView
              ref={dayScrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                );
                setSelectedDay(index + 1);
              }}
              contentContainerStyle={{
                paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
              }}
            >
              {days.map((day) => (
                <View key={day} style={styles.item}>
                  <Text
                    style={[
                      styles.text,
                      selectedDay === day && styles.textSelected,
                    ]}
                  >
                    {day.toString().padStart(2, "0")}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              ref={monthScrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                );
                if (index < permittedMonths.length) {
                  setSelectedMonth(months.indexOf(permittedMonths[index]));
                }
              }}
              contentContainerStyle={{
                paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
              }}
            >
              {permittedMonths.map((month, index) => (
                <View key={month} style={styles.item}>
                  <Text
                    style={[
                      styles.text,
                      selectedMonth === months.indexOf(month) && styles.textSelected,
                    ]}
                  >
                    {month}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              ref={yearScrollRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                );
                setSelectedYear(years[index]);
              }}
              contentContainerStyle={{
                paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
              }}
            >
              {years.map((year) => (
                <View key={year} style={styles.item}>
                  <Text
                    style={[
                      styles.text,
                      selectedYear === year && styles.textSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.centerHighlight} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.44)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingBottom: 20,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE2D7",
  },
  cancelButton: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
  confirmButton: {
    fontSize: 16,
    color: "#E98B3A",
    fontWeight: "700",
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginHorizontal: 20,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    flex: 1,
    textAlign: "center",
  },
  pickerWrapper: {
    flexDirection: "row",
    height: PICKER_HEIGHT,
    overflow: "hidden",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#999",
  },
  textSelected: {
    color: "#E98B3A",
    fontWeight: "700",
  },
  centerHighlight: {
    position: "absolute",
    top: (PICKER_HEIGHT / 2) - (ITEM_HEIGHT / 2),
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    backgroundColor: "#FFF4EC",
    borderRadius: 10,
    zIndex: -1,
  },
});
