import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen({ navigation }) {
  const handleOpenLink = (url) => {
    Linking.openURL(url);
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

        <Text style={styles.title}>Sobre</Text>

        <View style={styles.headerIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="heart" size={40} color="#ff7a00" />
          </View>
          <Text style={styles.appName}>PetCard</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre o app</Text>
          <Text style={styles.description}>
            O PetCard é um aplicativo dedicado a ajudar tutores responsáveis a
            gerenciar e acompanhar as vacinas e cuidados de saúde dos seus pets.
            Nosso objetivo é facilitar o cuidado com seus animais de estimação.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
            </View>
            <View>
              <Text style={styles.featureName}>Registro de Vacinas</Text>
              <Text style={styles.featureDesc}>
                Registre e acompanhe todas as vacinas dos seus pets
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="calendar" size={20} color="#3498db" />
            </View>
            <View>
              <Text style={styles.featureName}>Calendário</Text>
              <Text style={styles.featureDesc}>
                Visualize um calendário completo de vacinações
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="map" size={20} color="#ff7a00" />
            </View>
            <View>
              <Text style={styles.featureName}>Clínicas Parceiras</Text>
              <Text style={styles.featureDesc}>
                Encontre clínicas veterinárias próximas a você
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="alert-circle" size={20} color="#e74c3c" />
            </View>
            <View>
              <Text style={styles.featureName}>Notificações</Text>
              <Text style={styles.featureDesc}>
                Receba alertas sobre vacinas próximas de seus pets
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Links Úteis</Text>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() =>
              handleOpenLink(
                "https://github.com/DavidSouzaxz/petvaccineapp/blob/main/public/POLITICA_PRIVACIDADE.md",
              )
            }
          >
            <View style={styles.linkLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#ff7a00"
              />
              <Text style={styles.linkText}>Política de Privacidade</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() =>
              handleOpenLink(
                "https://github.com/DavidSouzaxz/petvaccineapp/blob/main/public/TERMOS_SERVICO.md",
              )
            }
          >
            <View style={styles.linkLeft}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#ff7a00"
              />
              <Text style={styles.linkText}>Termos de Serviço</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.divider} />
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            © 2026 PetCard. Todos os direitos reservados.
          </Text>
          <Text style={styles.footerSubText}>
            Desenvolvido com ❤️ para cuidadores de pets
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

  logoContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffe8d6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  version: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
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
    marginBottom: 12,
    color: "#222",
  },

  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },

  featureItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },

  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },

  featureName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    marginBottom: 3,
  },

  featureDesc: {
    fontSize: 12,
    color: "#777",
    width: "85%",
    flexWrap: "wrap",
  },

  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  linkText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#222",
  },

  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },

  footerCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 15,
    elevation: 0.6,
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  footerSubText: {
    fontSize: 11,
    color: "#999",
    marginTop: 5,
  },
});
