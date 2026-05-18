import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PrivacyScreen({ navigation }) {
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [shareLocation, setShareLocation] = useState(false);
  const [shareData, setShareData] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [locationPermissionStatus, setLocationPermissionStatus] =
    useState(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermissionStatus(status);

      if (status !== "granted") {
        setShareLocation(false);
      } else {
        const savedPref = await AsyncStorage.getItem("@shareLocation");
        if (savedPref !== null) {
          setShareLocation(savedPref === "true");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar permissão de localização:", error);
    }
  };

  const handleShareLocationChange = async (value) => {
    if (value) {
      if (locationPermissionStatus !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermissionStatus(status);

        if (status === "granted") {
          setShareLocation(true);
          await AsyncStorage.setItem("@shareLocation", "true");
        }
      } else {
        setShareLocation(true);
        await AsyncStorage.setItem("@shareLocation", "true");
      }
    } else {
      setShareLocation(false);
      await AsyncStorage.setItem("@shareLocation", "false");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7efe5" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.title}>Privacidade</Text>

        <View style={styles.headerIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configurações de privacidade</Text>

          {/* <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Perfil privado</Text>
              <Text style={styles.switchDescription}>
                Sua conta será visível apenas para você
              </Text>
            </View>
            <Switch
              value={profilePrivate}
              onValueChange={setProfilePrivate}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={profilePrivate ? "#ff7a00" : "#f4f3f4"}
            />
          </View> */}

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Compartilhar localização</Text>
              <Text style={styles.switchDescription}>
                Permita que clínicas parceiras vejam sua localização
              </Text>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={handleShareLocationChange}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={shareLocation ? "#ff7a00" : "#f4f3f4"}
            />
          </View>

          <View style={styles.divider} />

          {/* <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>
                Compartilhar dados de saúde
              </Text>
              <Text style={styles.switchDescription}>
                Compartilhe informações de saúde com veterinários
              </Text>
            </View>
            <Switch
              value={shareData}
              onValueChange={setShareData}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={shareData ? "#ff7a00" : "#f4f3f4"}
            />
          </View> */}

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Análise de dados</Text>
              <Text style={styles.switchDescription}>
                Nos ajude a melhorar o app compartilhando dados de uso
              </Text>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={analytics ? "#ff7a00" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Gerenciamento de dados</Text>

          {/* <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="download-outline" size={18} color="#ff7a00" />
              <Text style={styles.menuText}>Baixar meus dados</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} /> */}

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
              <Text style={[styles.menuText, { color: "#e74c3c" }]}>
                Deletar minha conta
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.policyCard}>
          <Text style={styles.policyText}>
            Leia nossa{" "}
            <Text style={styles.policyLink}>Política de Privacidade</Text> e{" "}
            <Text style={styles.policyLink}>Termos de Serviço</Text> para mais
            informações sobre como utilizamos seus dados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f7efe5",
  },

  headerIcon: {
    width: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 15,
    elevation: 0.6,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  switchContent: {
    flex: 1,
    marginRight: 10,
  },

  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },

  switchDescription: {
    fontSize: 12,
    color: "#777",
  },

  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#222",
  },

  policyCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 15,
    elevation: 0.6,
  },

  policyText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },

  policyLink: {
    color: "#ff7a00",
    fontWeight: "600",
  },
});
