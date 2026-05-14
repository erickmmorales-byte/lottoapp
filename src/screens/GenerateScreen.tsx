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
import { GAMES } from "../games";
import { Draw, generateAllDraws } from "../lottery";
import {
  NumerologyInputs,
  NumerologyProfile,
  buildNumerologySeed,
  computeProfile,
  freshSeedContext,
  profileSummary,
} from "../numerology";
import { SIGNS, Sign, buildHoroscopeSeed, dailyVibe } from "../horoscope";
import { SegmentedControl } from "../components/SegmentedControl";
import { GameCard } from "../components/GameCard";
import { Disclaimer } from "../components/Disclaimer";
import { RegenerateAdGate } from "../components/RegenerateAdGate";
import { HistoryEntry, saveEntry } from "../storage";

type Mode = "numerology" | "horoscope";

type Result = {
  mode: Mode;
  label: string;
  subtitle?: string;
  profile?: NumerologyProfile;
  signId?: string;
  draws: Draw[];
  tweak: number;
};

export function GenerateScreen({ onSaved }: { onSaved: () => void }) {
  const [mode, setMode] = useState<Mode>("numerology");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [hometown, setHometown] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [signId, setSignId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [adGateOpen, setAdGateOpen] = useState(false);

  const inputs: NumerologyInputs = useMemo(
    () => ({ name, dob, hometown, timeOfBirth: timeOfBirth || undefined }),
    [name, dob, hometown, timeOfBirth],
  );

  const canGenerateNumerology = name.trim() && dob.trim() && hometown.trim();
  const canGenerateHoroscope = !!signId;

  const generate = (tweak = 0) => {
    if (mode === "numerology") {
      if (!canGenerateNumerology) return;
      const profile = computeProfile(inputs);
      const seed = buildNumerologySeed(profile, freshSeedContext(tweak));
      setResult({
        mode: "numerology",
        label: inputs.name.trim() || "Reading",
        subtitle: `Life Path ${profile.lifePath} · Expression ${profile.expression}`,
        profile,
        draws: generateAllDraws(GAMES, seed),
        tweak,
      });
    } else {
      if (!signId) return;
      const sign = SIGNS.find((s) => s.id === signId)!;
      const seed = buildHoroscopeSeed(sign.id, freshSeedContext(tweak));
      setResult({
        mode: "horoscope",
        label: `${sign.symbol} ${sign.name}`,
        subtitle: dailyVibe(sign.id),
        signId: sign.id,
        draws: generateAllDraws(GAMES, seed),
        tweak,
      });
    }
  };

  const requestRegenerate = () => {
    if (!result) return;
    setAdGateOpen(true);
  };

  const completeRegenerate = () => {
    setAdGateOpen(false);
    generate((result?.tweak ?? 0) + 1);
  };

  const save = async () => {
    if (!result) return;
    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      createdAt: Date.now(),
      mode: result.mode,
      label: result.label,
      subtitle: result.subtitle,
      profile: result.profile,
      signId: result.signId,
      draws: result.draws,
    };
    await saveEntry(entry);
    onSaved();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>★ Lucky Numbers</Text>
          <Text style={styles.subtitle}>
            Powerball, Mega Millions & California games — your way
          </Text>
        </View>

        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { value: "numerology", label: "Numerology" },
            { value: "horoscope", label: "Horoscope" },
          ]}
        />

        {mode === "numerology" ? (
          <NumerologyForm
            name={name}
            dob={dob}
            hometown={hometown}
            timeOfBirth={timeOfBirth}
            setName={setName}
            setDob={setDob}
            setHometown={setHometown}
            setTimeOfBirth={setTimeOfBirth}
          />
        ) : (
          <SignPicker signId={signId} onPick={setSignId} />
        )}

        <Pressable
          onPress={() => generate(0)}
          disabled={mode === "numerology" ? !canGenerateNumerology : !canGenerateHoroscope}
          style={({ pressed }) => [
            styles.cta,
            (mode === "numerology" ? !canGenerateNumerology : !canGenerateHoroscope) &&
              styles.ctaDisabled,
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaText}>
            {mode === "numerology" ? "Reveal my lucky numbers" : "Today's numbers"}
          </Text>
        </Pressable>

        {result && (
          <ResultBlock
            result={result}
            onRegenerate={requestRegenerate}
            onSave={save}
          />
        )}

        <Disclaimer />
      </ScrollView>

      <RegenerateAdGate
        visible={adGateOpen}
        onComplete={completeRegenerate}
        onCancel={() => setAdGateOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

type FormProps = {
  name: string;
  dob: string;
  hometown: string;
  timeOfBirth: string;
  setName: (v: string) => void;
  setDob: (v: string) => void;
  setHometown: (v: string) => void;
  setTimeOfBirth: (v: string) => void;
};

function NumerologyForm(props: FormProps) {
  return (
    <View style={styles.card}>
      <Field label="Full name" value={props.name} onChange={props.setName} placeholder="Jane Doe" autoCapitalize="words" />
      <Field
        label="Date of birth"
        value={props.dob}
        onChange={props.setDob}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
      />
      <Field
        label="Hometown"
        value={props.hometown}
        onChange={props.setHometown}
        placeholder="Sacramento, CA"
        autoCapitalize="words"
      />
      <Field
        label="Time of birth (optional)"
        value={props.timeOfBirth}
        onChange={props.setTimeOfBirth}
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
      />
    </View>
  );
}

function SignPicker({ signId, onPick }: { signId: string | null; onPick: (id: string) => void }) {
  return (
    <View style={styles.signsWrap}>
      {SIGNS.map((s) => {
        const active = s.id === signId;
        return (
          <Pressable
            key={s.id}
            onPress={() => onPick(s.id)}
            style={[
              styles.sign,
              { borderColor: active ? s.accent : "rgba(255,255,255,0.08)" },
              active && { backgroundColor: s.accent + "22" },
            ]}
          >
            <Text style={[styles.signSymbol, { color: s.accent }]}>{s.symbol}</Text>
            <Text style={styles.signName}>{s.name}</Text>
            <Text style={styles.signDates}>{s.dates}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numbers-and-punctuation";
  autoCapitalize?: "none" | "words";
};

function Field({ label, value, onChange, placeholder, keyboardType, autoCapitalize }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        keyboardType={keyboardType ?? "default"}
        autoCapitalize={autoCapitalize ?? "none"}
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

function ResultBlock({
  result,
  onRegenerate,
  onSave,
}: {
  result: Result;
  onRegenerate: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.results}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultLabel}>{result.label}</Text>
        {result.subtitle && <Text style={styles.resultSubtitle}>{result.subtitle}</Text>}
      </View>

      {result.profile && (
        <View style={styles.chips}>
          {profileSummary(result.profile).map((c) => (
            <View key={c.label} style={styles.chip}>
              <Text style={styles.chipLabel}>{c.label}</Text>
              <Text style={styles.chipValue}>{c.value}</Text>
            </View>
          ))}
        </View>
      )}

      {result.draws.map((draw) => {
        const game = GAMES.find((g) => g.id === draw.gameId)!;
        return <GameCard key={game.id} game={game} draw={draw} />;
      })}

      <View style={styles.actions}>
        <Pressable onPress={onRegenerate} style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}>
          <Text style={styles.secondaryBtnText}>↻ Regenerate</Text>
        </Pressable>
        <Pressable onPress={onSave} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.primaryBtnText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 24 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  brand: { color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: 0.5 },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
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
  signsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    marginTop: 12,
  },
  sign: {
    width: "31%",
    margin: "1.16%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
  },
  signSymbol: { fontSize: 26, marginBottom: 2 },
  signName: { color: "#fff", fontSize: 13, fontWeight: "700" },
  signDates: { color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 },
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
  ctaText: { color: "#0a0118", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },
  results: { marginTop: 20 },
  resultsHeader: { paddingHorizontal: 20, marginBottom: 10 },
  resultLabel: { color: "#fff", fontSize: 18, fontWeight: "700" },
  resultSubtitle: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 },
  chips: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, marginBottom: 8 },
  chip: {
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
  },
  chipLabel: { color: "rgba(255,255,255,0.6)", fontSize: 9, letterSpacing: 1, textTransform: "uppercase" },
  chipValue: { color: "#fde68a", fontSize: 14, fontWeight: "700" },
  actions: { flexDirection: "row", marginHorizontal: 16, marginTop: 6 },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    marginRight: 8,
  },
  secondaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  primaryBtnText: { color: "#03261b", fontWeight: "800", fontSize: 14 },
});
