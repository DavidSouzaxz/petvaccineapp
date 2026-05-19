import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MonthYearPickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
}) {
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || new Date().getMonth());

  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setSelectedMonth(value.getMonth());
    }
  }, [value, visible]);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
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
            <Text style={styles.modalTitle}>Selecione Mês e Ano</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>Confirmar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerWrapper}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Mês</Text>
              <ScrollView
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
                        selectedMonth === index && styles.pickerOptionTextSelected,
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
                        selectedYear === year && styles.pickerOptionTextSelected,
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
    borderRadius: 20,
    paddingBottom: 20,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  confirmButton: {
    fontSize: 16,
    color: "#E98B3A",
    fontWeight: "700",
  },
  pickerWrapper: {
    flexDirection: "row",
    height: 200,
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
