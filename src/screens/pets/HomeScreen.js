import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PetCard from "../../components/PetCard"; // Importando o novo componente

export default function HomeScreen({ navigation, route }) {
  const [pets, setPets] = useState([
    { id: "1", name: "Max", breed: "Golden Retriever" },
    { id: "2", name: "Bella", breed: "Poodle" },
  ]);

  // Lógica para receber novo pet da tela AddPet
  useEffect(() => {
    if (route.params?.newPet) {
      setPets((prev) => [...prev, route.params.newPet]);
    }
  }, [route.params?.newPet]);

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={(p) =>
              navigation.navigate("Details", {
                petName: p.name,
                petBreed: p.breed,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddPet")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  list: { padding: 20 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
