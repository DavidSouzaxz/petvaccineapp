import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Pet Vaccine' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Vacinas' }}
      />
    </Stack.Navigator>
  );
}