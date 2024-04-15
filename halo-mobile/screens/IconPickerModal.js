import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const IconPickerModal = ({ onIconPick, onClose }) => {
  const availableIcons = ["😊", "🌟", "💖", "🎉", "👍", "🌈"]; // Các biểu tượng có sẵn

  const handleIconPick = (selectedIcon) => {
    if (onIconPick && typeof onIconPick === "function") {
      onIconPick(selectedIcon);
      closeIconPickerModal();
    }
  };

  const closeIconPickerModal = () => {
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose an Icon</Text>
          <View style={styles.iconContainer}>
            {availableIcons.map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconButton}
                onPress={() => handleIconPick(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={closeIconPickerModal}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconButton: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  iconText: {
    fontSize: 20,
  },
  closeButton: {
    backgroundColor: "#3498db",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default IconPickerModal;
