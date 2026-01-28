import { useEffect, useRef, useState } from "react";

/**
 * 予備：今後「再生/停止/速度」ロジックを分離したくなった時用。
 * 現状は useSortStepper に自動再生が入っているので、未使用でもOK。
 */
export function useSortPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);
  const timerRef = useRef(null);

  const stop = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => stop(), []);

  return { isPlaying, setIsPlaying, speedMs, setSpeedMs, stop, timerRef };
}
