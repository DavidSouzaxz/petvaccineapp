import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
      Alert.alert("Erro", "Não foi possível carregar os pets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (route.params?.newPet) fetchPets();
  }, [route.params?.newPet]);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Hi, David!</Text>
          <Text style={styles.headerSubtitle}>Good Morning!</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View>

      {/* Banner Promocional */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Join our Pet Lover Community</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Join now</Text>
        </TouchableOpacity>
      </View>

      {/* Categorias */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Category</Text>
      </View>
      <View style={styles.categories}>
        <CategoryItem icon="paw" name="Vet" active />
        <CategoryItem icon="cut" name="Groom" />
        <CategoryItem icon="bone" name="Food" />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { marginHorizontal: 20, marginBottom: 10 },
        ]}
      >
        My Pets
      </Text>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />

      <FlatList
        data={pets}
        key="two-columns"
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={(p) => navigation.navigate("Details", { petId: p.id })}
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
    </View>
  );
}

const CategoryItem = ({ icon, name, active }) => (
  <View style={styles.categoryContainer}>
    <View style={[styles.categoryItem, active && styles.categoryItemActive]}>
      <FontAwesome5 name={icon} size={22} color={active ? "#FFF" : "#888"} />
    </View>
    <Text style={styles.categoryText}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
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
  categories: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 25,
    justifyContent: "space-between",
  },
  categoryContainer: { alignItems: "center" },
  categoryItem: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  categoryItemActive: { backgroundColor: "#F4A361", borderWidth: 0 },
  categoryText: { color: "#555", fontSize: 12 },
  list: { paddingHorizontal: 10, paddingBottom: 100 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#F4A361", // Cor do tema
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
