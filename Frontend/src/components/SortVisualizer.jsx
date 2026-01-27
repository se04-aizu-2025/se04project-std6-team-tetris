import React, { useState } from "react";
import { useSortStepper } from "../hooks/useSortStepper";
import SortDescription from "./SortDescription";

export default function SortVisualizer({ sortJson, descriptionData, onRequestSort }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ready =
    !!sortJson &&
    typeof sortJson.runId === "number" &&
    Array.isArray(sortJson.initialArray) &&
    Array.isArray(sortJson.steps);

  const handleStart = async () => {
    if (typeof onRequestSort === "function") {
      setIsLoading(true);
      try {
        await onRequestSort(); // App側で sortJson が更新される（runId付き）
      } finally {
        setIsLoading(false);
      }
    }
    setIsStarted(true);
  };

  const handleReset = () => {
    setIsStarted(false);
  };

  return (
    <div className="sort-visualizer">
      <div className="button-group">
        <button onClick={handleStart} disabled={isLoading}>
          {isLoading ? "LOADING..." : "START"}
        </button>
        <button onClick={handleReset} disabled={isLoading}>RESET</button>
      </div>

      <SortDescription data={descriptionData} />

      {isStarted && ready && (
        // ★重要：runId を key にして再マウント＝hook state 初期化（useEffect不要）
        <VisualizerBody key={sortJson.runId} sortJson={sortJson} />
      )}
    </div>
  );
}

function VisualizerBody({ sortJson }) {
  const {
    array,
    initial,
    show,
    highlight,
    stepIndex,
    stepsLength,
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
  } = useSortStepper(sortJson);

  return (
    <>
      <div className="before-after-container motion-in">
        <div className="comparison-section">
          <h3 className="section-title">Before (ソート前)</h3>
          <div className="bars">
            <div className="bars-inner">
              {initial.map((value, idx) => (
                <div key={idx} className="bar-wrapper">
                  <div className="bar" style={{ height: `${value * 3}px` }} title={value}>
                    <span className="bar-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="comparison-section">
          <h3 className="section-title">After (ソート後)</h3>
          <div className="bars">
            <div className="bars-inner">
              {show.map((value, idx) => (
                <div key={idx} className="bar-wrapper">
                  <div className="bar bar-complete" style={{ height: `${value * 3}px` }} title={value}>
                    <span className="bar-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="step-controls motion-in">
        <div className="step-header">
          <h3 className="section-title">ステップごとに確認</h3>

          <div className="speed-control">
            <label className="speed-label">
              Speed <span className="speed-value">{speedMs}ms</span>
            </label>
            <div className="speed-slider-row">
              <span className="speed-end speed-fast">Fast</span>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                aria-label="Auto play speed"
                disabled={autoMode !== null} // 再生中は変更しない（張り直し問題回避）
              />
              <span className="speed-end speed-slow">Slow</span>
            </div>
          </div>
        </div>

        <div className="current-step-visualization">
          <div className="bars">
            <div className="bars-inner">
              {array.map((value, idx) => {
                const isHighlight = idx === highlight.i || idx === highlight.j;
                const isSwap = currentStep?.type === "swap" && isHighlight;
                return (
                  <div key={idx} className="bar-wrapper">
                    <div
                      className={`bar ${isHighlight ? "bar-highlight" : ""} ${isSwap ? "bar-swap" : ""}`}
                      style={{ height: `${value * 3}px` }}
                      title={value}
                    >
                      <span className="bar-value">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="step-navigation">
          <button onClick={back} disabled={stepIndex <= -1 || autoMode !== null} className="nav-button">
            ← Back
          </button>

          <div className="step-info">
            <span>Step: {stepIndex + 1} / {stepsLength}</span>
            {currentStep && (
              <span className="step-details">
                {currentStep.type} (i={currentStep.i}, j={currentStep.j})
              </span>
            )}
            {autoMode && (
              <span className="auto-indicator">
                {autoMode === "forward" ? "▶ 自動再生中" : "◀ 自動戻し中"}
              </span>
            )}
          </div>

          <button onClick={next} disabled={stepIndex >= stepsLength - 1 || autoMode !== null} className="nav-button">
            Next →
          </button>
        </div>

        <div className="auto-controls">
          <button onClick={startAutoBack} disabled={stepIndex <= -1 || autoMode === "backward"} className="auto-button auto-back">
            Auto Back
          </button>
          <button onClick={stopAuto} disabled={autoMode === null} className="auto-button auto-stop">
            Stop
          </button>
          <button onClick={startAutoNext} disabled={stepIndex >= stepsLength - 1 || autoMode === "forward"} className="auto-button auto-next">
            Auto Next
          </button>
        </div>

        <div className="reset-controls">
          <button onClick={reset} disabled={stepIndex <= -1 || autoMode !== null} className="reset-button">
            最初から
          </button>
          <button onClick={resetAll} disabled={autoMode !== null} className="reset-button">
            全部リセット
          </button>
          <button onClick={showFinal} disabled={autoMode !== null} className="reset-button">
            完成形を表示
          </button>
        </div>
      </div>
    </>
  );
}
