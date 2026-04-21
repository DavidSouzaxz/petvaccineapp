import { Linking } from "react-native";

const OpenGoogleMaps = (clinic) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name, ",", clinic.address)}&query_place_id=${clinic.id}`;
  Linking.openURL(url).catch((err) =>
    console.error("Erro ao abrir Google Maps: ", err),
  );
};

export default OpenGoogleMaps;
