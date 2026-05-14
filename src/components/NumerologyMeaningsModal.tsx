import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NumerologyProfile } from "../numerology";
import { NUMBER_MEANINGS, SECTIONS } from "../numerologyMeanings";

type Props = {
  visible: boolean;
  profile: NumerologyProfile | null;
  onClose: () => void;
};

export function NumerologyMeaningsModal({ visible, profile, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>What do these numbers mean?</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.intro}>
              Numerology is the playful idea that numbers carry meaning. Below, each of your
              numbers is explained — what it represents in general, plus what your specific
              number traditionally signals.
            </Text>

            {SECTIONS.map((section) => {
              const value = profile ? profile[section.key] : undefined;
              const showValue = typeof value === "number" && value > 0;
              const meaning = showValue ? NUMBER_MEANINGS[value!] : undefined;
              return (
                <View key={section.key} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {showValue ? (
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberBadgeText}>{value}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.blurb}>{section.blurb}</Text>
                  {meaning ? (
                    <View style={styles.meaningCard}>
                      <Text style={styles.meaningKeyword}>{meaning.keyword}</Text>
                      <Text style={styles.meaningDescription}>{meaning.description}</Text>
                    </View>
                  ) : section.key === "birthHour" ? (
                    <Text style={styles.notProvided}>
                      You didn't add a time of birth — try adding one to unlock this number.
                    </Text>
                  ) : null}
                </View>
              );
            })}

            <Text style={styles.disclaimer}>
              These meanings are drawn from traditional numerology and are shared for
              entertainment. Take what resonates, leave the rest.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#150330",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
    maxHeight: "88%",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", flex: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: "#fff", fontSize: 14 },
  scroll: { paddingBottom: 30 },
  intro: { color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 19, marginBottom: 14 },
  section: {
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  sectionTitle: {
    color: "#fde68a",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    flex: 1,
  },
  numberBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 8,
    backgroundColor: "rgba(245,158,11,0.2)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  numberBadgeText: { color: "#fde68a", fontWeight: "800", fontSize: 15 },
  blurb: { color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 19, marginBottom: 10 },
  meaningCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(245,158,11,0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  meaningKeyword: { color: "#fde68a", fontWeight: "800", fontSize: 14, marginBottom: 4 },
  meaningDescription: { color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 19 },
  notProvided: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontStyle: "italic" },
  disclaimer: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    lineHeight: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
  },
});
