import { useMemo, useState, useEffect, useRef } from "react";

export function useSortStepper(sortJson) {
  const initial = useMemo(() => sortJson?.initialArray ?? [], [sortJson]);
  const steps = useMemo(() => sortJson?.steps ?? [], [sortJson]);

  const [array, setArray] = useState(initial);
  const [stepIndex, setStepIndex] = useState(-1);
  const [highlight, setHighlight] = useState({ i: null, j: null });
  const [show, setShow] = useState(initial);
  const [autoMode, setAutoMode] = useState(null);
  const [speedMs, setSpeedMs] = useState(750);
  const intervalRef = useRef(null);

  useEffect(() => {
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
  }, [initial]);

  const applyStep = (index) => {
    if (index < 0) {
      setArray(initial);
      setHighlight({ i: null, j: null });
      return;
    }

    const step = steps[index];
    if (!step) return;

    setHighlight({ i: step.i, j: step.j });

    if (step.type === "swap" && Array.isArray(step.array)) {
      setArray(step.array);
    }
  };

  const restoreArrayAtStep = (index) => {
    if (index < 0) {
      setArray(initial);
      return;
    }
    for (let k = index; k >= 0; k--) {
      const s = steps[k];
      if (s.type === "swap" && Array.isArray(s.array)) {
        setArray(s.array);
        return;
      }
    }
    setArray(initial);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoMode(null);
  };

  const next = () => {
    if (autoMode) stopAuto();
    setStepIndex((prev) => {
      const newIndex = Math.min(prev + 1, steps.length - 1);
      applyStep(newIndex);
      return newIndex;
    });
  };

  const back = () => {
    if (autoMode) stopAuto();
    setStepIndex((prev) => {
      const newIndex = Math.max(prev - 1, -1);
      restoreArrayAtStep(newIndex);
      applyStep(newIndex);
      return newIndex;
    });
  };

  const reset = () => {
    stopAuto();
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
  };

  const resetAll = () => {
    stopAuto();
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
    setShow(initial);
  };

  const showFinal = () => {
    for (let k = steps.length - 1; k >= 0; k--) {
      const s = steps[k];
      if (s.type === "swap" && Array.isArray(s.array)) {
        setShow(s.array);
        return;
      }
    }
    setShow(initial);
  };

  const startAutoNext = () => {
    stopAuto();
    setAutoMode("forward");
  };

  const startAutoBack = () => {
    stopAuto();
    setAutoMode("backward");
  };

  useEffect(() => {
    if (autoMode === null) return;

    intervalRef.current = setInterval(() => {
      if (autoMode === "forward") {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            stopAuto();
            return prev;
          }
          const newIndex = prev + 1;
          applyStep(newIndex);
          return newIndex;
        });
      } else if (autoMode === "backward") {
        setStepIndex((prev) => {
          if (prev <= -1) {
            stopAuto();
            return prev;
          }
          const newIndex = prev - 1;
          restoreArrayAtStep(newIndex);
          applyStep(newIndex);
          return newIndex;
        });
      }
    }, speedMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoMode, steps.length, speedMs]);

  useEffect(() => {
    return () => {
      stopAuto();
    };
  }, []);

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null;

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
