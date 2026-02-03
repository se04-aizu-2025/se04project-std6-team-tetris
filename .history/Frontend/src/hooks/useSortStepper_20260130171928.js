import { useMemo, useRef, useCallback, useState } from "react";

const EMPTY_ARRAY = [];
const EMPTY_STEPS = [];

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

  const [autoMode, setAutoMode] = useState(null); 
  const [speedMs, _setSpeedMs] = useState(300);
  const speedRef = useRef(300);
  const timeoutRef = useRef(null);

  const currentStep = useMemo(
    () => (stepIndex >= 0 ? steps[stepIndex] : null),
    [steps, stepIndex]
  );

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

  const highlight = useMemo(() => {
    if (!currentStep) return { i: null, j: null };
    return { i: currentStep.i ?? null, j: currentStep.j ?? null };
  }, [currentStep]);

  const stopAuto = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
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

  const setSpeedMs = useCallback((ms) => {
    const v = Number(ms);
    speedRef.current = v;
    _setSpeedMs(v);
  }, []);


  const startAutoNext = useCallback(() => {
    stopAuto();
    setAutoMode("forward");

    const tick = () => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          stopAuto();
          return prev;
        }
        return prev + 1;
      });
      timeoutRef.current = setTimeout(tick, speedRef.current);
    };

    timeoutRef.current = setTimeout(tick, speedRef.current);
  }, [stopAuto, steps.length]);

  const startAutoBack = useCallback(() => {
    stopAuto();
    setAutoMode("backward");

    const tick = () => {
      setStepIndex((prev) => {
        if (prev <= -1) {
          stopAuto();
          return prev;
        }
        return prev - 1;
      });

      timeoutRef.current = setTimeout(tick, speedRef.current);
    };

    timeoutRef.current = setTimeout(tick, speedRef.current);
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
