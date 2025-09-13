import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from "react-native";

interface IButtonProps extends TouchableOpacityProps {
  label: string;
}

export function Button({ label, ...props }: IButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      {...props}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
