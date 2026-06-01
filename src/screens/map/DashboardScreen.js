import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
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
import OpenGoogleMaps from "../../core/OpenGoogleMaps";

const { width } = Dimensions.get("window");

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text style={styles.title}>Clínicas</Text>
          </View>
        </View>
        <View style={styles.containerImage}>
          <Image
            source={require("../../../assets/cardClinic.png")}
            style={styles.cardImage}
          />
          <TouchableOpacity
            style={styles.viewAllPetsButton}
            onPress={() => navigation.navigate("FullMap")}
          >
            <Text style={styles.viewAllPetsButtonText}>Explorar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mapa & Localizações</Text>
          <TouchableOpacity onPress={() => navigation.navigate("FullMap")}>
            <Text style={styles.seeAllText}>Ver no Mapa</Text>
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
  container: { flex: 1, backgroundColor: "#FFF5EA", paddingTop: 35 },
  scrollContent: { paddingBottom: 32 },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#222" },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardImage: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    shadowColor: "#F4A361",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  viewAllPetsButton: {
    padding: 10,
    left: 33,
    bottom: 20,

    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  viewAllPetsButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F4A361",
  },
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
