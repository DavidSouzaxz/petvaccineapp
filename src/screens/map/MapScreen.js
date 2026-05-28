import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AlertModal } from "../../components/modals";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNearbyClinics } from "../../services/ServiceMap";
import { Ionicons } from "@expo/vector-icons";
import OpenGoogleMaps from "../../core/OpenGoogleMaps";

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null); // Referência para controlar o mapa
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [region, setRegion] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchNearby = useCallback(async (lat, lon) => {
    const cachedData = await AsyncStorage.getItem("last_clinics_data");
    let shouldFetch = true;

    if (cachedData) {
      const {
        lat: cachedLat,
        lon: cachedLon,
        clinics,
      } = JSON.parse(cachedData);
      const dist = calculateDistance(lat, lon, cachedLat, cachedLon);
      if (dist < 5) {
        setMarkers(clinics);
        shouldFetch = false;
      }
    }

    if (shouldFetch) {
      try {
        const clinics = await getNearbyClinics(lat, lon);
        setMarkers(clinics);
        await AsyncStorage.setItem(
          "last_clinics_data",
          JSON.stringify({ lat, lon, clinics }),
        );
      } catch (err) {
        console.error("Erro na API:", err);
      }
    }
  }, []);

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

      fetchNearby(latitude, longitude);
    })();
  }, [fetchNearby]);

  // Função disparada ao clicar no Marcador
  const handleMarkerPress = (clinic) => {
    setSelectedClinic(clinic);

    // Move a câmera do mapa para centralizar a clínica clicada suavemente
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: clinic.lat, // Desloca levemente para cima para o card de baixo não cobrir o pino
          longitude: clinic.lon,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        400,
      ); // 400 milissegundos de animação
    }
  };

  const handlePressDetails = async (clinic) => {
    setLoading(true);
    const sucesso = await OpenGoogleMaps(clinic);
    setLoading(false);
    if (!sucesso) {
      setAlertMessage("Não conseguimos abrir o mapa no seu dispositivo.");
      setAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Atribui a referência do mapa
        style={styles.map}
        showsUserLocation={true}
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
        onPress={() => setSelectedClinic(null)} // Fecha o card se clicar no mapa vazio
        toolbarEnabled={false}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lon }}
            pinColor="#F4A361"
            onPress={() => handleMarkerPress(m)} // Executa a nossa lógica de foco e abertura
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* O Card inferior fixo que abre de forma idêntica e linda em ambos os sistemas */}
      {selectedClinic && (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardInfo}>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="paw" style={styles.iconTitle} />
                <Text style={styles.textCardTitle} numberOfLines={1}>
                  {selectedClinic.nome || selectedClinic.name}
                </Text>
              </View>
              <Text style={styles.cardAddress} numberOfLines={2}>
                {selectedClinic.endereco ||
                  selectedClinic.address ||
                  "Endereço não informado"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePressDetails(selectedClinic)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      )}

      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF4E7" },
  map: { width: "100%", height: "100%" },
  card: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 99,
  },
  cardContent: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  cardInfo: { flex: 1 },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  iconTitle: { fontSize: 20, color: "#F4A361" },
  textCardTitle: { fontWeight: "bold", fontSize: 17, color: "#333" },
  cardAddress: { color: "#888", fontSize: 13 },
  button: {
    backgroundColor: "#F4A361",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 15 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
});
