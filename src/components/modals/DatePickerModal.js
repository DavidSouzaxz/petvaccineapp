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

export default function DatePickerModal({
  visible,
  value,
  mode = "date",
  dateMode = "past",
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
        const optionHeight = 52; // paddingVertical(12) + paddingVertical(12) + marginVertical(4) + marginVertical(4) + fontSize height

        dayScrollRef.current?.scrollTo({
          y: (selectedDay - 1) * optionHeight,
          animated: false,
        });

        monthScrollRef.current?.scrollTo({
          y: selectedMonth * optionHeight,
          animated: false,
        });

        yearScrollRef.current?.scrollTo({
          y: (selectedYear - constraints.minYear) * optionHeight,
          animated: false,
        });
      }, 100);
    }
  }, [visible, selectedDay, selectedMonth, selectedYear]);

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
        return { minYear: 1980, maxYear: today.getFullYear() };
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const constraints = getDateConstraints();
  const years = Array.from(
    { length: constraints.maxYear - constraints.minYear + 1 },
    (_, i) => constraints.minYear + i,
  );
  const days = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1,
  );

  const handleConfirm = () => {
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

          <View style={styles.pickerWrapper}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Dia</Text>
              <ScrollView
                ref={dayScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerOption,
                      selectedDay === day && styles.pickerOptionSelected,
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedDay === day && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {day.toString().padStart(2, "0")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Mês</Text>
              <ScrollView
                ref={monthScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerOption,
                      selectedMonth === index && styles.pickerOptionSelected,
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedMonth === index &&
                          styles.pickerOptionTextSelected,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Ano</Text>
              <ScrollView
                ref={yearScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerOption,
                      selectedYear === year && styles.pickerOptionSelected,
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedYear === year &&
                          styles.pickerOptionTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingBottom: 20,
    width: "90%",
    maxHeight: "80%",
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
  modalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B2B2B",
    flex: 1,
    textAlign: "center",
  },
  cancelButton: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  confirmButton: {
    fontSize: 16,
    color: "#E98B3A",
    fontWeight: "700",
  },
  pickerWrapper: {
    flexDirection: "row",
    height: 220,
    paddingTop: 16,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    marginBottom: 8,
  },
  scrollView: {
    width: "100%",
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  pickerOptionSelected: {
    backgroundColor: "#FFF4EC",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
  pickerOptionTextSelected: {
    color: "#E98B3A",
    fontWeight: "700",
  },
});
