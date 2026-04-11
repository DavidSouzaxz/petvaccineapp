import { useState } from "react";
import { TouchableOpacity, View, TextInput, StyleSheet, Text, Alert } from "react-native";


export default function AddPetScreen({ navigation, route }) {
  const [name, setName] = useState()
  const [breed, setBreed] = useState()

  const handlerSave = () => {
    if (!name || !breed) {
      Alert.alert('Preencha todos os campos')
      return
    }

    const newPet = {
      id: Math.random().toString(),
      name,
      breed
    }

    navigation.navigate('Home', { newPet })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Pet:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Totó"
      />
      <Text style={styles.label}>Raça do Pet:</Text>
      <TextInput
        style={styles.input}
        value={breed}
        onChangeText={setBreed}
        placeholder="Ex: Douberman"
      />

      <TouchableOpacity style={styles.button} onPress={handlerSave}>
        <Text style={styles.buttonText}>Salvar Pet</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});