import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AdBanner } from "./AdBanner";

type Props = {
  visible: boolean;
  durationSec?: number;
  onComplete: () => void;
  onCancel: () => void;
};

export function RegenerateAdGate({
  visible,
  durationSec = 10,
  onComplete,
  onCancel,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(durationSec);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [visible, durationSec]);

  const ready = secondsLeft === 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Sponsored</Text>
            <Text style={styles.title}>Watch a quick ad for fresh numbers</Text>
            <Text style={styles.subtitle}>
              Hang tight — your new reading unlocks in a moment.
            </Text>
          </View>

          <View style={styles.adArea}>
            <Text style={styles.adAreaLabel}>VIDEO AD</Text>
            <AdBanner />
          </View>

          <View style={styles.timerRow}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerNumber}>{ready ? "✓" : secondsLeft}</Text>
            </View>
            <Text style={styles.timerLabel}>
              {ready ? "Ready!" : `Unlocking in ${secondsLeft}s…`}
            </Text>
          </View>

          <Pressable
            onPress={ready ? onComplete : undefined}
            disabled={!ready}
            style={({ pressed }) => [
              styles.cta,
              !ready && styles.ctaDisabled,
              pressed && ready && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.ctaText, !ready && styles.ctaTextDisabled]}>
              {ready ? "Reveal my numbers" : `Please wait (${secondsLeft})`}
            </Text>
          </Pressable>

          <Pressable onPress={onCancel} hitSlop={10} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    backgroundColor: "#150330",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
  },
  header: { marginBottom: 12 },
  eyebrow: {
    color: "#fde68a",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 },
  adArea: {
    minHeight: 180,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 14,
  },
  adAreaLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 10,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  timerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245,158,11,0.18)",
    borderWidth: 2,
    borderColor: "rgba(245,158,11,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  timerNumber: { color: "#fde68a", fontSize: 16, fontWeight: "800" },
  timerLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  cta: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f59e0b",
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "rgba(255,255,255,0.1)" },
  ctaText: { color: "#0a0118", fontWeight: "800", fontSize: 15 },
  ctaTextDisabled: { color: "rgba(255,255,255,0.5)" },
  cancel: { alignSelf: "center", marginTop: 10, padding: 6 },
  cancelText: { color: "rgba(255,255,255,0.45)", fontSize: 12 },
});
