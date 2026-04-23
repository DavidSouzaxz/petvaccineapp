import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // IMPORTANTE
import { Ionicons } from "@expo/vector-icons";
import VaccineItem from "../../components/VaccineItem";
import ServiceVaccine from "../../services/ServiceVaccine";
import ButtonRollback from "../../components/ButtonRollback";

export default function DetailsScreen({ route, navigation }) {
  console.log(route.params?.pet?.vaccines);
  const { pet, petColor = "#F4A361" } = route.params;

  const [vaccines, setVaccines] = useState(route.params?.pet?.vaccines);
  const [loading, setLoading] = useState(false);

  const confirmVaccineApplication = async (item) => {

    setLoading(true);

    try {

      await ServiceVaccine.vaccineIsApplied(item.id);

      // Recarrega os dados após sucesso
      await loadVaccines();

      Alert.alert("Sucesso", "Vacina marcada como aplicada!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao atualizar status da vacina.");
    } finally {
      setLoading(false);
    }
  };

  const loadVaccines = useCallback(async () => {
    setLoading(true)
    try {
      const data = await ServiceVaccine.listAll();
      setVaccines(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
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
      {loading ? (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4A361" />
      </View>) : (
        <>
          <View style={[styles.header, { backgroundColor: petColor }]}>
            <ButtonRollback navigation={navigation} backgroundColor="#f0b98c" color="#6f421d" disabled={loading} />
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
        </>

      )
      }

    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingTop: 80,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
