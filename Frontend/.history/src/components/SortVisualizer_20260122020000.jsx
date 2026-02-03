import React from "react";
import { useSortStepper } from "../hooks/useSortStepper";

export default function SortVisualizer({ sortJson }) {
  const {
    array,
    show,
    highlight,
    stepIndex,
    stepsLength,
    currentStep,
    next,
    back,
    reset,
    showFinal,
  } = useSortStepper(sortJson);

  return (
    <div>
      {/* 完成形を一気に表示（今までの機能） */}
      <div className="button">
        <button onClick={showFinal}>START（完成形）</button>
        <button onClick={reset}>RESET</button>
      </div>

        {/* 棒グラフ */}
      <div className="bars">
        {show.map((value, idx) => {
          return (
            <div key={idx} className="bar-wrapper">
              <div
                style={{ height: `${value * 3}px` }}
                title={value}
              />
              <span className="bar-value">{value}</span>
            </div>
          );
        })}
      </div>

      {/* 棒グラフ */}
      <div className="bars">
        {array.map((value, idx) => {
          const isHighlight = idx === highlight.i || idx === highlight.j;
          return (
            <div key={idx} className="bar-wrapper">
              <div
                className={`bar ${isHighlight ? "bar-highlight" : ""}`}
                style={{ height: `${value * 3}px` }}
                title={value}
              />
              <span className="bar-value">{value}</span>
            </div>
          );
        })}
      </div>

      {/* ここが追加：Next / Back */}
      <div style={{ marginTop: 16 }}>
        <button onClick={back} disabled={stepIndex <= -1}>
          Back
        </button>
        <button onClick={next} disabled={stepIndex >= stepsLength - 1}>
          Next
        </button>

        <div style={{ marginTop: 8 }}>
          step: {stepIndex + 1} / {stepsLength}
          {currentStep && (
            <div>
              type: {currentStep.type} (i={currentStep.i}, j={currentStep.j})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
