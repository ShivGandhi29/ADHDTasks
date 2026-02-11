import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import {
  type CompleteTaskSoundId,
  COMPLETE_TASK_SOUND_SOURCES,
  DEFAULT_COMPLETE_TASK_SOUND,
} from "../constants/sounds";

const ALARM_ENABLED_KEY = "@adhdtasks/alarm_enabled";
const COMPLETE_TASK_SOUND_KEY = "@adhdtasks/complete_task_sound";

const soundCache: Partial<Record<CompleteTaskSoundId, Audio.Sound>> = {};

/**
 * Play the timer-end alarm: vibration, and sound if alarm is enabled and a sound is selected.
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

  // Sound only if alarm is enabled
  try {
    const [alarmEnabled, soundId] = await Promise.all([
      AsyncStorage.getItem(ALARM_ENABLED_KEY),
      AsyncStorage.getItem(COMPLETE_TASK_SOUND_KEY),
    ]);
    if (alarmEnabled === "false") return;

    const id: CompleteTaskSoundId =
      soundId != null && soundId in COMPLETE_TASK_SOUND_SOURCES
        ? (soundId as CompleteTaskSoundId)
        : DEFAULT_COMPLETE_TASK_SOUND;
    const source = COMPLETE_TASK_SOUND_SOURCES[id];

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const cached = soundCache[id];
    if (cached) {
      await cached.replayAsync();
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      source as Parameters<typeof Audio.Sound.createAsync>[0],
    );
    soundCache[id] = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        delete soundCache[id];
      }
    });
  } catch {
    // Ignore audio errors (e.g. in Expo Go if asset fails)
  }
}

/**
 * Stop the timer alarm if it is currently playing (e.g. when user marks task complete).
 */
export async function stopTimerAlarm(): Promise<void> {
  try {
    const ids = Object.keys(soundCache) as CompleteTaskSoundId[];
    for (const id of ids) {
      const sound = soundCache[id];
      if (sound != null) {
        await sound.stopAsync();
        await sound.unloadAsync();
        delete soundCache[id];
      }
    }
  } catch {
    // ignore
  }
}
