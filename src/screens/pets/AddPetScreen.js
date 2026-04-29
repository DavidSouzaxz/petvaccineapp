import { useState, Platform, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import ServicePet from "../../services/ServicePet";
import FormatDateDisplay from "../../core/FormatDateDisplay";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonRollback from "../../components/ButtonRollback";

export default function AddPetScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [userId, setUserId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem("@userId");
      setUserId(id);
    };

    loadUserId();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleDismiss = () => {
    setShowDatePicker(false);
  };

  const handlerSave = async () => {
    setLoading(true);
    if (!name || !breed) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    try {
      const newPet = {
        name: name,
        breed: breed,
        birthDate: birthDate.toISOString().split("T")[0],
        userId: userId,
      };

      await ServicePet.register(newPet);

      Alert.alert("Sucesso", "Pet cadastrado com sucesso!");
      navigation.navigate({
        name: "PetsHome",
        params: { newPet: true },
        merge: true,
      });
    } catch (error) {
      Alert.alert("Error", "Não foi possível registrar o pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ButtonRollback navigation={navigation} disabled={loading} />
      <Text style={styles.titlePage}>Cadastrar Pet</Text>
      <Text style={styles.label}>Nome do Pet:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Totó"
      />
      <Text style={styles.label}>Raça do Pet:</Text>
      <TextInput
        style={styles.input}
        value={breed}
        onChangeText={setBreed}
        placeholder="Ex: Douberman"
      />
      <Text style={styles.label}>Data de Nascimento:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {FormatDateDisplay(birthDate)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onValueChange={handleDateChange}
          onDismiss={handleDismiss}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handlerSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Pet</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 80 },
  titlePage: {
    textAlign: "center",
    color: "#000",
    fontSize: 30,
    paddingVertical: 10,
    paddingBottom: 30,
    fontWeight: "bold",
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#F4A361",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
    backgroundColor: "#f9f9f9",
  },
  dateButtonText: { fontSize: 16, color: "#555" },
  saveButton: {
    backgroundColor: "#F4A361",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
