import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AddVaccineScreen({ navigation, route }) {
  // Pegamos o nome do pet que veio da tela de Detalhes
  const { petName } = route.params;

  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleSave = () => {
    if (!name || !date) {
      Alert.alert('Atenção', 'Por favor, preencha o nome da vacina e a data.');
      return;
    }

    // Criamos o objeto da nova vacina
    const newVaccine = {
      id: Math.random().toString(),
      name: name,
      date: date,
      applied: true, // Por padrão, ao registrar manualmente, marcamos como aplicada
    };


    navigation.navigate('Details', { newVaccine });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Registrar vacina para: {petName}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome da Vacina</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Antirrábica, V10..."
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Data da Aplicação</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar na Carteira</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 30,
    textAlign: 'center'
  },
  form: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#333'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center'
  },
  cancelButtonText: { color: '#FF3B30', fontSize: 14 }
});