import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import ServiceVaccine from "../../services/ServiceVaccine";
import ButtonRollback from "../../components/ButtonRollback"

export default function AddVaccineScreen({ navigation, route }) {
  const { petId, petName, petColor } = route.params;
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [observations, setObservations] = useState("");


  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDate(formatted);
  };

  // Máscara para Hora (HH:mm)
  const handleTimeChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    setTime(formatted);
  };

  const handleSave = async () => {
    setLoading(true)
    if (!name || !date || !time) {
      Alert.alert("Atenção", "Preencha o nome, data e hora.");
      return;
    }

    // Conversão para o padrão ISO do Backend (yyyy-MM-ddTHH:mm:ss)
    const [day, month, year] = date.split("/");
    const [hour, minute] = time.split(":");
    const isoDateTime = `${year}-${month}-${day}T${hour}:${minute}:00`;

    const newVaccine = {
      petId: petId,
      name: name,
      applicationDate: isoDateTime,
      isApplied: false,
      observations: observations,
    };

    try {
      await ServiceVaccine.register(newVaccine);
      Alert.alert("Sucesso", "Vacina cadastrada!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Ocorreu um erro ao registrar a vacina.");
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <ButtonRollback navigation={navigation} />
      <Text style={styles.headerText}>Registrar Vacina {petName}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome da Vacina</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Antirrábica, V10..."
          placeholderTextColor="#999"
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={handleDateChange}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={observations}
          onChangeText={setObservations}
          placeholder="Detalhes adicionais..."
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar na Carteira</Text>
          )}

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 90 },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F4A361",
    marginBottom: 30,
    textAlign: "center",
  },
  form: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#F4A361",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: { marginTop: 15, padding: 10, alignItems: "center" },
  cancelButtonText: { color: "#FF3B30", fontSize: 14 },
});
