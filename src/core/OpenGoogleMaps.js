import { Linking } from "react-native";

const OpenGoogleMaps = async (clinic) => {

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + "," + clinic.address)}&query_place_id=${clinic.id}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
      return true;
    }

    return false;
  } catch (err) {
    console.error("Erro ao abrir Google Maps: ", err);
    return false;
  }
};

export default OpenGoogleMaps;