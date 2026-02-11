/**
 * Complete-task alarm sound options. IDs match assets in assets/sounds/.
 */

export type CompleteTaskSoundId = "digital" | "lofi" | "tech" | "loop";

export const COMPLETE_TASK_SOUND_OPTIONS: {
  value: CompleteTaskSoundId;
  label: string;
}[] = [
  { value: "digital", label: "Digital" },
  { value: "lofi", label: "Lo-fi" },
  { value: "tech", label: "Tech" },
  { value: "loop", label: "Loop" },
];

// Asset sources for expo-av (require must be static)
export const COMPLETE_TASK_SOUND_SOURCES: Record<
  CompleteTaskSoundId,
  ReturnType<typeof require>
> = {
  digital: require("../../assets/sounds/digital-alarm-clock-chirping.mp3"),
  lofi: require("../../assets/sounds/lo-fi-alarm.mp3"),
  tech: require("../../assets/sounds/tech-alarm.mp3"),
  loop: require("../../assets/sounds/loop-alarm.mp3"),
};

export const DEFAULT_COMPLETE_TASK_SOUND: CompleteTaskSoundId = "digital";
