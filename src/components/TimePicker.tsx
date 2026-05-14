import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Option = { value: string; label: string };

const ITEM_HEIGHT = 48;

const OPTIONS: Option[] = (() => {
  const out: Option[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const h12 = ((h + 11) % 12) + 1;
      const ampm = h < 12 ? "AM" : "PM";
      out.push({
        value: `${hh}:${mm}`,
        label: `${h12}:${mm} ${ampm}   ·   ${hh}:${mm}`,
      });
    }
  }
  return out;
})();

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function TimePicker({ label, value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);

  const display = useMemo(() => {
    if (!value) return placeholder ?? "Tap to select";
    return OPTIONS.find((o) => o.value === value)?.label ?? value;
  }, [value, placeholder]);

  const selectedIndex = useMemo(() => {
    const idx = OPTIONS.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  }, [value]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.input, pressed && { opacity: 0.8 }]}
      >
        <Text style={[styles.displayText, !value && styles.placeholder]} numberOfLines={1}>
          {display}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Time of birth</Text>
            <Text style={styles.sheetHint}>12-hour · 24-hour</Text>
            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item.value}
              getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
              initialScrollIndex={selectedIndex}
              initialNumToRender={20}
              windowSize={11}
              style={styles.list}
              renderItem={({ item }) => {
                const selected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && { backgroundColor: "rgba(245,158,11,0.15)" },
                    ]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
  },
  displayText: { flex: 1, color: "#fff", fontSize: 16 },
  placeholder: { color: "rgba(255,255,255,0.35)" },
  chevron: { color: "rgba(255,255,255,0.5)", marginLeft: 8, fontSize: 14 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#150330",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 14,
    maxHeight: "75%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 10,
  },
  sheetTitle: { color: "#fff", fontSize: 18, fontWeight: "800", textAlign: "center" },
  sheetHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  list: { marginTop: 6 },
  option: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  optionSelected: { backgroundColor: "rgba(245,158,11,0.18)" },
  optionText: { flex: 1, color: "rgba(255,255,255,0.85)", fontSize: 15, fontVariant: ["tabular-nums"] },
  optionTextSelected: { color: "#fde68a", fontWeight: "800" },
  check: { color: "#fde68a", fontSize: 16, fontWeight: "800" },
});
