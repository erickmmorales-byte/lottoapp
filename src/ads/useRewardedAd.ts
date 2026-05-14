import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

type Ads = typeof import("react-native-google-mobile-ads");

let ads: Ads | null = null;
try {
  ads = require("react-native-google-mobile-ads");
} catch {
  ads = null;
}

const PROD_REWARDED_ID = Platform.select({
  ios: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  android: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
}) as string;

export type ShowResult = "rewarded" | "unavailable";

export function useRewardedAd() {
  const [available, setAvailable] = useState(false);
  const rewardedRef = useRef<any>(null);
  const unsubsRef = useRef<Array<() => void>>([]);

  const buildAndLoad = () => {
    if (!ads) return;
    const { RewardedAd, RewardedAdEventType, AdEventType, TestIds } = ads;
    const unitId = __DEV__ ? TestIds.REWARDED : PROD_REWARDED_ID;
    const rewarded = RewardedAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () =>
      setAvailable(true),
    );
    const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, () =>
      setAvailable(false),
    );

    unsubsRef.current = [unsubLoaded, unsubError];
    rewardedRef.current = rewarded;
    try {
      rewarded.load();
    } catch {
      setAvailable(false);
    }
  };

  useEffect(() => {
    buildAndLoad();
    return () => {
      unsubsRef.current.forEach((u) => {
        try {
          u();
        } catch {}
      });
      unsubsRef.current = [];
    };
  }, []);

  const show = (onReward: () => void): ShowResult => {
    if (!ads || !available || !rewardedRef.current) return "unavailable";
    const { RewardedAdEventType, AdEventType } = ads;
    const rewarded = rewardedRef.current;
    let earned = false;

    const onEarn = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });
    const onClose = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      try {
        onEarn();
        onClose();
      } catch {}
      setAvailable(false);
      // Pre-load the next ad so it's ready for the next regenerate.
      buildAndLoad();
      if (earned) onReward();
    });

    try {
      rewarded.show();
      return "rewarded";
    } catch {
      try {
        onEarn();
        onClose();
      } catch {}
      return "unavailable";
    }
  };

  return { available, show, supported: ads !== null };
}
