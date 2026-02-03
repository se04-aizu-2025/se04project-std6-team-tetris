import { useState, useRef } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";
import { sortAlgorithms } from "./utils/sortAlgorithms"; // ソートアルゴリズムをインポート

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [test, setTest] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [mode, setMode] = useState();
  const [selectedSort, setSelectedSort] = useState("bubble");
  const [count, setCount] = useState(0);
  const [selfInputs, setSelfInputs] = useState([]);
  const [sortLog, setSortLog] = useState(null); // ソートログを保存
  const [isProcessing, setIsProcessing] = useState(false); // ソート実行中かどうか
  
  const totallSortingNumber = useRef();
  const inputsRef = useRef([]);

  // ランダム配列を生成
  const generateRandomArray = () => {
    const n = 20;
    const tmp = [];
    for (let i = 0; i < n; i++) {
      tmp.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(tmp);
  };

  // 自動生成: 指定した個数のランダムな数値を生成
  const numberAutoCreating = () => {
    const n = totallSortingNumber.current.value;
    if (!n || n <= 0) {
      alert("正しい数値を入力してください");
      return;
    }
    
    const tmp = [];
    for (let i = 0; i < n; i++) {
      tmp.push(Math.floor(Math.random() * 100) + 1);
    }
    
    setTest(tmp);
    totallSortingNumber.current.value = null;
  };

  // 自分で入力: 入力フィールドを作成
  const numberSelfCreating = () => {
    const n = Number(totallSortingNumber.current.value);
    if (!n || n <= 0) {
      alert("正しい数値を入力してください");
      return;
    }
    
    setCount(n);
    setSelfInputs(Array(n).fill(""));
  };

  // リセット
  const numberSelfReset = () => {
    setCount(0);
    setSelfInputs([]);
    setTest([]);
  };

  // Enterキーで次のフィールドにフォーカス
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = inputsRef.current[index + 1];
      if (next) {
        next.focus();
      }
    }
  };

  // 入力値を更新
  const handleChange = (index, value) => {
    const v = value.replace(/[^\d]/g, ""); // 数字のみ
    setSelfInputs((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  // 自分で入力した値を保存
  const saveSelfInputsToTest = () => {
    const arr = selfInputs
      .map((v) => Number(v))
      .filter((n) => !Number.isNaN(n) && n > 0);
    
    if (arr.length === 0) {
      alert("有効な数値を入力してください");
      return;
    }
    
    setTest(arr);
  };

  // ★★★ ソート実行関数 ★★★
  const handleStartSort = () => {
    if (test.length === 0) {
      alert("ソートする数値を入力してください");
      return;
    }

    setIsProcessing(true);

    // 選択されたソートアルゴリズムを実行
    const sortFunction = sortAlgorithms[selectedSort];
    
    if (!sortFunction) {
      alert("ソートアルゴリズムが見つかりません");
      setIsProcessing(false);
      return;
    }

    try {
      // ソートログを生成
      const log = sortFunction(test);
      setSortLog(log);
      console.log("ソートログ:", log); // デバッグ用
    } catch (error) {
      console.error("ソート実行エラー:", error);
      alert("ソートの実行中にエラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // リセット関数
  const handleResetSort = () => {
    setSortLog(null);
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
                  onChange={() => {
                    setMode("self");
                  }}
                />
                自分で入力
              </label>
              <label>
                <input
                  type="radio"
                  name="sorting-number"
                  checked={mode === "auto"}
                  onChange={() => {
                    setMode("auto");
                  }}
                />
                自動生成
              </label>
            </p>

            {mode === "auto" && (
              <div>
                <p>Type elements number in the box</p>
                <input type="text" ref={totallSortingNumber} />
                <button onClick={numberAutoCreating}>CREATE</button>
                <ul className="number-list">
                  {test.map((num, idx) => (
                    <li key={idx}>{num}</li>
                  ))}
                </ul>
                <div>total:{test.length}</div>
              </div>
            )}

            {mode === "self" && (
              <div>
                <p>Type elements number in the box</p>
                <input type="text" ref={totallSortingNumber} />
                <button onClick={numberSelfCreating}>SET</button>
                <button onClick={numberSelfReset}>RESET</button>
                <ul className="number-list">
                  {[...Array(count)].map((_, i) => (
                    <li key={i}>
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        value={selfInputs[i] ?? ""}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        placeholder={`No.${i + 1}`}
                        style={{ display: "block", margin: "5px 0" }}
                      />
                    </li>
                  ))}
                </ul>
                <button onClick={saveSelfInputsToTest}>SAVE to test</button>
                <div>total:{inputsRef.current.length}</div>
                <ul className="number-list">
                  {test.map((num, idx) => (
                    <li key={idx}>{num}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="sorting-controls">
            <SortList value={selectedSort} onChange={setSelectedSort} />
          </div>

          {/* ★★★ STARTボタンとRESETボタン ★★★ */}
          <div className="sorting-actions">
            <button 
              onClick={handleStartSort} 
              disabled={isProcessing || test.length === 0}
              className="start-button"
            >
              {isProcessing ? "処理中..." : "START"}
            </button>
            <button 
              onClick={handleResetSort}
              disabled={!sortLog}
              className="reset-button"
            >
              RESET
            </button>
          </div>

          {/* ★★★ SortVisualizerにログを渡す ★★★ */}
          <SortVisualizer
            sortJson={sortLog} // 生成されたログを渡す
            descriptionData={SORT_DESCRIPTIONS[selectedSort]}
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
