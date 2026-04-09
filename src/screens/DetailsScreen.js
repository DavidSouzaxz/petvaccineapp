import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetailsScreen({ route, navigation }) {

  const { petName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carteira de: {petName}</Text>
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
  }
})