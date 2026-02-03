import { useState, useRef } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";
import { sortAlgorithms } from "./utils/sortAlgorithms";

function App() {
  const [test, setTest] = useState([]);
  const [mode, setMode] = useState();
  const [selectedSort, setSelectedSort] = useState("bubble");
  const [count, setCount] = useState(0);
  const [selfInputs, setSelfInputs] = useState([]);
  const [sortJson, setSortJson] = useState(null); // ソートログを保存
  
  const totallSortingNumber = useRef();
  const inputsRef = useRef([]);

  // 自動生成: 指定した個数のランダムな数値を生成
  const numberAutoCreating = () => {
    const n = Number(totallSortingNumber.current.value);
    if (!n || n <= 0 || n > 50) {
      alert("1から50の間の数値を入力してください");
      return;
    }
    
    const tmp = [];
    for (let i = 0; i < n; i++) {
      tmp.push(Math.floor(Math.random() * 100) + 1);
    }
    
    setTest(tmp);
    setSortJson(null); // 新しい配列を生成したらログをクリア
    totallSortingNumber.current.value = "";
  };

  // 自分で入力: 入力フィールドを作成
  const numberSelfCreating = () => {
    const n = Number(totallSortingNumber.current.value);
    if (!n || n <= 0 || n > 50) {
      alert("1から50の間の数値を入力してください");
      return;
    }
    
    setCount(n);
    setSelfInputs(Array(n).fill(""));
    totallSortingNumber.current.value = "";
  };

  // リセット
  const numberSelfReset = () => {
    setCount(0);
    setSelfInputs([]);
    setTest([]);
    setSortJson(null);
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
    setSortJson(null); // 新しい配列を保存したらログをクリア
  };

  // ★★★ ソート実行関数 ★★★
  const handleStartSort = () => {
    if (test.length === 0) {
      alert("ソートする数値を入力してください");
      return;
    }

    if (test.length > 50) {
      alert("配列のサイズが大きすぎます（最大50）");
      return;
    }

    // 選択されたソートアルゴリズムを実行
    const sortFunction = sortAlgorithms[selectedSort];
    
    if (!sortFunction) {
      alert(`ソートアルゴリズム "${selectedSort}" が見つかりません`);
      return;
    }

    try {
      console.log("ソート開始:", selectedSort);
      console.log("入力配列:", test);
      
      // ソートログを生成
      const result = sortFunction(test);
      
      console.log("ソート完了");
      console.log("ステップ数:", result.steps.length);
      console.log("初期配列:", result.initialArray);
      console.log("最初の5ステップ:", result.steps.slice(0, 5));
      
      setSortJson(result);
    } catch (error) {
      console.error("ソート実行エラー:", error);
      alert("ソートの実行中にエラーが発生しました: " + error.message);
    }
  };

  // リセット関数
  const handleResetSort = () => {
    setSortJson(null);
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
                <p>Type elements number in the box (1-50)</p>
                <input 
                  type="number" 
                  ref={totallSortingNumber} 
                  min="1"
                  max="50"
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
                <p>Type elements number in the box (1-50)</p>
                <input 
                  type="number" 
                  ref={totallSortingNumber}
                  min="1"
                  max="50"
                  placeholder="例: 5"
                />
                <button onClick={numberSelfCreating}>SET</button>
                <button onClick={numberSelfReset}>RESET</button>
                
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
                            placeholder={`No.${i + 1}`}
                            type="number"
                            min="1"
                            max="100"
                            style={{ display: "block", margin: "5px 0" }}
                          />
                        </li>
                      ))}
                    </ul>
                    <button onClick={saveSelfInputsToTest}>SAVE to test</button>
                  </>
                )}
                
                {test.length > 0 && (
                  <>
                    <div style={{ marginTop: "20px" }}>
                      <h4>保存された配列:</h4>
                      <ul className="number-list">
                        {test.map((num, idx) => (
                          <li key={idx}>{num}</li>
                        ))}
                      </ul>
                      <div>total: {test.length}</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="sorting-controls">
            <SortList value={selectedSort} onChange={setSelectedSort} />
          </div>

          {/* ★★★ STARTボタンとRESETボタン ★★★ */}
          <div className="button-group" style={{ marginTop: "20px" }}>
            <button 
              onClick={handleStartSort} 
              disabled={test.length === 0}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: test.length === 0 ? "not-allowed" : "pointer",
                opacity: test.length === 0 ? 0.5 : 1
              }}
            >
              START
            </button>
            <button 
              onClick={handleResetSort}
              disabled={!sortJson}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: !sortJson ? "not-allowed" : "pointer",
                opacity: !sortJson ? 0.5 : 1
              }}
            >
              RESET
            </button>
          </div>

          {/* ★★★ SortVisualizerにログを渡す ★★★ */}
          <SortVisualizer
            sortJson={sortJson}
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
