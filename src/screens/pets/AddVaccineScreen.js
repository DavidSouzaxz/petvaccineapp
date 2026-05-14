import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AlertModal } from "../../components/modals";
import ServiceVaccine from "../../services/ServiceVaccine";
import ButtonRollback from "../../components/ButtonRollback";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { validateDate, validateTime } from "../../core/validators";
import InputDatePicker from "../../components/InputDatePicker";
import InputTimePicker from "../../components/InputTimePicker";

export default function AddVaccineScreen({ navigation, route }) {
  const { petId, petName, petColor } = route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [observations, setObservations] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Limpar modal quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      return () => {
        setAlertVisible(false);
      };
    }, []),
  );

  const vaccineSuggestions = [
    "Antirrábica",
    "V10",
    "V8",
    "Gripe Canina",
    "Giárdia",
    "Leishmaniose",
    "V4 Felina",
    "Leucemia Felina",
    "Raiva",
    "Outra...",
  ];

  const handleSuggestion = (suggestion) => {
    setName(suggestion === "Outra..." ? "" : suggestion);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!name || !date || !time) {
      setAlertMessage("Preencha o nome, data e hora.");
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    const isoDateTime = `${date}T${time}:00`;

    const newVaccine = {
      petId: petId,
      name: name,
      applicationDate: isoDateTime,
      isApplied: isApplied,
      reminder: reminder,
      observations: observations,
    };

    try {
      await ServiceVaccine.register(newVaccine);
      setAlertMessage("Vacina cadastrada!");
      setAlertVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setAlertMessage("Ocorreu um erro ao registrar a vacina.");
      setAlertVisible(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 35 }}>
          <ButtonRollback navigation={navigation} disabled={loading} />
        </View>
        <View style={styles.headerBox}>
          <FontAwesome6
            name="syringe"
            size={32}
            color="#F4A361"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.headerText}>Adicionar Vacina</Text>
          <Text style={styles.petNameText}>
            para{" "}
            <Text style={{ color: petColor || "#F4A361", fontWeight: "bold" }}>
              {petName}
            </Text>
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.togglesRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsApplied(!isApplied)}
            >
              <Ionicons
                name={isApplied ? "checkbox" : "checkbox-outline"}
                size={24}
                color={isApplied ? "#4CAF50" : "#B9B1A9"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.checkboxLabel,
                  { color: isApplied ? "#4CAF50" : "#B9B1A9" },
                ]}
              >
                Aplicada
              </Text>
            </TouchableOpacity>
            {/* <View style={styles.toggleBox}>
            <Switch
              trackColor={{ false: "#B9B1A9", true: "#1976D2" }}
              thumbColor={reminder ? "#fff" : "#f4f3f4"}
              onValueChange={() => setReminder((v) => !v)}
              value={reminder}
              style={styles.toggleSwitch}
            />
            <Text
              style={[
                styles.toggleLabel,
                { color: reminder ? "#1976D2" : "#B9B1A9" },
              ]}
            >
              {reminder ? "Lembrete ativado" : "Sem lembrete"}
            </Text>
          </View> */}
          </View>
          <Text style={styles.label}>Nome da Vacina</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFF9F4",
              borderWidth: 1,
              borderColor: "#EFE2D7",
              borderRadius: 12,
              paddingHorizontal: 12,
              marginBottom: 14,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowSuggestions(!showSuggestions)}
              style={{ paddingRight: 8 }}
            >
              <Ionicons name="list" size={22} color="#F4A361" />
            </TouchableOpacity>
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 10,
                fontSize: 15,
                color: "#2B2B2B",
              }}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setShowSuggestions(text.length === 0);
              }}
              placeholder="Ex: Antirrábica, V10..."
              placeholderTextColor="#B9B1A9"
              onFocus={() => setShowSuggestions(true)}
            />
          </View>
          {showSuggestions && (
            <View style={styles.suggestionBox}>
              {vaccineSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <InputDatePicker
                label="Data da Aplicação"
                value={date}
                onChange={(val) => setDate(val)}
                styleLabel={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#9A948E",
                  marginBottom: 6,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputTimePicker
                label="Horário"
                value={time}
                onChange={(val) => setTime(val)}
                styleLabel={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#9A948E",
                  marginBottom: 6,
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <InputDatePicker
                label="Data para Proxima"
                value={date}
                onChange={(val) => setDate(val)}
                styleLabel={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#9A948E",
                  marginBottom: 6,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputTimePicker
                label="Horário"
                value={time}
                onChange={(val) => setTime(val)}
                styleLabel={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#9A948E",
                  marginBottom: 6,
                }}
              />
            </View>
          </View>

          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={observations}
            onChangeText={setObservations}
            placeholder="Detalhes adicionais..."
            placeholderTextColor="#B9B1A9"
            multiline
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar na Carteirinha</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F1", padding: 0 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  headerBox: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F4A361",
    marginBottom: 2,
    textAlign: "center",
  },
  petNameText: {
    fontSize: 15,
    color: "#2B2B2B",
    marginBottom: 8,
    textAlign: "center",
  },
  togglesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 32,
    marginTop: 10,
    marginBottom: 10,
  },
  toggleBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 0,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3E8DD",
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#9A948E", marginBottom: 6 },
  input: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#2B2B2B",
    marginBottom: 14,
  },
  suggestionBox: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    marginBottom: 10,
    marginTop: -8,
    paddingVertical: 4,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  suggestionText: {
    color: "#2B2B2B",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#F4A361",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  cancelButton: { marginTop: 15, padding: 10, alignItems: "center" },
  cancelButtonText: { color: "#E14C4C", fontSize: 14 },
});
