import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ConfirmationModal({
  visible,
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="help-outline" size={40} color="#E98B3A" />
          </View>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => onCancel(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => onConfirm(true)}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    width: "85%",
    alignItems: "center",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF9F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#2B2B2B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#EFE2D7",
  },
  confirmButton: {
    backgroundColor: "#E98B3A",
  },
  cancelButtonText: {
    color: "#999",
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
