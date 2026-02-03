import React, { useState } from "react";
import { useSortStepper } from "../hooks/useSortStepper";
import SortDescription from "./SortDescription";

const BAR_AREA_MIN_HEIGHT = 260;
const BAR_AREA_PADDING_TOP = 16;
const BAR_AREA_PADDING_BOTTOM = 22;
const MIN_BAR_PX = 6;

function calcBarHeight(value, maxValue) {
  const usable =
    BAR_AREA_MIN_HEIGHT - BAR_AREA_PADDING_TOP - BAR_AREA_PADDING_BOTTOM;
  if (usable <= 0) return MIN_BAR_PX;
  if (maxValue <= 0) return MIN_BAR_PX;
  const ratio = value / maxValue;
  return Math.max(MIN_BAR_PX, Math.round(ratio * usable));
}

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
      {/* ★ START/RESET を大きく・分かりやすく */}
      <div className="button-group button-group--primary">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleStart}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "LOADING..." : "START"}
        </button>

        <button
          className="btn btn-ghost btn-lg"
          onClick={handleReset}
          disabled={isLoading}
          type="button"
        >
          RESET
        </button>
      </div>

      <SortDescription data={descriptionData} />

      {isStarted && ready && <VisualizerBody key={sortJson.runId} sortJson={sortJson} />}
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

  const maxInitial = Math.max(...initial, 1);
  const maxCurrent = Math.max(...array, 1);
  const maxFinal = Math.max(...show, 1);

  const renderBars = (values, maxValue, highlightInfo) => (
    <div className="barArea">
      {values.map((value, idx) => {
        const isHighlight =
          highlightInfo && (idx === highlightInfo.i || idx === highlightInfo.j);

        const isSwap = highlightInfo && currentStep?.type === "swap" && isHighlight;

        return (
          <div key={idx} className="barItem">
            <div
              className={`bar ${isHighlight ? "bar-highlight" : ""} ${
                isSwap ? "bar-swap" : ""
              }`}
              style={{ height: `${calcBarHeight(value, maxValue)}px` }}
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
                aria-label="Auto play speed"
              />
              <span className="speed-end speed-slow">Slow</span>
            </div>
          </div>
        </div>

        <div className="current-step-visualization">
          {renderBars(array, maxCurrent, highlight)}
        </div>

        <div className="step-navigation">
          <button
            className="btn btn-ghost"
            onClick={back}
            disabled={stepIndex <= -1 || autoMode !== null}
            type="button"
          >
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
                {autoMode === "forward" ? "▶ Auto playing" : "◀ Auto rewinding"}
              </span>
            )}
          </div>

          <button
            className="btn btn-ghost"
            onClick={next}
            disabled={stepIndex >= stepsLength - 1 || autoMode !== null}
            type="button"
          >
            Next →
          </button>
        </div>

        <div className="auto-controls">
          <button
            className="btn"
            onClick={startAutoBack}
            disabled={autoMode === "backward"}
            type="button"
          >
            Auto Back
          </button>
          <button
            className="btn btn-danger"
            onClick={stopAuto}
            disabled={autoMode === null}
            type="button"
          >
            Stop
          </button>
          <button
            className="btn"
            onClick={startAutoNext}
            disabled={autoMode === "forward"}
            type="button"
          >
            Auto Next
          </button>
        </div>

        <div className="reset-controls">
          <button className="btn" onClick={reset} disabled={autoMode !== null} type="button">
            Restart
          </button>
        </div>
      </div>
    </>
  );
}
