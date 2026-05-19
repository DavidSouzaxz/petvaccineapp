import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { calendar } from "../../constants"

export default function DatePickerModal({
  visible,
  value,
  mode = "date",
  dateMode = "past",
  onConfirm,
  onCancel,
}) {
  const getDateConstraints = () => {
    const today = new Date();

    switch (dateMode) {
      case "future":
        return { minimumDate: today, maximumDate: null };
      case "all":
        return { minimumDate: null, maximumDate: null };
      case "past":
      default:
        return { minimumDate: null, maximumDate: today };
    }
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
            <TouchableOpacity onPress={() => onConfirm(value)}>
              <Text style={styles.confirmButton}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={value}
              mode={mode}
              display="spinner"
              {...getDateConstraints()}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  onConfirm(selectedDate, true);
                }
              }}
              textColor="#2B2B2B"
            />
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
  pickerContainer: {
    alignItems: "center",
  },
});
