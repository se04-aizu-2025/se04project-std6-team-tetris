import { useMemo, useRef, useCallback, useState } from "react";

const EMPTY_ARRAY = [];
const EMPTY_STEPS = [];

// steps の最後の swap array を最終形として返す（無ければ initial）
function getFinalFromSteps(initial, steps) {
  for (let k = steps.length - 1; k >= 0; k--) {
    const s = steps[k];
    if (s?.type === "swap" && Array.isArray(s?.array)) return s.array;
  }
  return initial;
}

export function useSortStepper(sortJson) {
  const initial = useMemo(() => sortJson?.initialArray ?? EMPTY_ARRAY, [sortJson]);
  const steps = useMemo(() => sortJson?.steps ?? EMPTY_STEPS, [sortJson]);

  // 最終形（Afterの初期表示を完成形に寄せたいので使う）
  const finalArray = useMemo(() => getFinalFromSteps(initial, steps), [initial, steps]);

  // ★ key再マウント前提なので、初期値は initializer でOK（useEffectでsetStateしない）
  const [stepIndex, setStepIndex] = useState(-1);
  const [show, setShow] = useState(() => finalArray);

  const [autoMode, setAutoMode] = useState(null); // 'forward' | 'backward' | null
  const [speedMs, setSpeedMs] = useState(300);
  const intervalRef = useRef(null);

  const currentStep = useMemo(
    () => (stepIndex >= 0 ? steps[stepIndex] : null),
    [steps, stepIndex]
  );

  const arrayAt = useCallback(
    (index) => {
      if (index < 0) return initial;
      for (let k = index; k >= 0; k--) {
        const s = steps[k];
        if (s?.type === "swap" && Array.isArray(s?.array)) return s.array;
      }
      return initial;
    },
    [steps, initial]
  );

  const array = useMemo(() => arrayAt(stepIndex), [arrayAt, stepIndex]);

  const highlight = useMemo(() => {
    if (!currentStep) return { i: null, j: null };
    return { i: currentStep.i ?? null, j: currentStep.j ?? null };
  }, [currentStep]);

  const stopAuto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoMode(null);
  }, []);

  const next = useCallback(() => {
    if (autoMode) stopAuto();
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [autoMode, stopAuto, steps.length]);

  const back = useCallback(() => {
    if (autoMode) stopAuto();
    setStepIndex((prev) => Math.max(prev - 1, -1));
  }, [autoMode, stopAuto]);

  const reset = useCallback(() => {
    stopAuto();
    setStepIndex(-1);
  }, [stopAuto]);

  const resetAll = useCallback(() => {
    stopAuto();
    setStepIndex(-1);
    setShow(initial);
  }, [stopAuto, initial]);

  const showFinal = useCallback(() => {
    setShow(finalArray);
  }, [finalArray]);

  // 自動再生：effect を使わず、ボタン操作で interval を貼る（ルール回避）
  const startAutoNext = useCallback(() => {
    stopAuto();
    setAutoMode("forward");
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          stopAuto();
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);
  }, [stopAuto, steps.length, speedMs]);

  const startAutoBack = useCallback(() => {
    stopAuto();
    setAutoMode("backward");
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev <= -1) {
          stopAuto();
          return prev;
        }
        return prev - 1;
      });
    }, speedMs);
  }, [stopAuto, speedMs]);

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
