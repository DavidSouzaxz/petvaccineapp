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
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // npx expo install expo-image-picker
import ButtonRollback from "../../components/ButtonRollback";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceOccurrence from "../../services/ServiceOccurrences";
import ServiceSignature from "../../services/ServiceSignature";
import { validateDate, validateTime } from "../../core/validators";

const OCCURRENCE_TYPES = [
  { id: "MEMORY", label: "Lembrança" },
  { id: "VACCINE", label: "Vacina" },
  { id: "CHECKUP", label: "Consulta" },
  { id: "SURGERY", label: "Cirurgia" },
  { id: "EXAM", label: "Exame" },
  { id: "MEDICATION", label: "Medicação" },
];

export default function AddOccurrenceScreen({ navigation, route }) {
  const { petId, petName, petColor } = route.params;
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState("CHECKUP");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState(null); // Estado para a foto

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
      Alert.alert(
        "Atenção",
        "Por favor, preencha todos os campos obrigatórios.",
      );
      return;
    }

    const dateError = validateDate(date);
    const timeError = validateTime(time);
    if (dateError || timeError)
      return Alert.alert("Erro", dateError || timeError);

    setLoading(true);

    try {
      let finalPhotoUrl = null;

      // FLUXO DE UPLOAD SEGURO
      if (image) {
        // 1. Pega a assinatura no Back-end
        const authData = await ServiceSignature.getSignature();

        // 2. Faz o upload assinado para o Cloudinary
        finalPhotoUrl = await ServiceSignature.uploadImage(image, authData);
      }

      const [day, month, year] = date.split("/");
      const [hour, minute] = time.split(":");
      const isoDateTime = `${year}-${month}-${day}T${hour}:${minute}:00`;

      const newOccurrence = {
        petId: petId,
        type: type,
        title: title,
        description: description,
        occurrenceDate: isoDateTime,
        photoUrl: finalPhotoUrl, // Agora envia a URL real do Cloudinary
      };

      // 3. Salva a ocorrência no seu MySQL/PostgreSQL via API
      await ServiceOccurrence.register(newOccurrence);

      Alert.alert("Sucesso", "Ocorrência registrada!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao processar o registro ou upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 35 }}>
          <ButtonRollback navigation={navigation} disabled={loading} />
        </View>

        <View style={styles.headerBox}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: petColor + "20" || "#F4A36120" },
            ]}
          >
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={35}
              color={petColor || "#F4A361"}
            />
          </View>
          <Text style={styles.headerText}>Nova Ocorrência</Text>
          <Text style={styles.petNameText}>
            Relato para <Text style={{ fontWeight: "bold" }}>{petName}</Text>
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
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Hora</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={handleTimeChange}
                placeholder="HH:mm"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>

          <Text style={styles.label}>Relato Detalhado</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F1" },
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

  // Estilos da Foto
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
