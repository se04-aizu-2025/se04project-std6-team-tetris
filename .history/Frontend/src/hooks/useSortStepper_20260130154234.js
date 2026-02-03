import { useMemo, useRef, useCallback, useState } from "react";

const EMPTY_ARRAY = [];
const EMPTY_STEPS = [];

// steps の最後の array を最終形として返す（無ければ initial）
// swap / set の両方を配列更新として扱う
function getFinalFromSteps(initial, steps) {
  for (let k = steps.length - 1; k >= 0; k--) {
    const s = steps[k];
    if ((s?.type === "swap" || s?.type === "set") && Array.isArray(s?.array)) {
      return s.array;
    }
  }
  return initial;
}

export function useSortStepper(sortJson) {
  const initial = useMemo(() => sortJson?.initialArray ?? EMPTY_ARRAY, [sortJson]);
  const steps = useMemo(() => sortJson?.steps ?? EMPTY_STEPS, [sortJson]);

  const finalArray = useMemo(() => getFinalFromSteps(initial, steps), [initial, steps]);

  const [stepIndex, setStepIndex] = useState(-1);
  const [show, setShow] = useState(() => finalArray);

  const [autoMode, setAutoMode] = useState(null); // 'forward' | 'backward' | null

  // 速度は state + ref（Auto中でも常に最新値を使う）
  const [speedMs, _setSpeedMs] = useState(300);
  const speedRef = useRef(300);

  const setSpeedMs = useCallback((ms) => {
    const v = Number(ms);
    speedRef.current = v;
    _setSpeedMs(v);
  }, []);

  // setInterval ではなく setTimeout のIDを持つ
  const timerRef = useRef(null);

  // Auto完了時に黄色ハイライトを消すためのフラグ
  const [clearHighlight, setClearHighlight] = useState(false);

  const currentStep = useMemo(
    () => (stepIndex >= 0 ? steps[stepIndex] : null),
    [steps, stepIndex]
  );

  // index 時点の配列状態を復元
  const arrayAt = useCallback(
    (index) => {
      if (index < 0) return initial;

      for (let k = index; k >= 0; k--) {
        const s = steps[k];
        if ((s?.type === "swap" || s?.type === "set") && Array.isArray(s?.array)) {
          return s.array;
        }
      }
      return initial;
    },
    [steps, initial]
  );

  const array = useMemo(() => arrayAt(stepIndex), [arrayAt, stepIndex]);

  // ハイライト：Auto完了時は強制的に消す
  const highlight = useMemo(() => {
    if (clearHighlight) return { i: null, j: null };
    if (!currentStep) return { i: null, j: null };
    return { i: currentStep.i ?? null, j: currentStep.j ?? null };
  }, [currentStep, clearHighlight]);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAutoMode(null);
  }, []);

  const next = useCallback(() => {
    if (autoMode) stopAuto();
    setClearHighlight(false);
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [autoMode, stopAuto, steps.length]);

  const back = useCallback(() => {
    if (autoMode) stopAuto();
    setClearHighlight(false);
    setStepIndex((prev) => Math.max(prev - 1, -1));
  }, [autoMode, stopAuto]);

  const reset = useCallback(() => {
    stopAuto();
    setClearHighlight(false);
    setStepIndex(-1);
  }, [stopAuto]);

  const resetAll = useCallback(() => {
    stopAuto();
    setClearHighlight(false);
    setStepIndex(-1);
    setShow(initial);
  }, [stopAuto, initial]);

  const showFinal = useCallback(() => {
    setShow(finalArray);
  }, [finalArray]);

  // ★AutoNext：毎回 speedRef.current を見て次の待ち時間を決める
  const startAutoNext = useCallback(() => {
    stopAuto();
    setClearHighlight(false);
    setAutoMode("forward");

    const tick = () => {
      setStepIndex((prev) => {
        // 끝まで到達 → ハイライト消して停止
        if (prev >= steps.length - 1) {
          setClearHighlight(true);
          stopAuto();
          return prev;
        }

        // 次へ進める
        const nextIndex = prev + 1;

        // 次のtickを予約（最新 speed を使う）
        timerRef.current = setTimeout(tick, speedRef.current);
        return nextIndex;
      });
    };

    // 最初のtick予約
    timerRef.current = setTimeout(tick, speedRef.current);
  }, [stopAuto, steps.length]);

  // ★AutoBack：毎回 speedRef.current を見て次の待ち時間を決める
  const startAutoBack = useCallback(() => {
    stopAuto();
    setClearHighlight(false);
    setAutoMode("backward");

    const tick = () => {
      setStepIndex((prev) => {
        if (prev <= -1) {
          setClearHighlight(true);
          stopAuto();
          return prev;
        }

        const nextIndex = prev - 1;
        timerRef.current = setTimeout(tick, speedRef.current);
        return nextIndex;
      });
    };

    timerRef.current = setTimeout(tick, speedRef.current);
  }, [stopAuto]);

  return {
    array,
    initial,
    show,
    highlight,
    stepIndex,
    stepsLength: steps.length,
    currentStep,
    next,
    back,
    reset,
    resetAll,
    showFinal,
    startAutoNext,
    startAutoBack,
    stopAuto,
    autoMode,
    speedMs,
    setSpeedMs,
  };
}
