import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import VaccineItem from "../../components/VaccineItem";

export default function DetailsScreen({ route, navigation }) {
  const { petName, petBreed } = route.params;

  const [vaccines, setVaccines] = useState([
    { id: "1", name: "Antirrábica", date: "10/01/2026", applied: true },
    { id: "2", name: "V10", date: "15/02/2026", applied: false },
    { id: "3", name: "Gripe Canina", date: "20/03/2026", applied: true },
  ]);

  // Captura nova vacina vinda do formulário
  useEffect(() => {
    if (route.params?.newVaccine) {
      setVaccines((prev) => {
        const exists = prev.find((v) => v.id === route.params.newVaccine.id);
        if (exists) return prev;
        return [...prev, route.params.newVaccine];
      });
    }
  }, [route.params?.newVaccine]);

  // Regra de negócio: Confirmar aplicação
  const confirmVaccineApplication = (item) => {
    if (item.applied) {
      Alert.alert("Informação", "Esta vacina já foi marcada como aplicada.");
      return;
    }

    Alert.alert(
      "Confirmar Vacinação",
      `Deseja marcar a vacina "${item.name}" como aplicada?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            setVaccines((prev) =>
              prev.map((v) => (v.id === item.id ? { ...v, applied: true } : v)),
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carteira de: {petName}</Text>
        <Text style={styles.breed}>Raça: {petBreed}</Text>
      </View>

      <FlatList
        data={vaccines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <VaccineItem item={item} onConfirm={confirmVaccineApplication} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma vacina registrada.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddVaccine", { petName })}
      >
        <Text style={styles.addButtonText}>Registrar Nova Dose</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    padding: 20,
    backgroundColor: "#F4A361",
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  breed: { fontSize: 16, color: "#e0e0e0", marginTop: 4 },
  listPadding: { padding: 15 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  addButton: {
    backgroundColor: "#F4A361",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
