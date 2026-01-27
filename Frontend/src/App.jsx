import { useMemo, useRef, useState } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [inputArray, setInputArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [steps, setSteps] = useState([]);

  const [inputMode, setInputMode] = useState("random"); // "random" | "manual"
  const [manualText, setManualText] = useState("");

  const totalNumberRef = useRef(null);
  const [sortMethod, setSortMethod] = useState("quick");

  const totalCount = useMemo(() => array.length, [array]);

  const setBothArrays = (arr) => {
    setInputArray(arr);
    setArray(arr);
  };

  const generateRandomArray = (n) => {
    const tmp = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
    setBothArrays(tmp);
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

  const extractSortedArray = (data) => {
    if (Array.isArray(data.sortedArray)) return data.sortedArray;
    if (Array.isArray(data.finalArray)) return data.finalArray;
    if (Array.isArray(data.array)) return data.array;

    if (Array.isArray(data.steps) && data.steps.length > 0) {
      for (let k = data.steps.length - 1; k >= 0; k--) {
        const s = data.steps[k];
        if (s && Array.isArray(s.array)) return s.array;
      }
    }

    if (Array.isArray(data.initialArray)) return data.initialArray;
    return null;
  };

  const startSorting = async () => {
    let arr = inputArray;

    if (inputMode === "manual") {
      const parsed = parseManualArray();
      if (!parsed) return;
      arr = parsed;
      setBothArrays(parsed);
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      alert("配列が空です。ランダム生成または手動入力してください。");
      return;
    }

    try {
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

      const gotSteps = Array.isArray(data.steps) ? data.steps : [];
      setSteps(gotSteps);

      const sorted = extractSortedArray({ ...data, steps: gotSteps });
      if (!sorted) {
        alert("ソート結果の配列が見つかりませんでした（backendの返却形式を確認してください）");
        return;
      }

      setArray(sorted);
    } catch (e) {
      alert(`通信に失敗しました: ${String(e)}`);
    }
  };

  return (
    <div className="app">
      <h1>Sort Visualizer</h1>

      <div className="sorting-number">
        <h2>配列の入力方法</h2>

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
            <button onClick={generateRandom20}>ランダム配列を生成（20個）</button>

            <div style={{ marginTop: 8 }}>
              <span>要素数指定：</span>
              <input type="text" ref={totalNumberRef} placeholder="例: 30" />
              <button onClick={generateRandomByInput}>CREATE</button>
            </div>
          </div>
        )}

        {inputMode === "manual" && (
          <div className="manual-panel" style={{ marginTop: 8 }}>
            <p>例: 5,1,9,2,7,3（カンマ区切り/スペース区切りOK）</p>
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="5,1,9,2,7,3"
            />
            <div style={{ marginTop: 6, fontSize: 12 }}>手動入力は START 押下時に確定します。</div>
          </div>
        )}
      </div>

      <div className="sorting-controls">
        <SortList value={sortMethod} onChange={setSortMethod} />
      </div>

      <div className="button">
        <button onClick={startSorting}>START</button>
      </div>

      <div style={{ marginTop: 8, fontSize: 12 }}>
        elements: {totalCount} / selected sort: {sortMethod} / steps: {steps.length}
      </div>

      <div className="bars">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="bar"
            style={{ height: `${value * 3}px` }}
            title={String(value)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
