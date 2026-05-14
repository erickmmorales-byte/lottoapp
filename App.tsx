import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AdBanner } from "./src/components/AdBanner";
import { TabBar, TabId } from "./src/components/TabBar";
import { GenerateScreen } from "./src/screens/GenerateScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { AboutScreen } from "./src/screens/AboutScreen";
import {
  HistoryEntry,
  Settings,
  loadHistory,
  loadSettings,
  saveSettings,
} from "./src/storage";

export default function App() {
  const [tab, setTab] = useState<TabId>("generate");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [settings, setSettings] = useState<Settings>({ personalizedAds: false });

  useEffect(() => {
    loadHistory().then(setHistory);
    loadSettings().then(setSettings);
  }, []);

  const refreshHistory = async () => setHistory(await loadHistory());

  const updateSettings = async (s: Settings) => {
    setSettings(s);
    await saveSettings(s);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#0a0118", "#1c0436", "#040108"]} style={styles.gradient}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          <View style={styles.flex}>
            {tab === "generate" && (
              <GenerateScreen
                onSaved={async () => {
                  await refreshHistory();
                  setTab("history");
                }}
              />
            )}
            {tab === "history" && <HistoryScreen entries={history} />}
            {tab === "about" && (
              <AboutScreen
                settings={settings}
                onChangeSettings={updateSettings}
                onClearedHistory={refreshHistory}
              />
            )}
          </View>
          <AdBanner />
          <TabBar active={tab} onChange={setTab} />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
});
