import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useState } from 'react'

export default function DetailsScreen({ route, navigation }) {

  const { petName, petBreed } = route.params;

  const [vaccines, setVaccines] = useState([
    { id: '1', name: 'Antirrábica', date: '10/01/2026', applied: true },
    { id: '2', name: 'V10', date: '15/02/2026', applied: false },
    { id: '3', name: 'Gripe Canina', date: '20/03/2026', applied: true },
  ]);

  const renderVaccineItem = ({ item }) => (
    <View style={styles.vaccineCard}>
      <View>
        <Text style={styles.vaccineName}>{item.name}</Text>
        <Text style={styles.vaccineDate}>Data: {item.date}</Text>
      </View>

      <View style={[
        styles.statusBadge,
        { backgroundColor: item.applied ? '#C8E6C9' : '#FFCDD2' }
      ]}>
        <Text style={[
          styles.statusText,
          { color: item.applied ? '#2E7D32' : '#C62828' }
        ]}>
          {item.applied ? 'Aplicada' : 'Pendente'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carteira de: {petName}</Text>
        <Text style={styles.breed}>Raça: {petBreed}</Text>
      </View>

      <FlatList
        data={vaccines}
        keyExtractor={item => item.id}
        renderItem={renderVaccineItem}
        contentContainerStyle={styles.listPadding}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => alert('Em breve: Registrar Vacina')}
      >
        <Text style={styles.addButtonText}>Registrar Nova Dose</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#007AFF', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  listPadding: { padding: 15 },
  vaccineCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1
  },
  vaccineName: { fontSize: 16, fontWeight: 'bold' },
  vaccineDate: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});