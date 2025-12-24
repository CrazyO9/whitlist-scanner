// whitelist-scanner\src\hooks\useScanSound.js
import { useRef } from "react";


export function useScanSound(result){
    const soundsRef = useRef({
        success: new Audio("/sound/success.mp3"),
        fail: new Audio("/sound/fail.mp3"),
    });
    const play = (type) => {
        const audio = soundsRef.current[type];
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(() => {

        });
    };
    return { play };
}