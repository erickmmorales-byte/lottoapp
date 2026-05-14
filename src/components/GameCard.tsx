import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Game } from "../games";
import { Draw } from "../lottery";
import { NumberBall } from "./NumberBall";

export function GameCard({ game, draw }: { game: Game; draw: Draw }) {
  return (
    <View style={[styles.card, { borderColor: game.accent + "55" }]}>
      <View style={styles.header}>
        <View style={[styles.accent, { backgroundColor: game.accent }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{game.name}</Text>
          <Text style={styles.tagline}>{game.tagline}</Text>
        </View>
      </View>
      <View style={styles.balls}>
        {draw.main.map((n, i) => (
          <NumberBall key={`m-${i}`} value={n} variant="main" />
        ))}
        {draw.bonus?.map((n, i) => (
          <NumberBall key={`b-${i}`} value={n} variant="bonus" accent={game.accent} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  accent: { width: 4, height: 28, borderRadius: 2, marginRight: 10 },
  name: { color: "#fff", fontSize: 17, fontWeight: "700" },
  tagline: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },
  balls: { flexDirection: "row", flexWrap: "wrap" },
});
