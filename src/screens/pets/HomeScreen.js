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
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import ServicePet from "../../services/ServicePet";
import PetCard from "../../components/PetCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VaccineAlertCard from "../../components/VaccineAlertCard";
import ServiceVaccine from "../../services/ServiceVaccine";


const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 50;
const GAP = 40;
const SNAP_INTERVAL = CARD_WIDTH + GAP;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

const PET_MESSAGES = [
  {
    id: "1",
    text: "Sabia que um ronrono de gato pode ajudar a reduzir o estresse?",
    icon: "cat",
  },
  {
    id: "2",
    text: "Mantenha a água do seu pet sempre fresca, especialmente no calor!",
    icon: "tint",
  },
  {
    id: "3",
    text: "Passear diariamente ajuda na saúde mental e física do seu cão.",
    icon: "dog",
  },
  {
    id: "4",
    text: "Vacinas em dia são a maior prova de amor pelo seu melhor amigo.",
    icon: "heartbeat",
  },
];

export default function HomeScreen({ navigation, route }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [vaccines, setVaccines] = useState([])
  const isForward = useRef(true);
  const flatListRef = useRef(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const listVaccines = async () => {
    const userId = await AsyncStorage.getItem("@userId")
    try {
      const response = await ServiceVaccine.listVaccinesPendentes(userId)
      setVaccines(response)

    } catch (error) {
      console.log(error)
    }
  }


  const fetchPets = async () => {
    const userId = await AsyncStorage.getItem("@userId")

    try {
      setLoading(true);
      const data = await ServicePet.getPetsByUser(userId);
      setPets(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pets.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      listVaccines()
      fetchPets();
    }, [])
  );

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem("@userName");
      if (name) setUserName(name);
    };
    loadUserName();
    fetchPets();
    listVaccines()
  }, []);

  useEffect(() => {
    if (route.params?.newPet) fetchPets();
  }, [route.params?.newPet]);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Hi, {userName}</Text>
          <Text style={styles.headerSubtitle}>Seja Bem-vindo!</Text>
        </View>

        <TouchableOpacity onPress={() => setNotifications(!notifications)}>
          <Ionicons
            name={notifications ? "notifications" : "notifications-outline"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Join our Pet Lover Community</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Join now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lembrete</Text>
      </View>

      <View style={{ paddingBottom: 20, flexDirection: "row", flexWrap: "wrap", justifyContent: vaccines.length % 2 === 0 ? "center" : "flex-start", marginLeft: vaccines.length % 2 === 0 ? 0 : 10 }}>
        {vaccines.length > 0 ? (vaccines.map((item, index) => (
          <VaccineAlertCard key={index} vaccine={item} />
        ))) : (<Text style={{ margin: 20 }}>Nenhuma vacina pendente! 🎉</Text>)}

      </View>


      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Dicas e Curiosidades</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={PET_MESSAGES}
        horizontal
        pagingEnabled={false}
        snapToInterval={SNAP_INTERVAL}
        showsHorizontalScrollIndicator={false}

        renderItem={({ item }) => (
          <View style={[styles.messageCard, { width: CARD_WIDTH, marginRight: GAP }]}>
            <View style={styles.messageIconContainer}>
              <FontAwesome5 name={item.icon} size={20} color="#F4A361" />
            </View>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}

        contentContainerStyle={styles.carouselContainer}
      />



      <Text
        style={[
          styles.sectionTitle,
          { marginHorizontal: 20, marginBottom: 10, marginTop: 10 },
        ]}
      >
        My Pets
      </Text>
    </>
  );

  return (
    <View style={styles.container}>


      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />

      {loading ? (
        // Container para centralizar o loading
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4A361" />
        </View>) : (
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
