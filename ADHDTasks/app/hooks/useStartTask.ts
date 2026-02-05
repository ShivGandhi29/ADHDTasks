import { useCallback, useEffect, useState } from "react";

type UseStartTaskResult = {
  isRunning: boolean;
  onStart: () => void;
  remainingSeconds: number;
};

export function useStartTask(durationSeconds: number): UseStartTaskResult {
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(durationSeconds);

  const onStart = useCallback(() => {
    console.log("Start task");
    const endTime = Date.now() + durationSeconds * 1000;
    setEndTimeMs(endTime);
    setRemainingSeconds(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!endTimeMs) return;

    const tick = () => {
      const remainingMs = endTimeMs - Date.now();
      const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setRemainingSeconds(nextSeconds);

      if (remainingMs <= 0) {
        setEndTimeMs(null);
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [endTimeMs]);

  return {
    isRunning: endTimeMs !== null,
    onStart,
    remainingSeconds,
  };
}
