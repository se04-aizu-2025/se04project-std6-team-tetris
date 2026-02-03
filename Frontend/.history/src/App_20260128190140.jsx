import { useState, useRef } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";
import { sortAlgorithms } from "./utils/sortAlgorithms";

const MAX_ARRAY_LENGTH = 20;
const MIN_VALUE = 1;
const MAX_VALUE = 100;

function App() {
  const [test, setTest] = useState([]);
  const [mode, setMode] = useState();
  const [selectedSort, setSelectedSort] = useState("bubble");
  const [count, setCount] = useState(0);

  // selfInputs は「入力中の文字列」を持つ（確定は validate で行う）
  const [selfInputs, setSelfInputs] = useState([]);

  const [sortJson, setSortJson] = useState(null);

  const totallSortingNumber = useRef(null);
  const inputsRef = useRef([]);

  const skipNextBlurRef = useRef(false);

  // ========== 共通ユーティリティ ==========
  const getNFromTotalInput = () => Number(totallSortingNumber.current?.value ?? "");

  const validateNumber = (raw) => {
    if (raw === "" || raw == null) return { ok: true, value: "" }; // 空欄は許可（必須にしたいならここを変える）
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, value: null };
    if (n < MIN_VALUE || n > MAX_VALUE) return { ok: false, value: null };
    return { ok: true, value: n };
  };

  // Enter / Blur で呼ぶ：不正なら alert + stateに保存しない（元に戻す）
  const validateAndCommit = (i, rawValue) => {
    const result = validateNumber(rawValue);

    if (!result.ok) {
      alert(`Value must be between ${MIN_VALUE} and ${MAX_VALUE}.`);

      // state は更新しない（＝保存しない）
      // 表示だけ「直前のstate値」に戻す
      const el = inputsRef.current[i];
      if (el) {
        const prev = selfInputs[i] ?? "";
        el.value = prev;
        el.focus();
        el.select?.();
      }
      return false;
    }

    // OK: 数字は number、空欄は "" として state に確定
    setSelfInputs((prev) => {
      const next = [...prev];
      next[i] = result.value;
      return next;
    });

    return true;
  };

  // ========== 自動生成 ==========
  const numberAutoCreating = () => {
    const n = getNFromTotalInput();
    if (!n || n <= 0 || n > MAX_ARRAY_LENGTH) {
      alert(`1から${MAX_ARRAY_LENGTH}の間の数値を入力してください`);
      return;
    }

    const tmp = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);

    setTest(tmp);
    setSortJson(null);
    if (totallSortingNumber.current) totallSortingNumber.current.value = "";
  };

  // ========== 自分で入力: 入力フィールド作成 ==========
  const numberSelfCreating = () => {
    const n = getNFromTotalInput();
    if (!n || n <= 0 || n > MAX_ARRAY_LENGTH) {
      alert(`1から${MAX_ARRAY_LENGTH}の間の数値を入力してください`);
      return;
    }

    setCount(n);
    setSelfInputs(Array(n).fill("")); // 最初は空欄
    setTest([]);
    setSortJson(null);

    if (totallSortingNumber.current) totallSortingNumber.current.value = "";
  };

  // ========== リセット ==========
  const numberSelfReset = () => {
    setCount(0);
    setSelfInputs([]);
    setTest([]);
    setSortJson(null);
    inputsRef.current = [];
  };

  // ========== 入力中の更新（ここでは確定しない） ==========
  const handleChange = (index, value) => {
    // 数字と空だけ許可（例: "-" や "e" を弾く）
    const v = value.replace(/[^\d]/g, "");

    setSelfInputs((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  // ========== Enterで次へ（確定チェック付き） ==========
  const handleKeyDown = (e, index) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const ok = validateAndCommit(index, e.currentTarget.value);
    if (!ok) return;

    const next = inputsRef.current[index + 1];
    if (next) next.focus();
  };

  // ========== 保存ボタン：全要素を最終チェック ==========
  const saveSelfInputsToTest = () => {
    // すべて validate して、不正が1つでもあれば保存しない
    for (let i = 0; i < count; i++) {
      const raw = selfInputs[i] ?? "";
      const ok = validateAndCommit(i, raw);
      if (!ok) return;
    }

    // OKなものだけ number にして配列に（空欄は除外）
    const arr = selfInputs
      .map((v) => (v === "" ? NaN : Number(v)))
      .filter((n) => Number.isFinite(n) && n >= MIN_VALUE && n <= MAX_VALUE);

    if (arr.length === 0) {
      alert("有効な数値を入力してください");
      return;
    }

    if (arr.length > MAX_ARRAY_LENGTH) {
      alert(`配列のサイズが大きすぎます（最大${MAX_ARRAY_LENGTH}）`);
      return;
    }

    setTest(arr);
    setSortJson(null);
  };

  // ========== ソート実行 ==========
  const handleGenerateSortLog = () => {
    if (test.length === 0) {
      alert("ソートする数値を入力してください");
      return null;
    }

    if (test.length > MAX_ARRAY_LENGTH) {
      alert(`配列のサイズが大きすぎます（最大${MAX_ARRAY_LENGTH}）`);
      return null;
    }

    const sortFunction = sortAlgorithms[selectedSort];
    if (!sortFunction) {
      alert(`ソートアルゴリズム "${selectedSort}" が見つかりません`);
      return null;
    }

    try {
      const result = sortFunction(test);
      setSortJson(result);
      return result;
    } catch (error) {
      console.error("ソート実行エラー:", error);
      alert("ソートの実行中にエラーが発生しました: " + error.message);
      return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header pixel-hero">
        <div className="app-container app-header__inner">
          <div className="app-header__left">
            <div className="app-header__title">Sort Visualizer</div>
            <div className="app-header__subtitle">
              学びながら動いて理解するソート可視化
            </div>
          </div>
          <div className="app-header__right">
            <span className="header-badge">Learn</span>
            <span className="header-badge header-badge--accent">Visualize</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">
          <div className="sorting-number">
            <h1>enter sorting numbers</h1>

            <p>
              <label>
                <input
                  type="radio"
                  name="sorting-number"
                  checked={mode === "self"}
                  onChange={() => setMode("self")}
                />
                自分で入力
              </label>
              <label>
                <input
                  type="radio"
                  name="sorting-number"
                  checked={mode === "auto"}
                  onChange={() => setMode("auto")}
                />
                自動生成
              </label>
            </p>

            {mode === "auto" && (
              <div>
                <p>Type elements number in the box (1-{MAX_ARRAY_LENGTH})</p>
                <input
                  type="number"
                  ref={totallSortingNumber}
                  min="1"
                  max={MAX_ARRAY_LENGTH}
                  placeholder="例: 10"
                />
                <button onClick={numberAutoCreating}>CREATE</button>

                {test.length > 0 && (
                  <>
                    <ul className="number-list">
                      {test.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                    <div>total: {test.length}</div>
                  </>
                )}
              </div>
            )}

            {mode === "self" && (
              <div>
                <p>Type elements number in the box (1-{MAX_ARRAY_LENGTH})</p>
                <input
                  type="number"
                  ref={totallSortingNumber}
                  min="1"
                  max={MAX_ARRAY_LENGTH}
                  placeholder="例: 5"
                />
                <button onClick={numberSelfCreating}>SET</button>
                <button onClick={numberSelfReset}>RESET</button>

                <p>※Each value should be from {MIN_VALUE} to {MAX_VALUE} !!</p>

                {count > 0 && (
                  <>
                    <ul className="number-list">
                      {[...Array(count)].map((_, i) => (
                        <li key={i}>
                          <input
                            ref={(el) => (inputsRef.current[i] = el)}
                            value={selfInputs[i] ?? ""}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onBlur={(e) => {
                              // クリックで次へ移動した時もチェック
                              validateAndCommit(i, e.currentTarget.value);
                            }}
                            placeholder={`No.${i + 1}`}
                            type="number"
                            min={MIN_VALUE}
                            max={MAX_VALUE}
                            style={{ display: "block", margin: "5px 0" }}
                            inputMode="numeric"
                          />
                        </li>
                      ))}
                    </ul>

                    <button onClick={saveSelfInputsToTest}>SAVE to test</button>
                  </>
                )}

                {test.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h4>保存された配列:</h4>
                    <ul className="number-list">
                      {test.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                    <div>total: {test.length}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sorting-controls">
            <SortList value={selectedSort} onChange={setSelectedSort} />
          </div>

          <SortVisualizer
            sortJson={sortJson}
            descriptionData={SORT_DESCRIPTIONS[selectedSort]}
            onGenerateLog={handleGenerateSortLog}
            hasInputData={test.length > 0}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-container app-footer__inner">
          <div className="app-footer__left">
            <div className="app-footer__title">ASE Sort Visualizer</div>
            <div className="app-footer__subtitle">
              操作: Next/Back / Auto / Speed でアルゴリズムを体感
            </div>
          </div>
          <div className="app-footer__right">
            <span className="footer-pill">Made for learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
