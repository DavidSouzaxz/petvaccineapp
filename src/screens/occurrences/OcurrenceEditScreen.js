import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import { AlertModal } from "../../components/modals";
import * as ImagePicker from "expo-image-picker";
import ButtonRollback from "../../components/ButtonRollback";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceOccurrence from "../../services/ServiceOccurrences";
import ServiceSignature from "../../services/ServiceSignature";
import { validateDate, validateTime } from "../../core/validators";
import InputDatePicker from "../../components/InputDatePicker";
import InputTimePicker from "../../components/InputTimePicker";
import { FormatDateForRequisition } from "../../core/FormatDateDisplay";
import { OCCURRENCE_TYPES } from "../../constants/occurrences";

export default function EditOccurrenceScreen({ navigation, route }) {
  const { occurrenceId, petName } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState("VOMITING");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    fetchOccurrenceData();
  }, [occurrenceId]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setAlertVisible(false);
      };
    }, []),
  );

  const fetchOccurrenceData = async () => {
    try {
      const data = await ServiceOccurrence.getById(occurrenceId);

      setType(data.type || "VOMITING");
      setTitle(data.title || "");
      setDescription(data.description || "");

      if (data.occurrenceDate) {
        const dateObj = new Date(data.occurrenceDate);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");

        setDate(`${day}/${month}/${year}`);
        setTime(`${hours}:${minutes}`);
      }

      if (data.photoUrl) {
        setImage(data.photoUrl);
        setOriginalImage(data.photoUrl);
      }
    } catch (error) {
      console.error("Erro ao carregar ocorrência:", error);
      setAlertMessage("Falha ao carregar os dados da ocorrência.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDate(formatted);
  };

  const handleTimeChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    setTime(formatted);
  };

  const handleSave = async () => {
    if (!title || !description || !date || !time) {
      setAlertMessage("Por favor, preencha todos os campos obrigatórios.");
      setAlertVisible(true);
      return;
    }

    setSaving(true);

    try {
      let finalPhotoUrl = originalImage;

      if (image && image !== originalImage && !image.startsWith("http")) {
        const authData = await ServiceSignature.getSignature();
        finalPhotoUrl = await ServiceSignature.uploadImage(image, authData);
      } else if (image && image.startsWith("http")) {
        finalPhotoUrl = image;
      }

      const isoDateTime = `${FormatDateForRequisition(date)}T${time}:00`;

      const updatedOccurrence = {
        type: type,
        title: title,
        description: description,
        occurrenceDate: isoDateTime,
        photoUrl: finalPhotoUrl,
      };

      await ServiceOccurrence.update(occurrenceId, updatedOccurrence);

      setAlertMessage("Ocorrência atualizada!");
      setAlertVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.log(error);
      setAlertMessage("Falha ao atualizar a ocorrência.");
      setAlertVisible(true);
    } finally {
      setSaving(false);
    }
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

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 70}
        extraHeight={180}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 35 }}>
          <ButtonRollback navigation={navigation} disabled={saving} />
        </View>

        <View style={styles.headerBox}>
          <View style={[styles.iconCircle, { backgroundColor: "#F4A36120" }]}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={35}
              color="#F4A361"
            />
          </View>
          <Text style={styles.headerText}>Editar Ocorrência</Text>
          <Text style={styles.petNameText}>
            Alterações para{" "}
            <Text style={{ fontWeight: "bold" }}>{petName}</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.tagContainer}>
            {OCCURRENCE_TYPES.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setType(item.id)}
                style={[styles.tag, type === item.id && styles.tagSelected]}
              >
                <Text
                  style={[
                    styles.tagText,
                    type === item.id && styles.tagTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Seção de Foto */}
          <Text style={styles.label}>Foto ou Anexo (Opcional)</Text>
          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialCommunityIcons
                  name="camera"
                  size={30}
                  color="#B9B1A9"
                />
                <Text style={styles.photoText}>Selecionar Imagem</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Primeiro Passeio"
            placeholderTextColor="#B9B1A9"
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <InputDatePicker
                label="Data da Ocorrência"
                dateMode="yesterday"
                value={date}
                onChange={(val) => setDate(val)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputTimePicker
                label="Horário"
                value={time}
                onChange={(val) => setTime(val)}
              />
            </View>
          </View>

          <Text style={styles.label}>Relato Detalhado</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            placeholderTextColor="#B9B1A9"
            onChangeText={setDescription}
            placeholder="Escreva aqui..."
            multiline
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F1" },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerBox: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#2B2B2B" },
  petNameText: { fontSize: 16, color: "#666" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 20,
    marginHorizontal: 20,
    elevation: 4,
  },
  label: { fontSize: 14, fontWeight: "700", color: "#444", marginBottom: 8 },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  tagSelected: { backgroundColor: "#F4A361", borderColor: "#F4A361" },
  tagText: { fontSize: 12, color: "#777", fontWeight: "600" },
  tagTextSelected: { color: "#FFF" },

  photoPicker: {
    height: 120,
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#EFE2D7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  previewImage: { width: "100%", height: "100%" },
  photoPlaceholder: { alignItems: "center" },
  photoText: { color: "#B9B1A9", fontSize: 12, marginTop: 5 },

  divider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 15 },
  input: {
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    padding: 12,
    color: "#000",
    fontSize: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#F4A361",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
