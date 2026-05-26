import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ButtonRollback({
  navigation,
  backgroundColor = "transparent",
  color = "#333",
  disabled,
}) {
  return (
    <TouchableOpacity
      style={[styles.backButton, { backgroundColor, color }]}
      onPress={() => navigation.goBack()}
      disabled={disabled}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 22,
    width: "13%",
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
    // elevation: 5,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
  },
});
