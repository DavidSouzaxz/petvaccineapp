import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import AddPetScreen from '../screens/AddPetScreen';
import AddVaccineScreen from '../screens/AddVaccineScreen';


import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function PetStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Meus Pets' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Vacinas' }} />
      <Stack.Screen name="AddPet" component={AddPetScreen} options={{ title: 'Novo Pet' }} />
      <Stack.Screen name="AddVaccine" component={AddVaccineScreen} options={{ title: 'Registrar Vacina' }} />
    </Stack.Navigator>
  );
}

// 2. O Navegador principal agora são as TABS
export default function Routes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Pets') iconName = 'paw';
          else if (route.name === 'Mapa') iconName = 'map';
          else if (route.name === 'Perfil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Escondemos o header da Tab porque o Stack já tem o dele
      })}
    >
      <Tab.Screen name="Pets" component={PetStack} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}