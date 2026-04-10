import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetailsScreen({ route, navigation }) {

  const { petName, petBreed } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteira de: {petName}</Text>
      <Text style={styles.breed}>Raça: {petBreed}</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    marginBottom: 20
  },
  breed: {
    fontSize: 20,
    marginBottom: 20
  }
})