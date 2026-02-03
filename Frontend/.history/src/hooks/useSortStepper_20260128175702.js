import { useMemo, useState, useEffect, useRef } from "react";

export function useSortStepper(sortJson) {
  const initial = useMemo(() => sortJson?.initialArray ?? [], [sortJson]);
  const steps = useMemo(() => sortJson?.steps ?? [], [sortJson]);

  const [array, setArray] = useState(initial);
  const [stepIndex, setStepIndex] = useState(-1); // -1 = まだ何もしてない状態
  const [highlight, setHighlight] = useState({ i: null, j: null }); // 光らせる棒
  const [show,setShow] = useState(initial);
  const [autoMode, setAutoMode] = useState(null); // 'forward' | 'backward' | null
  const [speedMs, setSpeedMs] = useState(750); // 自動再生の速度（ms）
  const intervalRef = useRef(null);

  // sortJson が変わったら初期化
  useEffect(() => {
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
  }, [initial]);

  const applyStep = (index) => {
    // index が -1 のときは初期状態
    if (index < 0) {
      setArray(initial);
      setHighlight({ i: null, j: null });
      return;
    }

    const step = steps[index];
    if (!step) return;

    // compare / swap / noswap どれでも i,j はあるのでハイライトする
    setHighlight({ i: step.i, j: step.j });

    // swap のときだけ array が更新される（JSONに array が入っている）
    if (step.type === "swap" && Array.isArray(step.array)) {
      setArray(step.array);
    }
  };

  const next = () => {
    // 手動操作で自動再生を停止
    if (autoMode) {
      stopAuto();
    }
    setStepIndex((prev) => {
      const newIndex = Math.min(prev + 1, steps.length - 1);
      applyStep(newIndex);
      return newIndex;
    });
  };

  const back = () => {
    // 手動操作で自動再生を停止
    if (autoMode) {
      stopAuto();
    }
    setStepIndex((prev) => {
      const newIndex = Math.max(prev - 1, -1);
      // 戻すときは注意：swap前の配列を復元する必要がある
      // ここでは「最も近い過去の swap array」から復元する
      // （初期状態まで戻れる）
      restoreArrayAtStep(newIndex);
      applyStep(newIndex);
      return newIndex;
    });
  };

  const restoreArrayAtStep = (index) => {
    // indexまでに起きた最後のswapの配列を探す
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
    // swapが一度もないなら初期配列
    setArray(initial);
  };

  const reset = () => {
    stopAuto(); // リセット時に自動再生も停止
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
  };

  // 画面全体を「最初の状態」に戻す（After表示も初期に戻す）
  const resetAll = () => {
    stopAuto();
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
    setShow(initial);
  };

  // 「完成形を一気に表示」も残す
  const showFinal = () => {
    // 最後のswap array or initial
    for (let k = steps.length - 1; k >= 0; k--) {
      const s = steps[k];
      if (s.type === "swap" && Array.isArray(s.array)) {
        setShow(s.array);
        return;
      }
    }
    setShow(initial);
  };

  // 自動再生を停止
  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoMode(null);
  };

  // 自動で進む
  const startAutoNext = () => {
    stopAuto(); // 既存の自動再生を停止
    setAutoMode('forward');
  };

  // 自動で戻る
  const startAutoBack = () => {
    stopAuto(); // 既存の自動再生を停止
    setAutoMode('backward');
  };

  // 自動再生のロジック
  useEffect(() => {
    if (autoMode === null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (autoMode === 'forward') {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            stopAuto(); // 最後まで到達したら停止
            return prev;
          }
          const newIndex = prev + 1;
          applyStep(newIndex);
          return newIndex;
        });
      } else if (autoMode === 'backward') {
        setStepIndex((prev) => {
          if (prev <= -1) {
            stopAuto(); // 最初まで到達したら停止
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

  // コンポーネントのアンマウント時にクリーンアップ
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
