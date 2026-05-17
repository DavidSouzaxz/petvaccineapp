import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ServicePet from "../../services/ServicePet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonRollback from "../../components/ButtonRollback";
import { getPetImage } from "../../core/SpeciesImageMap";

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    try {
      setLoading(true);
      const data = await ServicePet.getPetsByUser(userId);
      setPets(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, []),
  );

  const goToAddPet = useCallback(() => {
    navigation.navigate("AddPet");
  }, [navigation]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Idade desconhecida";
    const years = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (years === 0) return "Menos de 1 ano";
    return `${years} ano${years > 1 ? "s" : ""}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <ButtonRollback navigation={navigation} disabled={loading} />

        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Meus Pets</Text>
        </View>
        {pets.length > 0 && (
          <Text style={styles.headerSubtitle}>
            {pets.length} {pets.length === 1 ? "companheiro" : "companheiros"}{" "}
            para cuidar
          </Text>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E98B3A" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {pets.length > 0 ? (
            <View style={styles.petList}>
              {pets.map((pet, index) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petCard,
                    index === pets.length - 1 && styles.lastCard,
                  ]}
                  onPress={() => navigation.navigate("Details", { pet })}
                  activeOpacity={0.8}
                >
                  <View style={styles.petImageContainer}>
                    <Image
                      source={getPetImage(pet.photoUrl, pet.specie)}
                      style={styles.petImage}
                    />
                  </View>

                  <View style={styles.petContent}>
                    <View style={styles.petHeader}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="#D1C4B9"
                      />
                    </View>

                    <Text style={styles.petBreed}>
                      {pet.breed || "Raça não definida"}
                    </Text>

                    <View style={styles.petMeta}>
                      <View style={styles.metaBox}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#E98B3A"
                        />
                        <Text style={styles.metaText}>
                          {calculateAge(pet.birthDate)}
                        </Text>
                      </View>
                      <View style={styles.metaDivider} />
                      <View style={styles.metaBox}>
                        <Ionicons
                          name="scale-outline"
                          size={16}
                          color="#E98B3A"
                        />
                        <Text style={styles.metaText}>
                          {pet.weight || "?"} kg
                        </Text>
                      </View>
                      <View style={styles.metaDivider} />
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              pet.status === "PENDENTE" ? "#FBE6D6" : "#E7F9F0",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusLabel,
                            {
                              color:
                                pet.status === "PENDENTE"
                                  ? "#E74C3C"
                                  : "#27AE60",
                            },
                          ]}
                        >
                          {pet.status === "PENDENTE" ? "Ativo" : "Em dia"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyIconBg}>
                  <Ionicons name="paw" size={64} color="#E98B3A" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
              <Text style={styles.emptyDescription}>
                Comece a organizar a saúde dos seus companheiros cadastrando
                seus pets e acompanhando o histórico de vacinas.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate("AddPet")}
              >
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={styles.emptyButtonText}>Adicionar Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.fab} onPress={goToAddPet}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F1",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E8DD",
    position: "relative",
  },
  headerBackButton: {
    position: "absolute",
    left: 20,
    top: 60,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#2B2B2B",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8B7A6B",
    fontWeight: "600",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  petList: {
    gap: 16,
  },
  petCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#F3E8DD",
    shadowColor: "#E98B3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  lastCard: {
    marginBottom: 20,
  },
  petImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: "#FBE6D6",
  },
  statusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  petContent: {
    flex: 1,
  },
  petHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  petName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2B2B2B",
    letterSpacing: 0.3,
  },
  petBreed: {
    fontSize: 13,
    color: "#8B7A6B",
    marginBottom: 12,
    fontWeight: "600",
  },
  petMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3E8DD",
  },
  metaBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#F3E8DD",
  },
  metaText: {
    fontSize: 12,
    color: "#2B2B2B",
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: "auto",
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 30,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FBE6D6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E98B3A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2B2B2B",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#8B7A6B",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: "500",
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E98B3A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#E98B3A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E98B3A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E98B3A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
});
