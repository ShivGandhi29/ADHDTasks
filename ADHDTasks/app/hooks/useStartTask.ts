import { useCallback, useEffect, useState } from "react";

type UseStartTaskResult = {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
  remainingSeconds: number;
};

export function useStartTask(durationSeconds: number): UseStartTaskResult {
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const onStart = useCallback(() => {
    console.log("Start task");
    setIsRunning(true);
    setIsPaused(false);
    setRemainingSeconds((current) =>
      current > 0 && current < durationSeconds ? current : durationSeconds
    );
  }, [durationSeconds]);

  const onPause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const onComplete = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds((current) => {
        const nextSeconds = Math.max(0, current - 1);
        if (nextSeconds === 0) {
          setIsRunning(false);
          setIsPaused(false);
        }
        return nextSeconds;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return {
    isRunning,
    isPaused,
    onStart,
    onPause,
    onComplete,
    remainingSeconds,
  };
}
