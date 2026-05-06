import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import ServicePet from "../../services/ServicePet";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import ButtonRollback from "../../components/ButtonRollback";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceUser from "../../services/ServiceUser";
import FormatDateDisplay from "../../core/FormatDateDisplay";
import { FormatDateForRequisition } from "../../core/FormatDateDisplay";

export default function EditPetScreen({ navigation, route }) {
  const editingPet = route.params?.pet;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(editingPet?.name ?? "");
  const [breed, setBreed] = useState(editingPet?.breed ?? "");
  const [species, setSpecies] = useState("Cachorro");
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);
  const [sex, setSex] = useState(
    editingPet?.sex && editingPet.sex.toLowerCase() === "macho"
      ? "Macho"
      : "Femea",
  );
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [microchip, setMicrochip] = useState("");
  const [notes, setNotes] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const handleDelete = () => {
    Alert.alert(
      "Excluir Pet",
      `Tem certeza que deseja excluir ${editingPet?.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await ServicePet.delete(editingPet.id);
              Alert.alert("Sucesso", "Pet excluido com sucesso!");
              navigation.navigate("PetsHome", { newPet: true });
            } catch (error) {
              Alert.alert("Erro", "Nao foi possivel excluir o pet.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const loadingUserData = async () => {
    const userId = await AsyncStorage.getItem("@userId");
    try {
      const response = await ServiceUser.listById(userId);

      setOwnerName(response.name);
      setOwnerPhone(response.contact);
      setOwnerEmail(response.email);
    } catch (error) {
      Alert.alert("Error", "erro ao carregar os dados do usuario.");
      console.log(error);
    }
  };

  const loadingPet = async () => {
    const petId = editingPet.id;

    try {
      const response = await ServicePet.getById(petId);
      setBirthDate(
        response.birthDate ? FormatDateDisplay(response.birthDate) : "",
      );
      setWeight(
        response.weight !== null && response.weight !== undefined
          ? String(response.weight).replace(".", ",")
          : "",
      );
      setSpecies(response.specie);
      setColor(response.color);
      setMicrochip(response.microchip);
      setSex(response.sex);
      setNotes(response.observations);
    } catch (error) {
      Alert.alert("Error", "erro ao carregar os dados do pet.");
      console.log(error);
    }
  };

  useEffect(() => {
    loadingUserData();
    loadingPet();
  }, []);

  const handlerSave = async () => {
    setLoading(true);
    if (!name || !breed) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const birthDateFormat = FormatDateForRequisition(birthDate);

    const petAtualizado = {
      name,
      breed,
      specie: species,
      color: color,
      microchip: microchip || null,
      weight: weight ? Number(weight.replace(",", ".")) : null,
      birthDate: birthDateFormat,
      sex: sex,
      observations: notes,
      userId: await AsyncStorage.getItem("@userId"),
    };
    try {
      await ServicePet.update(editingPet.id, petAtualizado);

      Alert.alert("Sucesso", "Pet atualizado com sucesso!");
      navigation.navigate({
        name: "PetsHome",
        params: { newPet: true },
        merge: true,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel atualizar o pet.");
    } finally {
      setLoading(false);
      console.log(petAtualizado);
    }
  };

  const speciesOptions = [
    { label: "Cachorro", icon: "dog" },
    { label: "Gato", icon: "cat" },
    { label: "Coelho", icon: "paw" },
    { label: "Passaro", icon: "dove" },
    { label: "Hamster", icon: "paw" },
    { label: "Peixe", icon: "fish" },
  ];

  const selectedSpecies =
    speciesOptions.find((item) => item.label === species) || speciesOptions[0];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ButtonRollback navigation={navigation} disabled={loading} />
        <View style={styles.topBar}>
          <Text style={styles.titlePage}>Editar pet</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" color="#E14C4C" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../../../assets/dogProfile.png")}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
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
              {speciesOptions.map((option) => (
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

          <Text style={styles.fieldLabel}>Raca</Text>
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
                Femea
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Data de nascimento</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="10/05/2022"
              placeholderTextColor="#B9B1A9"
            />
            <Ionicons name="calendar" size={16} color="#B9B1A9" />
          </View>

          <Text style={styles.fieldLabel}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="4,2"
            placeholderTextColor="#B9B1A9"
          />

          <Text style={styles.fieldLabel}>Cor</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Tigrado"
            placeholderTextColor="#B9B1A9"
          />

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
          />

          <Text style={styles.fieldLabel}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={ownerPhone}
            onChangeText={setOwnerPhone}
            placeholder="(21) 99999-9999"
            placeholderTextColor="#B9B1A9"
          />

          <Text style={styles.fieldLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={ownerEmail}
            onChangeText={setOwnerEmail}
            placeholder="analucia@email.com"
            placeholderTextColor="#B9B1A9"
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handlerSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar alteracoes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7F1" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 10,
    position: "relative",
    minHeight: 48,
  },
  titlePage: {
    color: "#2B2B2B",
    fontSize: 18,
    fontWeight: "700",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 55,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F1E2D1",
  },
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
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  inputFlex: {
    flex: 1,
    fontSize: 14,
    color: "#2B2B2B",
    paddingVertical: 6,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 10,
    marginTop: 8,
  },
  saveButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 26,
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
