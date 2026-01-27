import { useMemo, useRef, useState } from "react";
import "./App.css";

import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";

/**
 * backend の返却を UI(useSortStepper)互換に変換する
 * 必須:
 * - initialArray: number[]
 * - steps: [{type,i,j,array?}]  ※ swap のときだけ array がある前提
 */
function toUiSortJson(inputArray, data) {
  const rawSteps = Array.isArray(data?.steps) ? data.steps : [];

  const initialArray =
    Array.isArray(data?.initialArray) ? data.initialArray :
    Array.isArray(data?.initial) ? data.initial :
    Array.isArray(data?.initialArr) ? data.initialArr :
    inputArray;

  // swap step に array が既に入っているなら、そのまま通す
  const swapHasArray = rawSteps.some(
    (s) => s?.type === "swap" && Array.isArray(s?.array)
  );
  if (swapHasArray) {
    return { initialArray, steps: rawSteps };
  }

  // swap の array が無い場合は、フロントで復元して swap のときだけ array を付与
  let cur = [...initialArray];

  const steps = rawSteps.map((s) => {
    const type = s?.type ?? "step";

    // backend 側キー揺れ対応（必要なら増やしてOK）
    const i = Number(s?.i ?? s?.left ?? s?.a ?? s?.index1);
    const j = Number(s?.j ?? s?.right ?? s?.b ?? s?.index2);

    const safeI = Number.isFinite(i) ? i : null;
    const safeJ = Number.isFinite(j) ? j : null;

    if (type === "swap" && Number.isInteger(i) && Number.isInteger(j)) {
      [cur[i], cur[j]] = [cur[j], cur[i]];
      return { ...s, type, i, j, array: [...cur] };
    }

    return { ...s, type, i: safeI, j: safeJ };
  });

  return { initialArray, steps };
}

export default function App() {
  const [sortMethod, setSortMethod] = useState("quick");

  const [inputMode, setInputMode] = useState("random"); // "random" | "manual"
  const [manualText, setManualText] = useState("");
  const totalNumberRef = useRef(null);

  const [inputArray, setInputArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);

  // UI に渡すログ
  const [sortJson, setSortJson] = useState(null);

  const totalCount = useMemo(() => inputArray.length, [inputArray]);

  const generateRandomArray = (n) => {
    const tmp = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(tmp);
  };

  const generateRandom20 = () => generateRandomArray(20);

  const generateRandomByInput = () => {
    const raw = totalNumberRef.current?.value ?? "";
    const n = Number(raw);

    if (!Number.isInteger(n) || n <= 0 || n > 200) {
      alert("要素数は 1〜200 の整数で入力してください。");
      return;
    }

    generateRandomArray(n);
    if (totalNumberRef.current) totalNumberRef.current.value = "";
  };

  const parseManualArray = () => {
    const nums = manualText
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((x) => Number(x));

    if (nums.length === 0 || nums.some((n) => !Number.isFinite(n))) {
      alert("手動入力は、例: 5,1,9,2,7,3 のように数値で入力してください。");
      return null;
    }
    return nums;
  };

  // SortVisualizer の START から呼ばれる：backend へ投げて sortJson を更新
  const requestSort = async () => {
    let arr = inputArray;

    if (inputMode === "manual") {
      const parsed = parseManualArray();
      if (!parsed) return;
      arr = parsed;
      setInputArray(parsed);
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      alert("配列が空です。ランダム生成または手動入力してください。");
      return;
    }

    const res = await fetch("http://127.0.0.1:8081/sort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: sortMethod, array: arr }),
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    const data = await res.json();
    const uiJson = toUiSortJson(arr, data);

    // ★重要：runId を付ける（key再マウントで state を初期化するため）
    setSortJson({ ...uiJson, runId: Date.now() });
  };

  return (
    <div className="app">
      <div className="hero">
        <h1 className="title">Sort Visualizer</h1>
        <p className="subtitle">backend のソートログを使って可視化します</p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>配列の入力</h2>
          <div className="meta">
            <span>elements: {totalCount}</span>
            <span>selected: {sortMethod}</span>
          </div>
        </div>

        <div className="input-mode">
          <label>
            <input
              type="radio"
              name="input-mode"
              checked={inputMode === "random"}
              onChange={() => setInputMode("random")}
            />
            ランダム生成
          </label>

          <label>
            <input
              type="radio"
              name="input-mode"
              checked={inputMode === "manual"}
              onChange={() => setInputMode("manual")}
            />
            手動入力
          </label>
        </div>

        {inputMode === "random" && (
          <div className="random-panel">
            <button className="primary" onClick={generateRandom20}>
              ランダム配列を生成（20個）
            </button>

            <div className="inline-row">
              <span>要素数指定：</span>
              <input type="text" ref={totalNumberRef} placeholder="例: 30" />
              <button onClick={generateRandomByInput}>CREATE</button>
            </div>
          </div>
        )}

        {inputMode === "manual" && (
          <div className="manual-panel">
            <p className="hint">例: 5,1,9,2,7,3（カンマ区切り/スペース区切りOK）</p>
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="5,1,9,2,7,3"
            />
            <div className="hint small">手動入力は START 押下時に確定します。</div>
          </div>
        )}
      </div>

      <div className="panel">
        <SortList value={sortMethod} onChange={setSortMethod} />
      </div>

      <SortVisualizer
        sortJson={sortJson}
        descriptionData={SORT_DESCRIPTIONS[sortMethod]}
        onRequestSort={requestSort}
      />
    </div>
  );
}
