import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  value: number;
  variant?: "main" | "bonus";
  accent?: string;
};

export function NumberBall({ value, variant = "main", accent = "#ffffff" }: Props) {
  const isBonus = variant === "bonus";
  return (
    <View
      style={[
        styles.ball,
        isBonus
          ? { backgroundColor: accent, shadowColor: accent }
          : { backgroundColor: "#ffffff", shadowColor: "#ffffff" },
      ]}
    >
      <Text style={[styles.text, isBonus && { color: "#040108" }]}>
        {value.toString().padStart(2, "0")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0a0118",
    fontVariant: ["tabular-nums"],
  },
});
