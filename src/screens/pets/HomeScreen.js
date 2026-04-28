import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Image,
  ScrollView, // Adicionado para substituir o FlatList principal
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ServiceVaccine from "../../services/ServiceVaccine";
import VaccineAlertCard from "../../components/VaccineAlertCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const GAP = 20;
const SNAP_INTERVAL = CARD_WIDTH + GAP;
const SIDE_PADDING = 20;

const PET_MESSAGES = [
  {
    id: "1",
    text: "Sabia que um ronrono de gato pode ajudar a reduzir o estresse?",
    icon: "cat",
  },
  { id: "2", text: "Mantenha a água do seu pet sempre fresca!", icon: "tint" },
  {
    id: "3",
    text: "Passear diariamente ajuda na saúde mental do seu cão.",
    icon: "dog",
  },
  {
    id: "4",
    text: "Vacinas em dia são a maior prova de amor.",
    icon: "heartbeat",
  },
];

export default function HomeScreen({ navigation }) {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState(false);

  const listVaccines = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    try {
      setLoading(true);
      const response = await ServiceVaccine.listVaccinesPendentes(userId);
      setVaccines(response);
    } catch (error) {
      console.log("Erro ao buscar vacinas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      listVaccines();
    }, []),
  );

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem("@userName");
      if (name) setUserName(name);
    };
    loadUserName();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />

      {/* Header Fixo */}
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4A361" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner */}
          <View style={styles.banner}>
            <Image
              source={require("../../../assets/petcard.png")}
              style={styles.cardImage}
            />
          </View>

          <Text style={styles.sectionTitle}>Lembrete</Text>
          <View style={styles.vaccineContainer}>
            {vaccines.length > 0 ? (
              vaccines.map((item, index) => (
                <VaccineAlertCard key={index} vaccine={item} />
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma vacina pendente! 🎉</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Dicas e Curiosidades</Text>
          <FlatList
            data={PET_MESSAGES}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            contentContainerStyle={{
              paddingHorizontal: SIDE_PADDING,
              paddingBottom: 20,
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageCard,
                  { width: CARD_WIDTH, marginRight: GAP },
                ]}
              >
                <View style={styles.messageIconContainer}>
                  <FontAwesome5 name={item.icon} size={20} color="#F4A361" />
                </View>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerGreeting: { fontSize: 24, fontWeight: "bold", color: "#333" },
  headerSubtitle: { fontSize: 16, color: "#888" },
  banner: { alignItems: "center", marginVertical: 15 },
  cardImage: { width: width - 40, height: 200, borderRadius: 20, elevation: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  vaccineContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  messageCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EEE",
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
  messageText: { flex: 1, fontSize: 13, color: "#666", fontWeight: "500" },
  emptyText: { margin: 20, color: "#999", fontStyle: "italic" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
