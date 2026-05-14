import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HistoryEntry } from "../storage";
import { GAMES } from "../games";
import { GameCard } from "../components/GameCard";

export function HistoryScreen({ entries }: { entries: HistoryEntry[] }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved readings</Text>
        <Text style={styles.subtitle}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Your saved readings will appear here. Generate numbers, then tap Save.
          </Text>
        </View>
      ) : (
        entries.map((entry) => (
          <View key={entry.id} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryLabel}>{entry.label}</Text>
              <Text style={styles.entryDate}>{formatDate(entry.createdAt)}</Text>
            </View>
            {entry.subtitle && <Text style={styles.entrySubtitle}>{entry.subtitle}</Text>}
            <Text style={styles.entryMode}>
              {entry.mode === "numerology" ? "Numerology reading" : "Horoscope reading"}
            </Text>
            {entry.draws.map((draw) => {
              const game = GAMES.find((g) => g.id === draw.gameId);
              if (!game) return null;
              return <GameCard key={`${entry.id}-${game.id}`} game={game} draw={draw} />;
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: "#fff", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 },
  empty: { marginHorizontal: 20, padding: 20, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.04)" },
  emptyText: { color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 18, textAlign: "center" },
  entry: { marginBottom: 16 },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 20,
    marginBottom: 2,
  },
  entryLabel: { color: "#fff", fontSize: 16, fontWeight: "700" },
  entryDate: { color: "rgba(255,255,255,0.5)", fontSize: 11 },
  entrySubtitle: { color: "rgba(255,255,255,0.6)", fontSize: 12, paddingHorizontal: 20 },
  entryMode: {
    color: "#fde68a",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
});
