import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // IMPORTANTE
import { Ionicons } from "@expo/vector-icons";
import VaccineItem from "../../components/VaccineItem";
import ServiceVaccine from "../../services/ServiceVaccine";

export default function DetailsScreen({ route, navigation }) {
  console.log(route.params?.pet?.vaccines);
  const { pet, petColor = "#F4A361" } = route.params;

  const [vaccines, setVaccines] = useState(route.params?.pet?.vaccines);
  const [loading, setLoading] = useState(false);

  const confirmVaccineApplication = async (item) => {
    if (item.applied) {
      Alert.alert("Informação", "Esta vacina já foi marcada como aplicada.");
      return;
    }

    try {
      await ServiceVaccine.register(item.id, { applied: true });

      setVaccines((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, applied: true } : v)),
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar status da vacina.");
    }
  };

  const loadVaccines = useCallback(async () => {
    try {
      const data = await ServiceVaccine.listAll();
      setVaccines(data);
    } catch (error) {
      console.error(error);
    }
  }, [pet.id]);

  useFocusEffect(
    useCallback(() => {
      loadVaccines();
    }, [loadVaccines]),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={petColor} />

      <View style={[styles.header, { backgroundColor: petColor }]}>
        <Text style={styles.title}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
      </View>

      <FlatList
        data={vaccines}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VaccineItem
            item={item}
            onConfirm={confirmVaccineApplication}
            petColor={petColor}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Nenhuma vacina registrada.</Text>
            </View>
          )
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: petColor }]}
        onPress={() =>
          navigation.navigate("AddVaccine", { petId: pet.id, petColor })
        }
      >
        <Text style={styles.addButtonText}>+ Registrar Nova Dose</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  breed: { fontSize: 16, color: "#fff", marginTop: 4, opacity: 0.9 },
  listPadding: { padding: 15 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  addButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
