import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationManager } from "../../components/NotificationManager";

export default function NotificationsScreen({ navigation }) {
  const [vaccineNotifications, setVaccineNotifications] = useState(false);
  const [tipNotifications, setTipNotifications] = useState(false);
  const [promotions, setPromotions] = useState(false);
  const [generalNotifications, setGeneralNotifications] = useState(false);

  const loadPermissionsNotification = async () => {
    const permissionsAll = await AsyncStorage.getItem("@notificationsEnabled");
    const vaccines = await AsyncStorage.getItem("@notificationsEnabledVaccine");
    const saude = await AsyncStorage.getItem("@notificationsEnabledSaude");
    const promotionsValue = await AsyncStorage.getItem(
      "@notificationsEnabledPromotions",
    );
    setGeneralNotifications(permissionsAll === "true");
    setVaccineNotifications(vaccines === "true");
    setTipNotifications(saude === "true");
    setPromotions(promotionsValue === "true");
  };

  const handleGeneralNotificationsChange = async (value) => {
    // 👈 Usa a função do manager que gerencia permissões e cancelamentos locais
    const success = await NotificationManager.toggleNotificationSetting(value);
    setGeneralNotifications(success);

    // Se desativar o geral, desativa o visual das outras chaves também
    if (!value) {
      setVaccineNotifications(false);
      setTipNotifications(false);
      setPromotions(false);
      await AsyncStorage.setItem("@notificationsEnabledVaccine", "false");
      await AsyncStorage.setItem("@notificationsEnabledSaude", "false");
      await AsyncStorage.setItem("@notificationsEnabledPromotions", "false");
    }
  };

  const handleVaccineNotificationsChange = async (value) => {
    if (value) {
      const hasPermission = await NotificationManager.requestPermissions();
      if (!hasPermission) return;
      // Ativa o geral caso estivesse desligado
      setGeneralNotifications(true);
      await AsyncStorage.setItem("@notificationsEnabled", "true");
    }
    setVaccineNotifications(value);
    await AsyncStorage.setItem(
      "@notificationsEnabledVaccine",
      value.toString(),
    );
  };

  const handleTipNotificationsChange = async (value) => {
    if (value) {
      const hasPermission = await NotificationManager.requestPermissions();
      if (!hasPermission) return;
      setGeneralNotifications(true);
      await AsyncStorage.setItem("@notificationsEnabled", "true");
    }
    setTipNotifications(value);
    await AsyncStorage.setItem("@notificationsEnabledSaude", value.toString());
  };

  const handlePromotionsChange = async (value) => {
    if (value) {
      const hasPermission = await NotificationManager.requestPermissions();
      if (!hasPermission) return;
      setGeneralNotifications(true);
      await AsyncStorage.setItem("@notificationsEnabled", "true");
    }
    setPromotions(value);
    await AsyncStorage.setItem(
      "@notificationsEnabledPromotions",
      value.toString(),
    );
  };

  useEffect(() => {
    loadPermissionsNotification();
  }, []);

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

        <Text style={styles.title}>Notificações</Text>

        <View style={styles.headerIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferências de notificações</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Notificações gerais</Text>
              <Text style={styles.switchDescription}>
                Receba notificações sobre o app
              </Text>
            </View>
            <Switch
              value={generalNotifications}
              onValueChange={handleGeneralNotificationsChange}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={generalNotifications ? "#ff7a00" : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Vacinas</Text>
              <Text style={styles.switchDescription}>
                Receba alertas sobre vacinas dos seus pets
              </Text>
            </View>
            <Switch
              value={vaccineNotifications}
              disabled={!generalNotifications && vaccineNotifications}
              onValueChange={handleVaccineNotificationsChange}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={vaccineNotifications ? "#ff7a00" : "#f4f3f4"}
            />
          </View>

          <View style={styles.divider} />

          {/* <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Dicas de saúde</Text>
              <Text style={styles.switchDescription}>
                Receba dicas úteis sobre saúde dos pets
              </Text>
            </View>
            <Switch
              value={tipNotifications}
              onValueChange={handleTipNotificationsChange}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={tipNotifications ? "#ff7a00" : "#f4f3f4"}
            />
          </View> */}

          {/* <View style={styles.divider} />

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Promoções</Text>
              <Text style={styles.switchDescription}>
                Receba ofertas especiais e promoções
              </Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={handlePromotionsChange}
              trackColor={{ false: "#ccc", true: "#ff7a0050" }}
              thumbColor={promotions ? "#ff7a00" : "#f4f3f4"}
            />
          </View> */}
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#3498db"
          />
          <Text style={styles.infoText}>
            Você pode alterar essas preferências a qualquer momento nas
            configurações do seu dispositivo.
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

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    margin: 20,
    padding: 15,
    borderRadius: 16,
    alignItems: "flex-start",
  },

  infoText: {
    fontSize: 12,
    color: "#1976d2",
    marginLeft: 10,
    flex: 1,
  },
});
