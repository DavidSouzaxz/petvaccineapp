import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation, route }) {

  const [pets, setPets] = useState([
    { id: 1, name: 'Bob', breed: 'Pisncher' },
    { id: 2, name: 'Mia', breed: 'Douberman' },
    { id: 3, name: 'Luna', breed: 'Pastor Alemão' },
  ]);

  useEffect(() => {
    if (route.params?.newPet) {
      setPets((prevPets) => [...prevPets, route.params.newPet])
    }
  }, [route.params?.newPet])

  const renderPetItem = ({ item }) => (
    <TouchableOpacity style={styles.petCard} onPress={() => navigation.navigate('Details', { petName: item.name, petBreed: item.breed })}>
      <View>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petBreed}>{item.breed}</Text>
      </View>
      <Text style={styles.arrow}>&gt;</Text>

    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={renderPetItem}
        ListEmptyComponent={<Text>Nenhum Pet cadastrado.</Text>}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 20 },
  petCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,

    elevation: 2,
  },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  petBreed: { fontSize: 14, color: '#666' },
  arrow: { fontSize: 18, color: '#ccc' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' }
});