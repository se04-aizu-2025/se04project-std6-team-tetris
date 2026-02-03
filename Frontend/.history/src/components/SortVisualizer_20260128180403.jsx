import React, { useState, useEffect } from "react";
import { useSortStepper } from "../hooks/useSortStepper";
import SortDescription from "./SortDescription";

export default function SortVisualizer({ sortJson, descriptionData, onGenerateLog, hasInputData }) {
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

  // sortJsonが変更されたら自動的に表示を更新
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
    // App.jsxからログを生成
    onGenerateLog();
    // ログ生成後、useEffectが自動的に表示を更新する
  };

  const handleReset = () => {
    resetAll();
    setIsStarted(false);
  };

  // バーの幅を動的に計算（配列のサイズに応じて調整）
  const getBarWidth = (arrayLength) => {
    if (arrayLength <= 10) return 40;
    if (arrayLength <= 20) return 28;
    if (arrayLength <= 30) return 20;
    if (arrayLength <= 40) return 16;
    return 12;
  };

  // バーのギャップを動的に計算
  const getBarGap = (arrayLength) => {
    if (arrayLength <= 10) return 12;
    if (arrayLength <= 20) return 8;
    if (arrayLength <= 30) return 6;
    if (arrayLength <= 40) return 4;
    return 2;
  };

  // バーの高さの係数を計算（最大値が大きい場合は小さく）
  const getHeightMultiplier = (array) => {
    if (array.length === 0) return 2.5;
    const maxValue = Math.max(...array);
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
      {/* 説明を最初に表示 */}
      <SortDescription data={descriptionData} />

      {/* STARTボタン */}
      <div className="button-group" style={{ marginTop: "20px" }}>
        <button 
          onClick={handleStart}
          disabled={!hasInputData}
        >
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

      {/* Before/After を横に並べて表示 */}
      {isStarted && (
        <>
          <div className="before-after-container motion-in">
            <div className="comparison-section">
              <h3 className="section-title">Before (ソート前)</h3>
              <div className="bars">
                <div 
                  className="bars-inner" 
                  style={{ 
                    gap: `${barGap}px`
                  }}
                >
                  {initial.map((value, idx) => (
                    <div key={idx} className="bar-wrapper">
                      <div
                        className="bar"
                        style={{ 
                          height: `${value * heightMultiplier}px`,
                          width: `${barWidth}px`,
                          minWidth: `${barWidth}px`,
                          maxWidth: `${barWidth}px`
                        }}
                        title={value}
                      >
                        <span 
                          className="bar-value"
                          style={{ fontSize: barWidth < 20 ? '9px' : '11px' }}
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
              <h3 className="section-title">After (ソート後)</h3>
              <div className="bars">
                <div 
                  className="bars-inner"
                  style={{ 
                    gap: `${barGap}px`
                  }}
                >
                  {show.map((value, idx) => (
                    <div key={idx} className="bar-wrapper">
                      <div
                        className="bar bar-complete"
                        style={{ 
                          height: `${value * heightMultiplier}px`,
                          width: `${barWidth}px`,
                          minWidth: `${barWidth}px`,
                          maxWidth: `${barWidth}px`
                        }}
                        title={value}
                      >
                        <span 
                          className="bar-value"
                          style={{ fontSize: barWidth < 20 ? '9px' : '11px' }}
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
                <div 
                  className="bars-inner"
                  style={{ 
                    gap: `${barGap}px`
                  }}
                >
                  {array.map((value, idx) => {
                    const isHighlight = idx === highlight.i || idx === highlight.j;
                    const isSwap = currentStep?.type === "swap" && isHighlight;
                    return (
                      <div key={idx} className="bar-wrapper">
                        <div
                          className={`bar ${isHighlight ? "bar-highlight" : ""} ${isSwap ? "bar-swap" : ""}`}
                          style={{ 
                            height: `${value * heightMultiplier}px`,
                            width: `${barWidth}px`,
                            minWidth: `${barWidth}px`,
                            maxWidth: `${barWidth}px`
                          }}
                          title={value}
                        >
                          <span 
                            className="bar-value"
                            style={{ fontSize: barWidth < 20 ? '9px' : '11px' }}
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
