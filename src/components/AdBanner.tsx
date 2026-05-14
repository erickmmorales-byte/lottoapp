import React from "react";
import { Platform, View, StyleSheet, Text } from "react-native";

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const ads = require("react-native-google-mobile-ads");
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch {
  // Module not installed yet (e.g. running on web preview). Render a placeholder.
}

const PROD_BANNER_ID = Platform.select({
  ios: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  android: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
}) as string;

export function AdBanner() {
  if (!BannerAd) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Ad space</Text>
      </View>
    );
  }
  const unitId = __DEV__ ? TestIds.BANNER : PROD_BANNER_ID;
  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginVertical: 8 },
  placeholder: {
    height: 50,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
