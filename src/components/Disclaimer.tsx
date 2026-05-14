import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Disclaimer() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>For entertainment only</Text>
      <Text style={styles.body}>
        Lucky Numbers is for fun and is not affiliated with, endorsed by, or sponsored by any
        lottery, the Multi-State Lottery Association, the California State Lottery, or any
        government agency. Numbers are randomly generated and have no greater chance of winning
        than any other set. Please play responsibly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  title: {
    color: "#fde68a",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  body: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 17,
  },
});
