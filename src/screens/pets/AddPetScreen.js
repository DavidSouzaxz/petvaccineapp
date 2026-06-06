import { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { AlertModal } from "../../components/modals";
import ServicePet from "../../services/ServicePet";
import ServiceSignature from "../../services/ServiceSignature";
import FormatDateDisplay, {
  FormatDateForRequisition,
} from "../../core/FormatDateDisplay";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceUser from "../../services/ServiceUser";
import ButtonRollback from "../../components/ButtonRollback";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import InputDatePicker from "../../components/InputDatePicker";
import { SPECIES_OPTIONS, SPECIES_IMAGES } from "../../constants/species";

export default function AddPetScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [species, setSpecies] = useState("Cachorro");
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);
  const [sex, setSex] = useState("Femea");
  const [birthDate, setBirthDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [microchip, setMicrochip] = useState("");
  const [notes, setNotes] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(FormatDateDisplay(selectedDate));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDismiss = () => {
    setShowDatePicker(false);
  };

  const loadUserData = async () => {
    const id = await AsyncStorage.getItem("@userId");

    try {
      const response = await ServiceUser.listById(id);
      setUserId(id);
      setOwnerName(response.name);
      setOwnerPhone(response.contact);
      setOwnerEmail(response.email);
    } catch (error) {
      setAlertMessage("erro ao carregar os dados do usuario.");
      setAlertVisible(true);
      console.log(error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setAlertVisible(false);
      };
    }, []),
  );

  const handlerSave = async () => {
    setLoading(true);
    if (!name || !breed) {
      setAlertMessage("Preencha todos os campos");
      setAlertVisible(true);
      setLoading(false);
      return;
    }

    try {
      let finalPhotoUrl = null;

      if (image) {
        const authData = await ServiceSignature.getSignature();
        finalPhotoUrl = await ServiceSignature.uploadImage(image, authData);
      }

      const birthDateFormat = FormatDateForRequisition(birthDate);

      const newPet = {
        name: name,
        specie: species,
        breed: breed,

        birthDate: birthDateFormat,
        microchip: microchip || null,
        weight: weight ? Number(weight.replace(",", ".")) : null,
        sex: sex,
        observations: notes,
        userId: userId,
        photoUrl: finalPhotoUrl,
      };

      await ServicePet.register(newPet);

      setAlertMessage("Pet cadastrado com sucesso!");
      setAlertVisible(true);
      setTimeout(() => {
        navigation.navigate({
          name: "PetsHome",
          params: { newPet: true },
          merge: true,
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      setAlertMessage("Não foi possível registrar o pet.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const selectedSpecies =
    SPECIES_OPTIONS.find((item) => item.label === species) ||
    SPECIES_OPTIONS[0];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ButtonRollback
          navigation={navigation}
          disabled={loading}
          backgroundColor="transparent"
        />
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Cadastrar</Text>
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
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={image ? { uri: image } : SPECIES_IMAGES[species]}
              style={styles.avatarImage}
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickImage}
              disabled={loading}
            >
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Nome do pet</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Sofia"
            placeholderTextColor="#B9B1A9"
          />

          <Text style={styles.fieldLabel}>Especie</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setIsSpeciesOpen((current) => !current)}
          >
            <View style={styles.selectLeft}>
              <FontAwesome6
                name={selectedSpecies.icon}
                size={16}
                color="#E98B3A"
              />
              <Text style={styles.selectText}>{selectedSpecies.label}</Text>
            </View>
            <Ionicons
              name={isSpeciesOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color="#B9B1A9"
            />
          </TouchableOpacity>
          {isSpeciesOpen && (
            <View style={styles.selectMenu}>
              {SPECIES_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={styles.selectMenuItem}
                  onPress={() => {
                    setSpecies(option.label);
                    setIsSpeciesOpen(false);
                  }}
                >
                  <FontAwesome6 name={option.icon} size={16} color="#E98B3A" />
                  <Text style={styles.selectMenuText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.fieldLabel}>Raça</Text>
          <TextInput
            style={styles.input}
            value={breed}
            onChangeText={setBreed}
            placeholder="Gato SRD"
            placeholderTextColor="#B9B1A9"
          />

          <Text style={styles.fieldLabel}>Sexo</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentItem,
                sex === "Macho" ? styles.segmentActive : styles.segmentInactive,
              ]}
              onPress={() => setSex("Macho")}
            >
              <Text
                style={
                  sex === "Macho"
                    ? styles.segmentTextActive
                    : styles.segmentText
                }
              >
                Macho
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentItem,
                sex === "Femea" ? styles.segmentActive : styles.segmentInactive,
              ]}
              onPress={() => setSex("Femea")}
            >
              <Text
                style={
                  sex === "Femea"
                    ? styles.segmentTextActive
                    : styles.segmentText
                }
              >
                Fêmea
              </Text>
            </TouchableOpacity>
          </View>
          <InputDatePicker
            label={"Data de Nascimento"}
            value={birthDate}
            onChange={(val) => setBirthDate(val)}
            dateMode="yesterday"
            styleLabel={{
              fontSize: 12,
              color: "#9A948E",
              marginBottom: 6,
              fontWeight: "600",
            }}
          />

          <Text style={styles.fieldLabel}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="4,2"
            placeholderTextColor="#B9B1A9"
          />

          {/* <Text style={styles.fieldLabel}>Cor</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Tigrado"
            placeholderTextColor="#B9B1A9"
          /> */}

          <Text style={styles.fieldLabel}>Microchip (opcional)</Text>
          <TextInput
            style={styles.input}
            value={microchip}
            onChangeText={setMicrochip}
            placeholder="123456789012345"
            placeholderTextColor="#B9B1A9"
          />

          <Text style={styles.fieldLabel}>Observacoes (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Observacoes sobre o pet"
            placeholderTextColor="#B9B1A9"
            multiline
          />
        </View>

        <Text style={styles.sectionTitle}>Contatos do responsavel</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Ana Lucia"
            placeholderTextColor="#B9B1A9"
            editable={false}
          />

          <Text style={styles.fieldLabel}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={ownerPhone}
            onChangeText={setOwnerPhone}
            placeholder="(21) 99999-9999"
            placeholderTextColor="#B9B1A9"
            editable={false}
          />

          <Text style={styles.fieldLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={ownerEmail}
            onChangeText={setOwnerEmail}
            placeholder="analucia@email.com"
            placeholderTextColor="#B9B1A9"
            editable={false}
          />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handlerSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 20,
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
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B2B2B",
  },
  titleBox: {
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3e8dd98",
  },
  headerSpacer: { width: 36, height: 36 },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarWrapper: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "#FBE6D6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: 112, height: 112, borderRadius: 56 },
  cameraButton: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E98B3A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3E8DD",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#9A948E",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 14,
    color: "#2B2B2B",
  },
  selectInput: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  selectLeft: { flexDirection: "row", alignItems: "center" },
  selectText: { marginLeft: 8, color: "#2B2B2B", fontWeight: "600" },
  selectMenu: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    paddingVertical: 6,
    marginTop: -6,
    marginBottom: 14,
  },
  selectMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectMenuText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#2B2B2B",
    fontWeight: "600",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#FFF9F4",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#EFE2D7",
    marginBottom: 14,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },
  segmentActive: { backgroundColor: "#FBE5D4" },
  segmentInactive: { backgroundColor: "transparent" },
  segmentText: { color: "#8F8F8F", fontWeight: "600", fontSize: 13 },
  segmentTextActive: { color: "#E98B3A", fontWeight: "700", fontSize: 13 },
  inputWithIcon: {
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "#EFE2D7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  inputDateText: { fontSize: 14, color: "#2B2B2B" },
  textArea: { height: 90, textAlignVertical: "top" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 10,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#E98B3A",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
