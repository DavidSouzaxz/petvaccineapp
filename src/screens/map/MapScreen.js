import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AlertModal } from "../../components/modals";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNearbyClinics } from "../../services/ServiceMap";
import { Ionicons } from "@expo/vector-icons";
import OpenGoogleMaps from "../../core/OpenGoogleMaps";

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
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
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      fetchNearby(latitude, longitude);
    })();
  }, [fetchNearby]);

  const centerMapOnUser = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setUserLocation({ latitude, longitude });

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          600,
        );
      }
    } catch (error) {
      setAlertMessage("Não foi possível acessar sua localização atual.");
      setAlertVisible(true);
    }
  };

  const handleMarkerPressAndroid = (clinic) => {
    if (Platform.OS !== "android") return;

    setSelectedClinic(clinic);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: clinic.lat,
          longitude: clinic.lon,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        400,
      );
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
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
        onPress={() => setSelectedClinic(null)} // Fecha o card do Android ao clicar fora
        toolbarEnabled={false}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lon }}
            pinColor="#F4A361"
            onPress={() => handleMarkerPressAndroid(m)} // Só roda lógica se for Android
          >
            {/* Renderiza o Callout flutuante bonito APENAS se for iOS */}
            {Platform.OS === "ios" && (
              <Callout tooltip={true} onPress={() => handlePressDetails(m)}>
                <Text style={styles.calloutWrapper}>
                  <View style={styles.cardCallout}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>
                      {m.nome || m.name}
                    </Text>
                    <Text style={styles.calloutSubtitle}>
                      Toque para mais detalhes
                    </Text>
                  </View>
                </Text>
              </Callout>
            )}
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.centerButton,
          // Ajusta a altura dependendo se o card de detalhes do Android está aberto ou não
          { bottom: Platform.OS === "android" && selectedClinic ? 240 : 50 },
        ]}
        onPress={centerMapOnUser}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={26} color="#F4A361" />
      </TouchableOpacity>

      {/* Renderiza o Card inferior customizado APENAS no Android */}
      {Platform.OS === "android" && selectedClinic && (
        <View style={styles.cardAndroid}>
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

  // Estilos do Callout Flutuante (iOS)
  calloutWrapper: { backgroundColor: "transparent" },
  cardCallout: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: 220,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: "#F4A361",
    textAlign: "center",
  },

  // Estilos do Card Inferior Fixo (Android)
  cardAndroid: {
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
    paddingRight: 20, // 👈 ADICIONE ISSO: Dá o recuo necessário antes do texto ser cortado
    flex: 1,
  },
  iconTitle: { fontSize: 20, color: "#F4A361" },
  textCardTitle: { fontWeight: "bold", fontSize: 17, color: "#333", flex: 1 },
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
  centerButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 25,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
});
