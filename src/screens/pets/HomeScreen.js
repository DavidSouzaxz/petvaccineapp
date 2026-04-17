import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ServicePet from "../../services/ServicePet";
import PetCard from "../../components/PetCard";

export default function HomeScreen({ navigation, route }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await ServicePet.listAll();
      setPets(data);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os pets. Verifique a conexão com o servidor.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (route.params?.newPet) {
      fetchPets();
    }
  }, [route.params?.newPet]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando seus pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        key="two-columns"
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={(p) =>
              navigation.navigate("Details", {
                petId: p.id,
                petName: p.name,
                petBreed: p.breed,
              })
            }
            onEdit={(p) => navigation.navigate("EditPet", { pet: p })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>
        }
        onRefresh={fetchPets}
        refreshing={loading}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" }, // Estilo para o loading
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
