import { useMemo, useRef, useState } from "react";
import "./App.css";

import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";

function toUiSortJson(inputArray, data) {
  const rawSteps = Array.isArray(data?.steps) ? data.steps : [];

  const initialArray =
    Array.isArray(data?.initialArray) ? data.initialArray :
    Array.isArray(data?.initial) ? data.initial :
    Array.isArray(data?.initialArr) ? data.initialArr :
    inputArray;

  const swapHasArray = rawSteps.some(
    (s) => s?.type === "swap" && Array.isArray(s?.array)
  );

  if (swapHasArray) {
    return { initialArray, steps: rawSteps };
  }

  let cur = [...initialArray];

  const steps = rawSteps.map((s) => {
    const type = s?.type ?? "step";

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

// ✅ 追加：Manual入力を「静かに」パース（プレビュー用）
function parseManualArraySilent(text) {
  const nums = String(text ?? "")
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((x) => Number(x));

  if (nums.length === 0) return { ok: false, nums: [], error: "" };
  if (nums.some((n) => !Number.isFinite(n))) {
    return { ok: false, nums: [], error: "数字のみ入力してください（カンマ/スペース区切り）。" };
  }

  // 必要なら制約（例：1〜100）をかける
  const outOfRange = nums.some((n) => n < 1 || n > 100);
  if (outOfRange) {
    return { ok: false, nums, error: "値は 1〜100 の範囲にしてください。" };
  }

  // 必要なら個数制約（例：1〜20）をかける
  if (nums.length > 200) {
    return { ok: false, nums, error: "要素数が多すぎます（最大 200）。" };
  }

  return { ok: true, nums, error: "" };
}

export default function App() {
  const [sortMethod, setSortMethod] = useState("quick");

  const [inputMode, setInputMode] = useState("random");
  const [manualText, setManualText] = useState("");
  const totalNumberRef = useRef(null);

  const [inputArray, setInputArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [sortJson, setSortJson] = useState(null);

  // ✅ 追加：Manualのエラー表示
  const [manualError, setManualError] = useState("");

  const totalCount = useMemo(() => inputArray.length, [inputArray]);

  // ✅ 追加：Manualのプレビュー（入力中に見える）
  const manualPreview = useMemo(() => {
    const parsed = parseManualArraySilent(manualText);
    return parsed;
  }, [manualText]);

  const generateRandomArray = (n) => {
    const tmp = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(tmp);
  };

  const generateRandom20 = () => generateRandomArray(20);

  const generateRandomByInput = () => {
    const raw = totalNumberRef.current?.value ?? "";
    const n = Number(raw);

    if (!Number.isInteger(n) || n <= 0 || n > 200) {
      alert("Please enter an integer between 1 and 200 for the number of elements.");
      return;
    }

    generateRandomArray(n);
    if (totalNumberRef.current) totalNumberRef.current.value = "";
  };

  // ✅ 追加：Manualを「SAVE」で inputArray に反映（＝計算に使う配列を確定）
  const saveManualToArray = () => {
    const parsed = parseManualArraySilent(manualText);

    if (!parsed.ok) {
      setManualError(parsed.error || "入力を確認してください。");
      return;
    }
    setManualError("");
    setInputArray(parsed.nums);
  };

  // 既存：requestSort（ManualはSTARTで反映） → ✅ ここは「SAVE済み inputArray」を使う方が分かりやすいので
  // Manual時でも setInputArray をここで上書きしない（= SAVEが真の確定）方針に変更
  const requestSort = async () => {
    const arr = inputArray;

    if (!Array.isArray(arr) || arr.length === 0) {
      alert("The array is empty. Please generate a random array or enter values manually.");
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

    setSortJson({ ...uiJson, runId: Date.now() });
  };

  return (
    <div className="app">
      <div className="hero">
        <h1 className="title">Sort Visualizer</h1>
        <p className="subtitle">Visualize sorting using backend sort logs</p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Array Input</h2>
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
            Random
          </label>

          <label>
            <input
              type="radio"
              name="input-mode"
              checked={inputMode === "manual"}
              onChange={() => setInputMode("manual")}
            />
            Manual
          </label>
        </div>

        {inputMode === "random" && (
          <div className="random-panel">
            <button className="primary" onClick={generateRandom20}>
              Generate Random Array (20 items)
            </button>

            <div className="inline-row">
              <span>Set size:</span>
              <input type="text" ref={totalNumberRef} placeholder="e.g. 30" />
              <button onClick={generateRandomByInput}>CREATE</button>
            </div>
          </div>
        )}

        {inputMode === "manual" && (
          <div className="manual-panel">
            <p className="hint">Example: 5,1,9,2,7,3 (comma or space separated)</p>

            <div className="inline-row">
              <input
                type="text"
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setManualError("");
                }}
                placeholder="5,1,9,2,7,3"
              />
              <button className="primary" onClick={saveManualToArray}>
                SAVE to test
              </button>
            </div>

            {/* ✅ プレビュー表示（入力中に確認できる） */}
            <div className="hint small">
              Preview:{" "}
              {manualPreview.ok ? `${manualPreview.nums.length} items` : "—"}
            </div>

            {manualError && <div className="error-text">{manualError}</div>}
          </div>
        )}

        {/* ✅ 追加：いま実際に計算で使われる「Saved array」を常に表示 */}
        <div className="saved-array">
          <div className="saved-title">Saved array:</div>
          <div className="chips">
            {inputArray.map((v, idx) => (
              <span className="chip" key={`${v}-${idx}`}>{v}</span>
            ))}
          </div>
          <div className="hint small">
            ※ START を押すと、この Saved array がバックエンドに送られて計算されます。
          </div>
        </div>
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
