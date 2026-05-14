import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type TabId = "generate" | "history" | "about";

type Tab = { id: TabId; label: string; icon: string };

const TABS: Tab[] = [
  { id: "generate", label: "Generate", icon: "★" },
  { id: "history", label: "History", icon: "◔" },
  { id: "about", label: "About", icon: "ⓘ" },
];

type Props = { active: TabId; onChange: (id: TabId) => void };

export function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <Pressable key={t.id} style={styles.tab} onPress={() => onChange(t.id)}>
            <Text style={[styles.icon, on && styles.iconActive]}>{t.icon}</Text>
            <Text style={[styles.label, on && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 6 },
  icon: { fontSize: 18, color: "rgba(255,255,255,0.45)" },
  iconActive: { color: "#f59e0b" },
  label: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2, fontWeight: "600" },
  labelActive: { color: "#fff" },
});
