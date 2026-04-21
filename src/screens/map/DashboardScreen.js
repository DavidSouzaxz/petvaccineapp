import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getNearbyClinics } from "../../services/ServiceMap";
import CardClinic from "../../components/CardClinic";
import OpenGoogleMaps from "../../core/OpenGoogleMaps"; // Import corrigido

export default function DashboardScreen({ navigation }) {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      const cachedData = await AsyncStorage.getItem("last_clinics_data");
      let shouldFetch = true;

      if (cachedData) {
        const { lat, lon, clinics } = JSON.parse(cachedData);
        const dist = calculateDistance(latitude, longitude, lat, lon);

        if (dist < 5) {
          console.log("CACHE UTILIZADO. Distância: " + dist.toFixed(2) + "km");
          setMarkers(clinics);
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        console.log("BUSCANDO NOVOS DADOS NA API...");
        try {
          const clinics = await getNearbyClinics(latitude, longitude);
          setMarkers(clinics);

          await AsyncStorage.setItem(
            "last_clinics_data",
            JSON.stringify({ lat: latitude, lon: longitude, clinics: clinics }),
          );
        } catch (error) {
          console.error("Erro ao buscar clínicas:", error);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4E7" />
      <View style={styles.header}>
        <Text style={styles.greeting}>Clínicas</Text>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Image
            source={require("../../../assets/golden.png")}
            style={styles.cardImage}
          />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Veterinários mais próximos</Text>
            <Text style={styles.bannerSubTitle}>
              Facilitando a busca por médicos!
            </Text>
            {/* <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Buscar</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mapa & Localizações</Text>
          <TouchableOpacity onPress={() => navigation.navigate("FullMap")}>
            <Text style={styles.seeAllText}>Expandir</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.mapPreview}
          onPress={() => navigation.navigate("FullMap")}
        >
          <MapView
            style={styles.map}
            region={region}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            pointerEvents="none"
          >
            {markers.map((m) => (
              <Marker
                key={m.id}
                coordinate={{ latitude: m.lat, longitude: m.lon }}
                pinColor="#F4A361"
              />
            ))}
          </MapView>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Clinicas Recentes</Text>
        </View>
        <View style={styles.clinicsList}>
          {markers.length > 0 ? (
            markers.map((m) => (
              <CardClinic
                key={m.id}
                clinic={m}
                onPress={() => OpenGoogleMaps(m)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Buscando clínicas...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },
  header: {
    padding: 30,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 24, fontWeight: "bold" },
  banner: {
    marginHorizontal: 20,
    backgroundColor: "#F4A361",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#4b3009",
  },
  bannerText: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cardImage: { width: 70, height: 70 },
  bannerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  bannerSubTitle: { color: "#4b3009", fontSize: 12, fontWeight: "light" },
  bannerButton: {
    backgroundColor: "#FFF",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: 80,
    alignItems: "center",
  },
  bannerButtonText: { color: "#F4A361", fontWeight: "bold" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAllText: { color: "#F4A361", fontWeight: "bold" },
  mapPreview: {
    height: 150,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  map: { width: "100%", height: "100%" },
  categories: { flexDirection: "row", paddingHorizontal: 20, gap: 20 },
  categoryItem: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItemActive: {
    width: 60,
    height: 60,
    backgroundColor: "#F4A361",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  clinicsList: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
