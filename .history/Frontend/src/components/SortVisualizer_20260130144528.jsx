import React, { useState } from "react";
import { useSortStepper } from "../hooks/useSortStepper";
import SortDescription from "./SortDescription";

/* =========================
   ユーティリティ
========================= */
const BAR_AREA_MIN_HEIGHT = 260; // CSSのmin-heightと合わせる
const BAR_AREA_PADDING_TOP = 16;
const BAR_AREA_PADDING_BOTTOM = 22; // ラベル余白ぶん
const MIN_BAR_PX = 6;

function calcBarHeight(value, maxValue) {
  const usable = BAR_AREA_MIN_HEIGHT - BAR_AREA_PADDING_TOP - BAR_AREA_PADDING_BOTTOM;
  if (usable <= 0) return MIN_BAR_PX;
  if (maxValue <= 0) return MIN_BAR_PX;
  const ratio = value / maxValue;
  return Math.max(MIN_BAR_PX, Math.round(ratio * usable));
}
/* =========================
   メイン
========================= */
export default function SortVisualizer({ sortJson, descriptionData, onRequestSort }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ready =
    !!sortJson &&
    typeof sortJson.runId === "number" &&
    Array.isArray(sortJson.initialArray) &&
    Array.isArray(sortJson.steps);

  const handleStart = async () => {
    if (typeof onRequestSort !== "function") return;
    setIsLoading(true);
    try {
      await onRequestSort();
      setIsStarted(true);
    } catch (e) {
      console.error(e);
      alert(`START failed: ${e?.message ?? e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => setIsStarted(false);

  return (
    <div className="sort-visualizer">
      <div className="button-group">
        <button onClick={handleStart} disabled={isLoading}>
          {isLoading ? "LOADING..." : "START"}
        </button>
        <button onClick={handleReset} disabled={isLoading}>
          RESET
        </button>
      </div>

      <SortDescription data={descriptionData} />

      {isStarted && ready && (
        <VisualizerBody key={sortJson.runId} sortJson={sortJson} />
      )}
    </div>
  );
}

/* =========================
   ビジュアライザ本体
========================= */
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

  const maxInitial = Math.max(...initial, 1);
  const maxCurrent = Math.max(...array, 1);
  const maxFinal = Math.max(...show, 1);

  const renderBars = (values, maxValue, highlightInfo) => (
    <div className="barArea">
      {values.map((value, idx) => {
        const isHighlight =
          highlightInfo &&
          (idx === highlightInfo.i || idx === highlightInfo.j);

        const isSwap =
          highlightInfo &&
          currentStep?.type === "swap" &&
          isHighlight;

        return (
          <div key={idx} className="barItem">
            <div
              className={`bar ${isHighlight ? "bar-highlight" : ""} ${
                isSwap ? "bar-swap" : ""
              }`}
              style={{
                height: `${calcBarHeight(value, maxValue)}px`,
              }}
              title={value}
            />
            <div className="bar-value">{value}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ===== Before / After ===== */}
      <div className="before-after-container motion-in">
        <div className="comparison-section">
          <h3 className="section-title">Before (Unsorted)</h3>
          {renderBars(initial, maxInitial)}
        </div>

        <div className="comparison-section">
          <h3 className="section-title">After (Sorted)</h3>
          {renderBars(show, maxFinal)}
        </div>
      </div>

      {/* ===== Step by step ===== */}
      <div className="step-controls motion-in">
        <div className="step-header">
          <h3 className="section-title">Step-by-step</h3>

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
                disabled={autoMode !== null}
              />
              <span className="speed-end speed-slow">Slow</span>
            </div>
          </div>
        </div>

        <div className="current-step-visualization">
          {renderBars(array, maxCurrent, highlight)}
        </div>

        <div className="step-navigation">
          <button onClick={back} disabled={stepIndex <= -1 || autoMode !== null}>
            ← Back
          </button>

          <div className="step-info">
            <span>
              Step: {stepIndex + 1} / {stepsLength}
            </span>
            {currentStep && (
              <span className="step-details">
                {currentStep.type} (i={currentStep.i}, j={currentStep.j})
              </span>
            )}
            {autoMode && (
              <span className="auto-indicator">
                {autoMode === "forward"
                  ? "▶ Auto playing"
                  : "◀ Auto rewinding"}
              </span>
            )}
          </div>

          <button
            onClick={next}
            disabled={stepIndex >= stepsLength - 1 || autoMode !== null}
          >
            Next →
          </button>
        </div>

        <div className="auto-controls">
          <button onClick={startAutoBack} disabled={autoMode === "backward"}>
            Auto Back
          </button>
          <button onClick={stopAuto} disabled={autoMode === null}>
            Stop
          </button>
          <button onClick={startAutoNext} disabled={autoMode === "forward"}>
            Auto Next
          </button>
        </div>

        <div className="reset-controls">
          <button onClick={reset} disabled={autoMode !== null}>
            Restart
          </button>
          <button onClick={resetAll} disabled={autoMode !== null}>
            Reset All
          </button>
          <button onClick={showFinal} disabled={autoMode !== null}>
            Show Final Result
          </button>
        </div>
      </div>
    </>
  );
}
