import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import ButtonRollback from "../../components/ButtonRollback";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceOccurrence from "../../services/ServiceOccurrences";
import ServiceSignature from "../../services/ServiceSignature";
import { validateDate, validateTime } from "../../core/validators";
import InputDatePicker from "../../components/InputDatePicker";
import InputTimePicker from "../../components/InputTimePicker";
import { OCCURRENCE_TYPES } from "../../constants/occurrences";
import { AlertModal } from "../../components/modals";

export default function AddOccurrenceScreen({ navigation, route }) {
  const { petId, petName, petColor } = route.params;
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState("VOMITING");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertVisible(true);
      setAlertMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    let finalPhotoUrl = null;

    if (image) {
      const authData = await ServiceSignature.getSignature();

      finalPhotoUrl = await ServiceSignature.uploadImage(image, authData);
    }

    const isoDateTime = `${date}T${time}:00`;

    const newOccurrence = {
      pet: {
        id: petId,
      },
      type: type,
      title: title,
      description: description,
      occurrenceDate: isoDateTime,
      photoUrl: finalPhotoUrl,
    };

    try {
      await ServiceOccurrence.register(newOccurrence);

      setAlertMessage("Sucesso", "Ocorrência registrada!");
      setAlertVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.log(error);
      setAlertVisible(true);
      setAlertMessage("Falha ao processar o registro ou upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ButtonRollback
          navigation={navigation}
          disabled={loading}
          backgroundColor="#FFF7F1"
        />
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Nova Ocorrência</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 70}
        extraHeight={180}
      >
        <View style={styles.containerCircle}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: petColor + "20" || "#F4A36120" },
            ]}
          >
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={28}
              color={petColor || "#F4A361"}
            />
          </View>
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
                value={date}
                dateMode="yesterday"
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
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Registrar</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerBox: {
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#f3e8dd98",
  },
  containerCircle: { justifyContent: "center", flexDirection: "row" },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#2B2B2B" },
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
});
