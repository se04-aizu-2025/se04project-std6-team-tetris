import { useState,useRef } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";
import SortVisualizer from "./components/SortVisualizer";
import sortJson from "./data/bubble_log.json";

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [test, setTest] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [mode, setMode] = useState();
  const [count,setCount] = useState(0);
  const [selfInputs, setSelfInputs] = useState([]); // selfで作った数値を入れる配列
  const totallSortingNumber = useRef()
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

  return (
    <div className="app">
      <h1>Sort Visualizer</h1>

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
        <SortList />
        {/* ここに「selection sort」「merge sort」ボタンを後で追加 */}
      </div>
      <SortVisualizer sortJson={sortJson} />
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
  );
}

export default App;
