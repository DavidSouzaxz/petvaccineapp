import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api"; // Certifique-se de importar sua instância do axios

// Imports das Telas
import HomeScreen from "../screens/pets/HomeScreen";
import DetailsScreen from "../screens/pets/DetailsScreen";
import AddPetScreen from "../screens/pets/AddPetScreen";
import EditPetScreen from "../screens/pets/EditPetScreen";
import AddVaccineScreen from "../screens/pets/AddVaccineScreen";
import MapScreen from "../screens/map/MapScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import DashboardScreen from "../screens/map/DashboardScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const handleLogout = () => {
  AsyncStorage.clear();
  setUserToken(null);
};

function AuthNavigator({ onSignIn }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => <LoginScreen {...props} onSignIn={onSignIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function PetStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Meus Pets", headerLeft: () => null }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: "Vacinas" }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ title: "Novo Pet" }}
      />
      <Stack.Screen
        name="EditPet"
        component={EditPetScreen}
        options={{ title: "Editar Pet" }}
      />
      <Stack.Screen
        name="AddVaccine"
        component={AddVaccineScreen}
        options={{ title: "Registrar Vacina" }}
      />
    </Stack.Navigator>
  );
}

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="FullMap" component={MapScreen} />
    </Stack.Navigator>
  );
}

export default function Routes() {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSignIn = (token) => {
    setUserToken(token);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setUserToken(null);
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        setUserToken(token);
      } catch (e) {
        console.error("Erro ao ler token", e);
      } finally {
        setLoading(false);
      }
    };
    checkToken();

    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await handleLogout();
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  if (loading) return null;

  return userToken == null ? (
    <AuthNavigator onSignIn={handleSignIn} />
  ) : (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Pets") iconName = "paw";
          else if (route.name === "Clinicas") iconName = "map";
          else if (route.name === "Perfil") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#F4A361",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Pets" component={PetStack} />
      <Tab.Screen name="Clinicas" component={MapStack} />
      <Tab.Screen name="Perfil">
        {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
