import { useMemo, useState } from "react";

const getFinalArrayFromSteps = (json) => {
  for (let k = json.steps.length - 1; k >= 0; k--) {
    const step = json.steps[k];
    if (step.type === "swap" && Array.isArray(step.array)) {
      return step.array;
    }
  }
  return json.initialArray ?? [];
};

export function useSortPlayer(sortJson) {
  const initial = useMemo(() => sortJson?.initialArray ?? [], [sortJson]);

  const [array, setArray] = useState(initial);

  // sortJsonが変わったら初期化したいなら（任意）
  // useEffect(() => setArray(initial), [initial]);

  const start = () => {
    if (!sortJson) return;
    const finalArr = getFinalArrayFromSteps(sortJson);
    setArray(finalArr);
  };

  const reset = () => {
    setArray(initial);
  };

  return { array, start, reset };
}
