import React, { useState, useEffect } from "react";
import { useSortStepper } from "../hooks/useSortStepper";
import SortDescription from "./SortDescription";

export default function SortVisualizer({
  sortJson,
  descriptionData,
  onGenerateLog,
  hasInputData,
}) {
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

  useEffect(() => {
    if (sortJson) {
      showFinal();
      reset();
      setIsStarted(true);
    } else {
      setIsStarted(false);
    }
  }, [sortJson]);

  const handleStart = () => {
    onGenerateLog();
  };

  const handleReset = () => {
    resetAll();
    setIsStarted(false);
  };

  const getBarWidth = (arrayLength) => {
    if (arrayLength <= 10) return 40;
    if (arrayLength <= 20) return 28;
    if (arrayLength <= 30) return 20;
    if (arrayLength <= 40) return 16;
    return 12;
  };

  const getBarGap = (arrayLength) => {
    if (arrayLength <= 10) return 12;
    if (arrayLength <= 20) return 8;
    if (arrayLength <= 30) return 6;
    if (arrayLength <= 40) return 4;
    return 2;
  };

  const getHeightMultiplier = (arr) => {
    if (arr.length === 0) return 2.5;
    const maxValue = Math.max(...arr);
    if (maxValue <= 30) return 2.8;
    if (maxValue <= 50) return 2.3;
    if (maxValue <= 70) return 1.8;
    return 1.5;
  };

  const barWidth = getBarWidth(initial.length);
  const barGap = getBarGap(initial.length);
  const heightMultiplier = getHeightMultiplier(initial);

  return (
    <div className="sort-visualizer">
      <SortDescription data={descriptionData} />

      <div className="button-group" style={{ marginTop: "20px" }}>
        <button onClick={handleStart} disabled={!hasInputData}>
          START
        </button>
        <button
          onClick={handleReset}
          disabled={!isStarted}
          className="reset-button"
        >
          RESET
        </button>
      </div>

      {isStarted && (
        <>
          <div className="before-after-container motion-in">
            <div className="comparison-section">
              <h3 className="section-title">Before (unsorted)</h3>
              <div className="bars">
                <div className="bars-inner" style={{ gap: `${barGap}px` }}>
                  {initial.map((value, idx) => (
                    <div key={idx} className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          height: `${value * heightMultiplier}px`,
                          width: `${barWidth}px`,
                          minWidth: `${barWidth}px`,
                          maxWidth: `${barWidth}px`,
                        }}
                        title={value}
                      >
                        <span
                          className="bar-value"
                          style={{ fontSize: barWidth < 20 ? "9px" : "11px" }}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="comparison-section">
              <h3 className="section-title">After (sorted)</h3>
              <div className="bars">
                <div className="bars-inner" style={{ gap: `${barGap}px` }}>
                  {show.map((value, idx) => (
                    <div key={idx} className="bar-wrapper">
                      <div
                        className="bar bar-complete"
                        style={{
                          height: `${value * heightMultiplier}px`,
                          width: `${barWidth}px`,
                          minWidth: `${barWidth}px`,
                          maxWidth: `${barWidth}px`,
                        }}
                        title={value}
                      >
                        <span
                          className="bar-value"
                          style={{ fontSize: barWidth < 20 ? "9px" : "11px" }}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="step-controls motion-in">
            <div className="step-header">
              <h3 className="section-title">Step-by-step view</h3>

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

            <div className="current-step-visualization">
              <div className="bars">
                <div className="bars-inner" style={{ gap: `${barGap}px` }}>
                  {array.map((value, idx) => {
                    const isHighlight =
                      idx === highlight.i || idx === highlight.j;
                    const isSwap =
                      currentStep?.type === "swap" && isHighlight;

                    return (
                      <div key={idx} className="bar-wrapper">
                        <div
                          className={`bar ${isHighlight ? "bar-highlight" : ""} ${
                            isSwap ? "bar-swap" : ""
                          }`}
                          style={{
                            height: `${value * heightMultiplier}px`,
                            width: `${barWidth}px`,
                            minWidth: `${barWidth}px`,
                            maxWidth: `${barWidth}px`,
                          }}
                          title={value}
                        >
                          <span
                            className="bar-value"
                            style={{
                              fontSize: barWidth < 20 ? "9px" : "11px",
                            }}
                          >
                            {value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="step-navigation">
              <button
                onClick={back}
                disabled={stepIndex <= -1 || autoMode !== null}
                className="nav-button"
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
                    {autoMode === "forward"
                      ? "▶ Auto playing"
                      : "◀ Auto reversing"}
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

            <div className="reset-controls">
              <button
                onClick={reset}
                disabled={stepIndex <= -1 || autoMode !== null}
                className="reset-button"
              >
                From the beginning
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
