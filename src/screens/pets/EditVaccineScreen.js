import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import ServiceVaccine from "../../services/ServiceVaccine";
import ButtonRollback from "../../components/ButtonRollback";
import { validateDate, validateTime } from "../../core/validators";

const parseDateTime = (value) => {
  if (!value) return { date: "", time: "" };
  const normalized = value.replace(" ", "T");
  const dateObj = new Date(normalized);

  if (!Number.isNaN(dateObj.getTime())) {
    const pad = (num) => String(num).padStart(2, "0");
    return {
      date: `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`,
      time: `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`,
    };
  }

  const [datePart, timePart] = normalized.split("T");
  if (datePart && datePart.includes("-")) {
    const [year, month, day] = datePart.split("-");
    return {
      date: `${day}/${month}/${year}`,
      time: timePart ? timePart.slice(0, 5) : "",
    };
  }

  return { date: "", time: "" };
};

export default function EditVaccineScreen({ navigation, route }) {
  const { vaccine, petId, petName, petColor } = route.params;
  const initialDateTime = useMemo(
    () => parseDateTime(vaccine?.applicationDate),
    [vaccine?.applicationDate],
  );

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(vaccine?.name || "");
  const [date, setDate] = useState(initialDateTime.date);
  const [time, setTime] = useState(initialDateTime.time);
  const [isApplied, setIsApplied] = useState(!!vaccine?.isApplied);
  const [observations, setObservations] = useState(vaccine?.observations || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reminder, setReminder] = useState(!!vaccine?.reminder);

  const vaccineSuggestions = [
    "Antirrabica",
    "V10",
    "V8",
    "Gripe Canina",
    "Giardia",
    "Leishmaniose",
    "V4 Felina",
    "Leucemia Felina",
    "Raiva",
    "Outra...",
  ];

  const toggleSwitch = () => setIsApplied((previousState) => !previousState);

  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDate(formatted);
  };

  const handleTimeChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    setTime(formatted);
  };

  const handleSuggestion = (suggestion) => {
    setName(suggestion === "Outra..." ? "" : suggestion);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!name || !date || !time) {
      Alert.alert("Atencao", "Preencha o nome, data e hora.");
      return;
    }

    const dateError = validateDate(date);
    const timeError = validateTime(time);

    if (dateError) {
      Alert.alert("Erro na Data", dateError);
      return;
    }
    if (timeError) {
      Alert.alert("Erro na Hora", timeError);
      return;
    }

    setLoading(true);

    const [day, month, year] = date.split("/");
    const [hour, minute] = time.split(":");
    const isoDateTime = `${year}-${month}-${day}T${hour}:${minute}:00`;

    const updatedVaccine = {
      petId: petId,
      name: name,
      applicationDate: isoDateTime,
      isApplied: isApplied,
      reminder: reminder,
      observations: observations,
    };

    try {
      await ServiceVaccine.update(vaccine.id, updatedVaccine);
      Alert.alert("Sucesso", "Vacina atualizada!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao atualizar a vacina.");
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
        <ButtonRollback navigation={navigation} disabled={loading} />
        <View style={styles.headerBox}>
          <FontAwesome6
            name="syringe"
            size={32}
            color="#F4A361"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.headerText}>Editar Vacina</Text>
          <Text style={styles.petNameText}>
            para{" "}
            <Text style={{ color: petColor || "#F4A361", fontWeight: "bold" }}>
              {petName || "pet"}
            </Text>
          </Text>
        </View>

        <View style={styles.togglesRow}>
          <View style={styles.toggleBox}>
            <Switch
              trackColor={{ false: "#FFD9B3", true: "#F4A361" }}
              thumbColor={isApplied ? "#fff" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isApplied}
              style={styles.toggleSwitch}
            />
            <Text
              style={[
                styles.toggleLabel,
                { color: isApplied ? "#4CAF50" : "#FF9800" },
              ]}
            >
              {isApplied ? "Aplicada" : "Nao Aplicada"}
            </Text>
          </View>
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

        <View style={styles.card}>
          <Text style={styles.label}>Nome da Vacina</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setShowSuggestions(text.length === 0);
              }}
              placeholder="Ex: Antirrabica, V10..."
              placeholderTextColor="#B9B1A9"
              onFocus={() => setShowSuggestions(true)}
            />
            <TouchableOpacity
              onPress={() => setShowSuggestions(!showSuggestions)}
            >
              <Ionicons
                name="list"
                size={22}
                color="#F4A361"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
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
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#B9B1A9"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Hora</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={handleTimeChange}
                placeholder="HH:mm"
                placeholderTextColor="#B9B1A9"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>

          <Text style={styles.label}>Observacoes</Text>
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
              <Text style={styles.buttonText}>Salvar Alteracoes</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F1", padding: 0 },
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
    justifyContent: "center",
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
  toggleSwitch: {
    marginBottom: 0,
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
