import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Bundled alarm sound (works offline, no remote URL)
const alarmSoundSource = require("../../assets/sounds/digital-alarm-clock-chirping.mp3");

let cachedSound: Audio.Sound | null = null;

/**
 * Play the timer-end alarm: sound + vibration.
 * Uses expo-av (works in Expo Go and dev builds) and expo-haptics.
 */
export async function playTimerEndAlarm(): Promise<void> {
  // Vibration
  try {
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 200);
  } catch {
    // Haptics may be unavailable on some devices/simulators
  }

  // Sound (bundled asset – reliable, works offline)
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    if (cachedSound) {
      await cachedSound.replayAsync();
      return;
    }

    const { sound } = await Audio.Sound.createAsync(alarmSoundSource);
    cachedSound = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        cachedSound = null;
      }
    });
  } catch (e) {
    // Ignore audio errors (e.g. in Expo Go if asset fails)
  }
}
