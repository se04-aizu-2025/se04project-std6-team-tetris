import { useState } from "react";
import "./App.css";
import SortList from "./components/sort-select/SortList";

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [test, setTest] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [mode, setMode] = useState();

  // ランダム配列を生成
  const generateRandomArray = () => {
    const n = 20;
    const tmp = [];
    for (let i = 0; i < n; i++) {
      tmp.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(tmp);
  };

    // ランダム配列を生成
    const generateRandomArray2 = () => {
      const n = 20;
      const tmp = [];
      for (let i = 0; i < n; i++) {
        tmp.push(Math.floor(Math.random() * 100) + 1);
      }
      
      setTest(tmp);
    };
    
    const numberAutoCreating = () =>{
      const n = 20;
      const tmp = [];
      for (let i = 0; i < n; i++) {
        tmp.push(Math.floor(Math.random() * 100) + 1);
      }
      
      setTest(tmp);

    };

  return (
    <div className="app">
      <h1>Sort Visualizer</h1>

      <div className="sorting-number">
        <h1>enter sorting numvers</h1>
        <p>
        <label>
            <input type="radio" name ="sorting-number" checked={mode ==="self"} 
            onChange={() => {setMode("self"); }} />
              自分で入力
          </label>
          <label>
            <input type="radio" name ="sorting-number" checked={mode ==="auto"} 
            onChange={() => {setMode("auto"); numberAutoCreating();}} />
              自動生成
          </label>
        </p>

        {mode === 'auto' &&(
          <ul className = "number-list">
            {test.map((num,idx) => (
              <li key={idx}>{num}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="sorting-controls">
        <SortList />
        
  
        {/* ここに「selection sort」「merge sort」ボタンを後で追加 */}
      </div>

      <div className="button">
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
      </div>
    </div>
  );
}

export default App;
