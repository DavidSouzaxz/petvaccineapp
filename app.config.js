export default {
  expo: {
    name: "PetCard Club",
    slug: "petcard-club",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/app-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/background_4.png",
      resizeMode: "contain",
      backgroundColor: "#FDF1E7",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.petcardclub.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/app-icon.png",
        backgroundColor: "#FDF1E7",
      },
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: "resize",
      package: "com.petcardclub.petcard",
      permissions: [
        "INTERNET",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-localization", "@react-native-community/datetimepicker"],
    extra: {
      eas: {
        projectId: "f5bf72c7-685a-4ec3-bb5b-3a5105038ed8",
      },
    },
    owner: "dvddoido",
  },
};
