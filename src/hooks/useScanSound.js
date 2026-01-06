// whitelist-scanner\src\hooks\useScanSound.js
import { useRef } from "react";

export function useScanSound({
  soundPassEnabled = true,
  soundFailEnabled = true,
} = {}) {
  const soundsRef = useRef({
    pass: new Audio("/sound/pass.mp3"),
    fail: new Audio("/sound/fail.mp3"),
  });
  const play = (type) => {
    if (type === "pass" && !soundPassEnabled) return;
    if (type === "fail" && !soundFailEnabled) return;

    const audio = soundsRef.current[type];
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
  return { play };
}
