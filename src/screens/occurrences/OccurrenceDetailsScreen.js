import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import ServiceOccurrences from "../../services/ServiceOccurrences";
import ButtonRollback from "../../components/ButtonRollback";
import { FormatDateTimeDisplay } from "../../core/FormatDateDisplay";

const OCCURRENCE_TYPE_COLORS = {
  HAIR_FALLING: { accent: "#7922ac", badge: "#f5e3ff", icon: "leaf" },
  VOMITING: { accent: "#3A7BD5", badge: "#E7F0FB", icon: "temperature-high" },
  REDUCE_APPETITE: {
    accent: "#3A7BD5",
    badge: "#E7F0FB",
    icon: "apple",
  },
  HECTIC: { accent: "#3A7BD5", badge: "#E7F0FB", icon: "bolt" },
  LOOSE_STOOLS: { accent: "#d15e31", badge: "#fce6dd", icon: "tint" },
  EXCESSIVE_LICKING: { accent: "#D0A44B", badge: "#FFF6DD", icon: "paw" },
};

const FEELING_EMOJIS = {
  NORMAL: { emoji: "😊", label: "Normal", color: "#44c564" },
  APATHETIC: { emoji: "😐", label: "Apático", color: "#999999" },
  ANXIOUS: { emoji: "😟", label: "Inquieto", color: "#9A9A9A" },
  ANGRY: { emoji: "😠", label: "Enjôado", color: "#F4A361" },
  VERY_BAD: { emoji: "😢", label: "Muito mal", color: "#999999" },
};

function OccurrenceDetailsScreen({ route, navigation }) {
  const { occurrenceId, petName } = route.params;
  const [occurrence, setOccurrence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedOccurrences, setRelatedOccurrences] = useState([]);
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  const fetchOccurrenceDetails = async () => {
    setLoading(true);
    try {
      const data = await ServiceOccurrences.getById(occurrenceId);
      setOccurrence(data);

      // Fetch related occurrences (same type)
      if (data && data.petId) {
        const allOccurrences = await ServiceOccurrences.getByIdPet(data.petId);
        const related = allOccurrences
          .filter((item) => item.type === data.type && item.id !== occurrenceId)
          .slice(0, 3);
        setRelatedOccurrences(related);
      }
    } catch (e) {
      console.error("Erro ao buscar ocorrência:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccurrenceDetails();
  }, [occurrenceId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchOccurrenceDetails();
    }, [occurrenceId]),
  );

  const filteresType = (type) => {
    const typeMap = {
      VOMITING: "Vômito",
      REDUCE_APPETITE: "Apetite Reduzido",
      HECTIC: "Muito Agitado",
      LOOSE_STOOLS: "Fezes Amolecidas",
      HAIR_FALLING: "Pelo Caindo",
      EXCESSIVE_LICKING: "Lambedura Excessiva",
    };
    return typeMap[type] || type;
  };

  const getSeverityDots = (severity) => {
    const severityMap = {
      LIGHT: 1,
      MODERATE: 2,
      SEVERE: 3,
    };
    return severityMap[severity] || 1;
  };

  const getCauseDescription = (type) => {
    const descriptions = {
      VOMITING:
        "Vômitos podem ocorrer por comer rápido, mudança de alimentação, intolerância alimentar, bolas de pelo ou outros fatores. Se persistir, consulte o veterinário.",
      REDUCE_APPETITE:
        "A redução de apetite pode ser causada por estresse, mudanças na alimentação ou problemas de saúde. Observe por mais alguns dias e consulte um veterinário se persistir.",
      HECTIC:
        "A agitação excessiva pode indicar falta de exercício, estresse ou desconforto. Tente aumentar as atividades físicas e observar o comportamento.",
      LOOSE_STOOLS:
        "Fezes amolecidas podem ser causadas por mudança na alimentação, parasitas ou problemas digestivos. Mantenha o pet hidratado e observe.",
      HAIR_FALLING:
        "A queda de pelos pode ocorrer por stress, alergias, parasitas ou mudanças sazonais. Consulte o veterinário se a queda for excessiva.",
      EXCESSIVE_LICKING:
        "O lambimento excessivo pode indicar coceira, alergias ou comportamento compulsivo. Observe a área e consulte um veterinário se necessário.",
    };
    return (
      descriptions[type] || "Consulte um veterinário para mais informações."
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 20, paddingTop: 35 }}>
          <ButtonRollback navigation={navigation} disabled={true} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4A361" />
        </View>
      </View>
    );
  }

  if (!occurrence) {
    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 20, paddingTop: 35 }}>
          <ButtonRollback navigation={navigation} disabled={true} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Ocorrência não encontrada</Text>
        </View>
      </View>
    );
  }

  const typeColors =
    OCCURRENCE_TYPE_COLORS[occurrence.type] ||
    OCCURRENCE_TYPE_COLORS["VOMITING"];

  const severityCount = getSeverityDots(occurrence.severity || "MODERATE");

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ButtonRollback navigation={navigation} disabled={false} />

        <View style={styles.headerBox}>
          <FontAwesome5
            name={typeColors.icon}
            size={32}
            color="#F4A361"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.headerText}>{occurrence.title}</Text>
          <Text style={styles.petNameText}>
            Detalhes de{" "}
            <Text style={{ color: "#F4A361", fontWeight: "bold" }}>
              {petName}
            </Text>
          </Text>
        </View>

        <View style={styles.typeCard}>
          <View style={styles.typeCardIcon(typeColors.badge)}>
            <FontAwesome5
              name={typeColors.icon}
              size={28}
              color={typeColors.accent}
            />
          </View>
          <View style={styles.typeCardContent}>
            <Text style={styles.typeCardTitle}>{occurrence.title}</Text>
            <Text style={styles.typeCardSubtitle}>
              {FormatDateTimeDisplay(occurrence.occurrenceDate)}
            </Text>
          </View>
          <View style={styles.typeBadge(typeColors.badge)}>
            <Text style={styles.typeBadgeText(typeColors.accent)}>
              {filteresType(occurrence.type)}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes</Text>

          {/* Date and Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Data e hora</Text>
            </View>
            <Text style={styles.detailValue}>
              {FormatDateTimeDisplay(occurrence.occurrenceDate)}
            </Text>
          </View>

          {/* Category */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="pricetag" size={20} color="#666" />
              <Text style={styles.detailLabel}>Categoria</Text>
            </View>
            <View style={styles.categoryBadge(typeColors.badge)}>
              <Text style={styles.categoryBadgeText(typeColors.accent)}>
                {filteresType(occurrence.type)}
              </Text>
            </View>
          </View>

          {/* Severity */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <FontAwesome5 name="heartbeat" size={20} color="#666" />
              <Text style={styles.detailLabel}>Severidade</Text>
            </View>
            <View style={styles.severityDots}>
              {Array.from({ length: 3 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index < severityCount
                      ? styles.dotActive
                      : styles.dotInactive,
                  ]}
                />
              ))}
              <Text style={styles.severityLabel}>
                {occurrence.severity === "LIGHT"
                  ? "Leve"
                  : occurrence.severity === "SEVERE"
                    ? "Severa"
                    : "Moderada"}
              </Text>
            </View>
          </View>

          {/* Frequency */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="repeat" size={20} color="#666" />
              <Text style={styles.detailLabel}>Frequência</Text>
            </View>
            <Text style={styles.detailValue}>
              {occurrence.frequency || "1 episódio"}
            </Text>
          </View>

          {/* Observations */}
          {occurrence.description && (
            <View style={styles.observationsRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="document-text-outline" size={20} color="#666" />
                <Text style={styles.detailLabel}>Observações</Text>
              </View>
              <Text style={styles.observationsText}>
                {occurrence.description}
              </Text>
            </View>
          )}
        </View>

        {/* Pet Feeling Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como {petName} estava?</Text>
          <View style={styles.feelingContainer}>
            {Object.keys(FEELING_EMOJIS).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.feelingItem,
                  selectedFeeling === key && styles.feelingItemActive,
                ]}
                onPress={() => setSelectedFeeling(key)}
              >
                <Text style={styles.feelingEmoji}>
                  {FEELING_EMOJIS[key].emoji}
                </Text>
                <Text
                  style={[
                    styles.feelingLabel,
                    selectedFeeling === key && styles.feelingLabelActive,
                  ]}
                >
                  {FEELING_EMOJIS[key].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cause Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que pode ter causado?</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color="#F4A361" />
            <Text style={styles.tipText}>
              {getCauseDescription(occurrence.type)}
            </Text>
          </View>
        </View>

        {/* Attachments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anexos</Text>
          {occurrence.photoUrl ? (
            <TouchableOpacity style={styles.attachmentCard}>
              <Image
                source={{ uri: occurrence.photoUrl }}
                style={styles.attachmentImage}
              />
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentTitle}>Foto do momento</Text>
                <Text style={styles.attachmentDate}>
                  {FormatDateTimeDisplay(occurrence.occurrenceDate)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
            </TouchableOpacity>
          ) : (
            <Text
              style={{ textAlign: "center", color: "#999", marginVertical: 20 }}
            >
              Nenhum anexo adicionado
            </Text>
          )}
        </View>

        {/* Related History Section */}
        {relatedOccurrences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico relacionado</Text>
            {relatedOccurrences.map((item) => {
              const colors = OCCURRENCE_TYPE_COLORS[item.type] || typeColors;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.relatedCard}
                  onPress={() =>
                    navigation.push("OccurrenceDetails", {
                      occurrenceId: item.id,
                      petName: petName,
                    })
                  }
                >
                  <View style={styles.relatedIcon(colors.badge)}>
                    <FontAwesome5
                      name={colors.icon}
                      size={16}
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.relatedContent}>
                    <Text style={styles.relatedTitle}>{item.title}</Text>
                    <Text style={styles.relatedDate}>
                      {FormatDateTimeDisplay(item.occurrenceDate)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("OccurrencesEdit", {
              occurrenceId: occurrence.id,
              petName: petName,
            })
          }
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Editar ocorrência</Text>
        </TouchableOpacity>

        <View style={styles.spacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F1" },
  headerBox: {
    alignItems: "center",
    marginTop: 40,
    paddingTop: 30,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F4A361",
    marginBottom: 2,
    textAlign: "center",
  },
  petNameText: {
    fontSize: 15,
    color: "#2B2B2B",
    marginBottom: 8,
    textAlign: "center",
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  typeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeCardIcon: (backgroundColor) => ({
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),
  typeCardContent: { flex: 1 },
  typeCardTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  typeCardSubtitle: { fontSize: 13, color: "#8E8E8E", marginTop: 4 },
  typeBadge: (backgroundColor) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor,
  }),
  typeBadgeText: (color) => ({ fontSize: 12, fontWeight: "600", color }),

  /* Section */
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },

  /* Detail Rows */
  detailRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailLabel: { fontSize: 14, color: "#666", fontWeight: "500" },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#333" },

  /* Category Badge */
  categoryBadge: (backgroundColor) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor,
  }),
  categoryBadgeText: (color) => ({ fontSize: 12, fontWeight: "600", color }),

  /* Severity */
  severityDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotActive: { backgroundColor: "#44c564" },
  dotInactive: { backgroundColor: "#D3D3D3" },
  severityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },

  /* Observations */
  observationsRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  observationsText: {
    fontSize: 13,
    color: "#666",
    marginTop: 12,
    lineHeight: 20,
  },

  /* Feeling */
  feelingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  feelingItem: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  feelingItemActive: {
    backgroundColor: "#FFF0E2",
  },
  feelingEmoji: { fontSize: 32 },
  feelingLabel: { fontSize: 11, color: "#8E8E8E", fontWeight: "600" },
  feelingLabelActive: { color: "#F4A361" },

  /* Tip Card */
  tipCard: {
    backgroundColor: "#FFF0E2",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  tipText: { flex: 1, fontSize: 13, color: "#666", lineHeight: 20 },

  /* Attachments */
  attachmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  attachmentInfo: { flex: 1 },
  attachmentTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  attachmentDate: { fontSize: 12, color: "#8E8E8E", marginTop: 4 },

  /* Related Cards */
  relatedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  relatedIcon: (backgroundColor) => ({
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  }),
  relatedContent: { flex: 1 },
  relatedTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  relatedDate: { fontSize: 12, color: "#8E8E8E", marginTop: 2 },

  /* Edit Button */
  editButton: {
    backgroundColor: "#F4A361",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },

  spacing: { height: 20 },
});

export default OccurrenceDetailsScreen;
