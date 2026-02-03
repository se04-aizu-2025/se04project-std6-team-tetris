import React, { useState } from "react";
import { useSortStepper } from "../hooks/useSortStepper";
import SortDescription from "./SortDescription";

export default function SortVisualizer({ sortJson, descriptionData }) {
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
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    showFinal(); // 完成形をshowに設定
    reset(); // ステップ進行は最初から始める
    setIsStarted(true);
  };

  const handleReset = () => {
    resetAll();
    setIsStarted(false);
  };

  return (
    <div className="sort-visualizer">
      {/* コントロールボタン */}
      <div className="button-group">
        <button onClick={handleStart}>
          START
        </button>
        <button onClick={handleReset}>RESET</button>
      </div>

      {/* 説明は常に表示（STARTの下） */}
      <SortDescription data={descriptionData} />

      {/* Before/After を横に並べて表示 */}
      {isStarted && (
        <>
          <div className="before-after-container motion-in">
            <div className="comparison-section">
              <h3 className="section-title">Before (ソート前)</h3>
              <div className="bars">
                <div className="bars-inner">
                  {initial.map((value, idx) => (
                    <div key={idx} className="bar-wrapper">
                      <div
                        className="bar"
                        style={{ height: `${value * 3}px` }}
                        title={value}
                      >
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
                      <div
                        className="bar bar-complete"
                        style={{ height: `${value * 3}px` }}
                        title={value}
                      >
                        <span className="bar-value">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ステップごとの進行機能 */}
          <div className="step-controls motion-in">
            <div className="step-header">
              <h3 className="section-title">ステップごとに確認</h3>
              <div className="speed-control">
                <label className="speed-label">
                  Speed
                  <span className="speed-value">{speedMs}ms</span>
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
                  />
                  <span className="speed-end speed-slow">Slow</span>
                </div>
              </div>
            </div>

            {/* 現在のステップの配列表示 */}
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

            {/* 手動操作ボタン */}
            <div className="step-navigation">
              <button
                onClick={back}
                disabled={stepIndex <= -1 || autoMode !== null}
                className="nav-button"
              >
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
              <button
                onClick={next}
                disabled={stepIndex >= stepsLength - 1 || autoMode !== null}
                className="nav-button"
              >
                Next →
              </button>
            </div>

            {/* 自動再生コントロール */}
            <div className="auto-controls">
              <button
                onClick={startAutoBack}
                disabled={stepIndex <= -1 || autoMode === "backward"}
                className="auto-button auto-back"
              >
                Auto Back
              </button>

              <button
                onClick={stopAuto}
                disabled={autoMode === null}
                className="auto-button auto-stop"
              >
                Stop
              </button>

              <button
                onClick={startAutoNext}
                disabled={stepIndex >= stepsLength - 1 || autoMode === "forward"}
                className="auto-button auto-next"
              >
                Auto Next
              </button>
            </div>
            {/* 最初からボタン */}
            <div className="reset-controls">
              <button
                onClick={reset}
                disabled={stepIndex <= -1 || autoMode !== null}
                className="reset-button"
              >
                最初から
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
