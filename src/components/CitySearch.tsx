import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CityResult, searchCities } from "../services/cities";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function CitySearch({ label, value, onChange, placeholder }: Props) {
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const justPickedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (justPickedRef.current) {
      justPickedRef.current = false;
      setResults([]);
      setLoading(false);
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const r = await searchCities(q, controller.signal);
      if (!controller.signal.aborted) {
        setResults(r);
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const choose = (label: string) => {
    justPickedRef.current = true;
    onChange(label);
    setResults([]);
    setLoading(false);
  };

  const showPanel = loading || results.length > 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        autoCapitalize="words"
        autoCorrect={false}
        style={styles.input}
      />
      {showPanel && (
        <View style={styles.panel}>
          {loading && (
            <View style={styles.row}>
              <ActivityIndicator size="small" color="#f59e0b" />
              <Text style={[styles.rowText, { marginLeft: 8 }]}>Searching cities…</Text>
            </View>
          )}
          {results.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => choose(r.label)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.rowText} numberOfLines={1}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
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
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  panel: {
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  rowPressed: { backgroundColor: "rgba(245,158,11,0.15)" },
  rowText: { color: "#fff", fontSize: 14 },
});
