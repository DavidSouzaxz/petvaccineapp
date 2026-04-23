import { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator
} from "react-native";
import ServicePet from "../../services/ServicePet";
import { Ionicons } from "@expo/vector-icons";
import ButtonRollback from "../../components/ButtonRollback";

export default function EditPetScreen({ navigation, route }) {
  const editingPet = route.params?.pet;
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(editingPet?.name ?? "");
  const [breed, setBreed] = useState(editingPet?.breed ?? "");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleDelete = () => {
    Alert.alert(
      "Excluir Pet",
      `Tem certeza que deseja excluir ${editingPet?.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await ServicePet.delete(editingPet.id);
              Alert.alert("Sucesso", "Pet excluído com sucesso!");
              navigation.navigate("Home", { newPet: true });
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o pet.");
            }
          },
        },
      ],
    );
  };

  const handlerSave = async () => {
    setLoading(true)
    if (!name || !breed) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const petAtualizado = {
        name,
        breed,
        birthDate: editingPet.birthDate,
        userId: editingPet.userId,
      };

      await ServicePet.update(editingPet.id, petAtualizado);

      Alert.alert("Sucesso", "Pet atualizado com sucesso!");
      navigation.navigate({
        name: "Home",
        params: { newPet: true },
        merge: true,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o pet.");
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <ButtonRollback navigation={navigation} />
      <Text style={styles.titlePage}>Edição de Pet</Text>
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
        placeholder="Ex: Dobermann"
      />

      <TouchableOpacity style={styles.button} onPress={handlerSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (

          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 80 },
  titlePage: { textAlign: "center", color: "#000", fontSize: 30, paddingVertical: 10, paddingBottom: 30, fontWeight: "bold" },
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
  deleteButton: {
    marginRight: 12,
  },

  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
});
