import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import ServicePet from "../../services/ServicePet";
import PetCard from "../../components/PetCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VaccineAlertCard from "../../components/VaccineAlertCard";
import ServiceVaccine from "../../services/ServiceVaccine";

export default function PetsScreen({ navigation, route }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    const userId = await AsyncStorage.getItem("@userId");

    try {
      setLoading(true);
      const data = await ServicePet.getPetsByUser(userId);
      setPets(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pets.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Seus Pets</Text>
          <Text style={styles.headerSubtitle}>
            Veja todos que você cadastrou
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4A361" />
        </View>
      ) : (
        <>
          <FlatList
            data={pets}
            key="two-columns"
            numColumns={2}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                onPress={(p) => navigation.navigate("Details", { pet: p })}
                onEdit={(p) => navigation.navigate("EditPet", { pet: p })}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum pet cadastrado.</Text>
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerGreeting: { fontSize: 24, fontWeight: "bold", color: "#333" },
  headerSubtitle: { fontSize: 16, color: "#888" },
  banner: {
    marginHorizontal: 20,
    backgroundColor: "#F4A361",
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    maxWidth: "60%",
  },
  bannerButton: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  bannerButtonText: { color: "#F4A361", fontWeight: "bold" },
  sectionHeader: { marginHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  carouselContainer: { paddingHorizontal: 10, marginBottom: 15, marginLeft: 5 },
  messageCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#FDF4E7",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    fontWeight: "500",
  },
  list: { paddingHorizontal: 10, paddingBottom: 100 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#F4A361",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
