import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ITEM_HEIGHT = 40;
const PICKER_HEIGHT = 180;

export default function MonthYearPickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
}) {
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const months = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    if (visible) {
      const date = value || new Date();

      const m = date.getMonth();
      const y = date.getFullYear();

      setSelectedMonth(m);
      setSelectedYear(y);

      const yearIndex = years.indexOf(y);

      setTimeout(() => {
        monthRef.current?.scrollTo({
          y: m * ITEM_HEIGHT,
          animated: false,
        });

        yearRef.current?.scrollTo({
          y: yearIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 50);
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(new Date(selectedYear, selectedMonth, 1));
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
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
            <Text style={styles.pickerLabel}>Mês</Text>
            <Text style={styles.pickerLabel}>Ano</Text>
          </View>

          
          <View style={styles.pickerWrapper}>

            
            <ScrollView
              ref={monthRef}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                );
                setSelectedMonth(index);
              }}
              contentContainerStyle={{
                paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
              }}
            >
              {months.map((month, i) => (
                <View key={i} style={styles.item}>
                  <Text style={[
                    styles.text,
                    selectedMonth === i && styles.textSelected
                  ]}>
                    {month}
                  </Text>
                </View>
              ))}
            </ScrollView>

            
            <ScrollView
              ref={yearRef}
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
              {years.map((year, i) => (
                <View key={i} style={styles.item}>
                  <Text style={[
                    styles.text,
                    selectedYear === year && styles.textSelected
                  ]}>
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
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingBottom: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE2D7",
  },

  cancelButton: {
    color: "#999",
    fontWeight: "600",
  },

  confirmButton: {
    color: "#E98B3A",
    fontWeight: "700",
  },

  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },

  pickerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
  },

  pickerWrapper: {
    flexDirection: "row",
    height: PICKER_HEIGHT,
    overflow: "hidden",
    paddingHorizontal: 20,
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