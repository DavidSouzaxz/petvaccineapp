import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import FormatDateDisplay, {
  FormatDateForRequisition,
} from "../core/FormatDateDisplay";
import DatePickerModal from "./modals/DatePickerModal";

export default function InputDatePicker({
  label,
  value,
  onChange,
  styleLabel,
  dateMode = "past",
}) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  const getDateConstraints = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (dateMode) {
      case "future":
        return { minimumDate: today, maximumDate: null };
      case "all":
        return { minimumDate: null, maximumDate: null };
      case "yesterday":
        return { minimumDate: null, maximumDate: yesterday };
      case "past":
      default:
        return { minimumDate: null, maximumDate: today };
    }
  };

  const getDateValue = () => {
    if (!value || typeof value !== "string") return new Date();

    try {
      const cleanValue = value.trim().split(" ")[0].split("T")[0];

      let year, month, day;

      if (cleanValue.includes("/")) {
        [day, month, year] = cleanValue.split("/").map(Number);
      } else if (cleanValue.includes("-")) {
        [year, month, day] = cleanValue.split("-").map(Number);
      } else {
        return new Date();
      }

      if (!year || !month || !day) return new Date();

      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const displayDate = FormatDateDisplay(selectedDate);
      const backendDate = FormatDateForRequisition(displayDate);
      onChange(backendDate, displayDate);
      setShow(false);
    }
  };

  const handleConfirmDate = (date, isSpinner = false) => {
    if (isSpinner) {
      setTempDate(date);
    } else {
      const displayDate = FormatDateDisplay(date);
      const backendDate = FormatDateForRequisition(displayDate);
      onChange(backendDate, displayDate);
      setShow(false);
      setTempDate(null);
    }
  };

  const handleCancelDate = () => {
    setShow(false);
    setTempDate(null);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, styleLabel]}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={[styles.value, !value && { color: "#B9B1A9" }]}>
          {value ? value.split("-").reverse().join("/") : "00/00/0000"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#E98B3A" />
      </TouchableOpacity>

      <DatePickerModal
        visible={show}
        value={tempDate || getDateValue()}
        mode="date"
        dateMode={dateMode}
        excludeToday={dateMode === "yesterday"}
        onConfirm={handleConfirmDate}
        onCancel={handleCancelDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "700", color: "#444", marginBottom: 8 },
  input: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: { fontSize: 15, color: "#2B2B2B" },
});
