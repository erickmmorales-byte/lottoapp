import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
};

export function SegmentedControl<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.seg, active && styles.segActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  seg: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 9 },
  segActive: { backgroundColor: "rgba(245,158,11,0.9)" },
  label: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
  labelActive: { color: "#1a0b2e", fontWeight: "800" },
});
