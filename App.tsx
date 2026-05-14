import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { GAMES, Game } from "./src/games";
import { generateDraw, Draw, UserInputs } from "./src/lottery";
import { NumberBall } from "./src/components/NumberBall";
import { Disclaimer } from "./src/components/Disclaimer";
import { AdBanner } from "./src/components/AdBanner";

export default function App() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [hometown, setHometown] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [draws, setDraws] = useState<Draw[] | null>(null);

  const canGenerate = name.trim() && dob.trim() && hometown.trim();

  const inputs: UserInputs = useMemo(
    () => ({ name, dob, hometown, timeOfBirth: timeOfBirth || undefined }),
    [name, dob, hometown, timeOfBirth],
  );

  const onGenerate = () => {
    if (!canGenerate) return;
    setDraws(GAMES.map((g) => generateDraw(g, inputs)));
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#1a0b2e", "#2d0a4e", "#0b0820"]}
        style={styles.gradient}
      >
        <StatusBar style="light" />
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.flex}
          >
            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
            >
              <Header />
              <Form
                name={name}
                dob={dob}
                hometown={hometown}
                timeOfBirth={timeOfBirth}
                onChange={{
                  setName,
                  setDob,
                  setHometown,
                  setTimeOfBirth,
                }}
              />
              <GenerateButton disabled={!canGenerate} onPress={onGenerate} />
              {draws && <Results draws={draws} />}
              <Disclaimer />
            </ScrollView>
            <AdBanner />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>★ Lucky Numbers</Text>
      <Text style={styles.subtitle}>
        Personalized picks for Powerball, Mega Millions & California games
      </Text>
    </View>
  );
}

type FormProps = {
  name: string;
  dob: string;
  hometown: string;
  timeOfBirth: string;
  onChange: {
    setName: (v: string) => void;
    setDob: (v: string) => void;
    setHometown: (v: string) => void;
    setTimeOfBirth: (v: string) => void;
  };
};

function Form({ name, dob, hometown, timeOfBirth, onChange }: FormProps) {
  return (
    <View style={styles.card}>
      <Field label="Full name" value={name} onChange={onChange.setName} placeholder="Jane Doe" />
      <Field
        label="Date of birth"
        value={dob}
        onChange={onChange.setDob}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
      />
      <Field
        label="Hometown"
        value={hometown}
        onChange={onChange.setHometown}
        placeholder="Sacramento, CA"
      />
      <Field
        label="Time of birth (optional)"
        value={timeOfBirth}
        onChange={onChange.setTimeOfBirth}
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
      />
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numbers-and-punctuation";
};

function Field({ label, value, onChange, placeholder, keyboardType }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        keyboardType={keyboardType ?? "default"}
        autoCapitalize={label === "Full name" || label === "Hometown" ? "words" : "none"}
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

function GenerateButton({ disabled, onPress }: { disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.cta,
        disabled && styles.ctaDisabled,
        pressed && !disabled && styles.ctaPressed,
      ]}
    >
      <Text style={styles.ctaText}>Generate my lucky numbers</Text>
    </Pressable>
  );
}

function Results({ draws }: { draws: Draw[] }) {
  return (
    <View style={styles.results}>
      {draws.map((draw) => {
        const game = GAMES.find((g) => g.id === draw.gameId)!;
        return <GameCard key={game.id} game={game} draw={draw} />;
      })}
    </View>
  );
}

function GameCard({ game, draw }: { game: Game; draw: Draw }) {
  return (
    <View style={[styles.gameCard, { borderColor: game.accent + "55" }]}>
      <View style={styles.gameHeader}>
        <View style={[styles.accentBar, { backgroundColor: game.accent }]} />
        <View style={styles.flex}>
          <Text style={styles.gameName}>{game.name}</Text>
          <Text style={styles.gameTagline}>{game.tagline}</Text>
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
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingBottom: 16 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  brand: { color: "#fff", fontSize: 30, fontWeight: "800", letterSpacing: 0.5 },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  field: { marginBottom: 12 },
  fieldLabel: {
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
  cta: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    shadowColor: "#f59e0b",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  ctaPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  ctaDisabled: { backgroundColor: "rgba(255,255,255,0.12)", shadowOpacity: 0 },
  ctaText: { color: "#1a0b2e", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },
  results: { marginTop: 20 },
  gameCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
  },
  gameHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  accentBar: { width: 4, height: 28, borderRadius: 2, marginRight: 10 },
  gameName: { color: "#fff", fontSize: 17, fontWeight: "700" },
  gameTagline: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },
  balls: { flexDirection: "row", flexWrap: "wrap" },
});
