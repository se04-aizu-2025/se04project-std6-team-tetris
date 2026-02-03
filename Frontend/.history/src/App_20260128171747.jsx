import { useState,useRef } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import sortJson from "./data/bubble_log.json";
import { SORT_DESCRIPTIONS } from "./data/sortDescriptions";
import { sortAlgorithms } from "./utils/sortAlgorithms";

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [test, setTest] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [mode, setMode] = useState();
  const [selectedSort, setSelectedSort] = useState("bubble");
  const [count,setCount] = useState(0);
  const [selfInputs, setSelfInputs] = useState([]); // selfで作った数値を入れる配列
  const totallSortingNumber = useRef()
  const inputsRef = useRef([]);

  const [sortLog, setSortLog] = useState(null);       // ソートログ
  const [isProcessing, setIsProcessing] = useState(false); // 処理中フラグ

  // ランダム配列を生成
  const generateRandomArray = () => {
    const n = 20;
    const tmp = [];
    for (let i = 0; i < n; i++) {
      tmp.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(tmp);
  };

    const numberAutoCreating = () =>{
      const n = totallSortingNumber.current.value;
      const tmp = [];
      for (let i = 0; i < n; i++) {
        tmp.push(Math.floor(Math.random() * 100) + 1);
      }
      
      setTest(tmp);
      totallSortingNumber.current.value = null;

    };
    
    const numberSelfCreating = () =>{
      const n = Number(totallSortingNumber.current.value);
      setCount(n);
      setSelfInputs(Array(n).fill(""));

    };

    const numberSelfReset = () =>{
      setCount(0);
      setSelfInputs([]);
      setTest([]);
    }

    const handleKeyDown = (e, index) =>{

      if (e.key === "Enter") {
        e.preventDefault(); 
        const next = inputsRef.current[index + 1];
        if (next) {
          next.focus();
        }
      }

    };

    const handleChange = (index, value) => {
      // 数値として扱いたいならここで整形
      // 空文字は許可しつつ、数字だけ残す例
      const v = value.replace(/[^\d]/g, ""); // 0-9以外除外（必要なら）
      
      setSelfInputs((prev) => {
        const next = [...prev];
        next[index] = v;
        return next;
      });
    };

    const saveSelfInputsToTest = () => {
      const arr = selfInputs
        .map((v) => Number(v))          // 数値化
        .filter((n) => !Number.isNaN(n)); // 念のため
    
      setTest(arr);
    };

    const handleStartSort = () => {
      // ステップ1: バリデーション
      // ソートする配列が空でないか確認
      if (test.length === 0) {
        alert("ソートする数値を入力してください");
        return;
      }
    
      // ステップ2: 処理中フラグをオン
      // ボタンの二重クリックを防ぐ
      setIsProcessing(true);
    
      // ステップ3: 選択されたソートアルゴリズムを取得
      // selectedSort = "bubble" なら
      // sortAlgorithms["bubble"] = bubbleSort 関数を取得
      const sortFunction = sortAlgorithms[selectedSort];
      
      // ステップ4: ソート関数が存在するか確認
      if (!sortFunction) {
        alert("ソートアルゴリズムが見つかりません");
        setIsProcessing(false);
        return;
      }
    
      try {
        // ステップ5: ソートを実行してログを生成
        // test = [47, 31, 57] として
        // bubbleSort([47, 31, 57]) を実行
        // → ログの配列が返ってくる
        const log = sortFunction(test);
        
        // ステップ6: ログをstateに保存
        setSortLog(log);
        
        // デバッグ用のコンソール出力
        console.log("ソートログ:", log);
        console.log("ステップ数:", log.length);
      } catch (error) {
        // エラーハンドリング
        console.error("ソート実行エラー:", error);
        alert("ソートの実行中にエラーが発生しました");
      } finally {
        // 処理中フラグをオフ
        setIsProcessing(false);
      }
    };

  return (
    <div className="app">
      <header className="app-header pixel-hero">
        <div className="app-container app-header__inner">
          <div className="app-header__left">
            <div className="app-header__title">Sort Visualizer</div>
            <div className="app-header__subtitle">
              学びながら動きで理解するソート可視化
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
          <h1>enter sorting numvers</h1>
          <p>
          <label>
              <input type="radio" name ="sorting-number" checked={mode ==="self"} 
              onChange={() => {setMode("self");}} />
                自分で入力
            </label>
            <label>
              <input type="radio" name ="sorting-number" checked={mode ==="auto"} 
              onChange={() => {setMode("auto");}} />
                自動生成
            </label>
          </p>

          {mode === 'auto'  &&(
            <div>
              <p>Type elements number in the box</p>
              <input type="text"ref={totallSortingNumber}/>
              <button onClick={numberAutoCreating}>CREATE</button>
              <ul className = "number-list">
                {test.map((num,idx) => (
                  <li key={idx}>{num}</li>
                ))}
              </ul>
              <div>total:{test.length}</div>
            </div>
          )}

          {mode === 'self'  &&(
            <div>
              <p>Type elements number in the box</p>
              <input type="text"ref={totallSortingNumber}/>
              <button onClick={numberSelfCreating}>SET</button>
              <button onClick={numberSelfReset}>RESET</button>
              <ul className = "number-list">
                {[...Array(count)].map((_, i) => (
                  <li key={i}>
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      value={selfInputs[i] ?? ""}                 // ← state から表示
                      onChange={(e) => handleChange(i, e.target.value)} // ← state 更新
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
          {/* ここに「selection sort」「merge sort」ボタンを後で追加 */}
        </div>

        {/* ★ 新しく追加: STARTとRESETボタン */}
        <div className="sorting-actions">
          <button 
            onClick={handleStartSort} 
            disabled={isProcessing || test.length === 0}
            className="start-button"
          >
            {isProcessing ? "処理中..." : "START"}
          </button>
          
          <button 
            onClick={() => setSortLog(null)}
            disabled={!sortLog}
            className="reset-button"
          >
            RESET
          </button>
        </div>

        {/* ★ 重要: ビジュアライザーにログを渡す */}
        <SortVisualizer
          sortJson={sortLog}  // ← ここでログを渡す
          descriptionData={SORT_DESCRIPTIONS[selectedSort]}
        />

        {/* <SortVisualizer
          sortJson={sortJson}
          descriptionData={SORT_DESCRIPTIONS[selectedSort]}
        /> */}
        {/* <div className="button">
          <button onClick={generateRandomArray}>START</button>
            
        </div>
        <div className="bars">
          {array.map((value, idx) => (
            <div
              key={idx}
              className="bar"
              style={{ height: `${value * 3}px` }}
              title={value}
            />
          ))}
        </div> */}
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
