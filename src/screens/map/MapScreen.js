import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNearbyClinics } from "../../services/ServiceMap";
import { Ionicons } from "@expo/vector-icons";

export default function MapScreen() {
  const [markers, setMarkers] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
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

  const openGoogleMaps = (clinic) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name)}&query_place_id=${clinic.id}`;
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao abrir Google Maps: ", err),
    );
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
        const distance = calculateDistance(latitude, longitude, lat, lon);

        if (distance < 5) {
          console.log(
            "Usando dados do cache. Distância:",
            distance.toFixed(2),
            "km",
          );
          setMarkers(clinics);
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        console.log("Buscando novos dados na API...");
        const clinics = await getNearbyClinics(latitude, longitude);
        setMarkers(clinics);

        await AsyncStorage.setItem(
          "last_clinics_data",
          JSON.stringify({ lat: latitude, lon: longitude, clinics: clinics }),
        );
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
        onPress={() => setSelectedClinic(null)}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lon }}
            onPress={() => setSelectedClinic(m)}
          />
        ))}
      </MapView>

      {selectedClinic && (
        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <Ionicons name="paw" style={styles.iconTitle} />
            <Text style={styles.textCardTitle}>{selectedClinic.name}</Text>
          </View>
          <Text style={styles.cardAddress}>{selectedClinic.address}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openGoogleMaps(selectedClinic)}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Ver Detalhes
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  card: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    flexDirection: "row",
    gap: 5,
  },
  iconTitle: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#007AFF",
  },
  textCardTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  cardAddress: { color: "#666", marginBottom: 15 },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
