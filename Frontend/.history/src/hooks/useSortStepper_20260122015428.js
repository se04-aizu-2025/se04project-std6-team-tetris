import { useMemo, useState, useEffect } from "react";

export function useSortStepper(sortJson) {
  const initial = useMemo(() => sortJson?.initialArray ?? [], [sortJson]);
  const steps = useMemo(() => sortJson?.steps ?? [], [sortJson]);

  const [array, setArray] = useState(initial);
  const [stepIndex, setStepIndex] = useState(-1); // -1 = まだ何もしてない状態
  const [highlight, setHighlight] = useState({ i: null, j: null }); // 光らせる棒
  const [show,setShow] = useState(initial);
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
    setStepIndex((prev) => {
      const newIndex = Math.min(prev + 1, steps.length - 1);
      applyStep(newIndex);
      return newIndex;
    });
  };

  const back = () => {
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
    setArray(initial);
    setStepIndex(-1);
    setHighlight({ i: null, j: null });
  };

  // 「完成形を一気に表示」も残す
  const showFinal = () => {
    // 最後のswap array or initial
    for (let k = steps.length - 1; k >= 0; k--) {
      const s = steps[k];
      if (s.type === "swap" && Array.isArray(s.array)) {
        setArray(s.array);
        setShow(s.array)
        setHighlight({ i: null, j: null });
        setStepIndex(steps.length - 1);
        return;
      }
    }
    setArray(initial);
    setHighlight({ i: null, j: null });
    setStepIndex(steps.length - 1);
  };

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null;

  return {
    array,
    highlight,
    stepIndex,
    stepsLength: steps.length,
    currentStep,
    next,
    back,
    reset,
    showFinal,
  };
}
