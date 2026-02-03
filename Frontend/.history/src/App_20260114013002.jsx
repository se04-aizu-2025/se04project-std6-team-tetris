import { useState } from "react";
import "./App.css";

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);
  const [test, setTest] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);

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
  
  return (
    <div className="app">
      <h1>Sort Visualizer</h1>

      <div className="array">
        <h1>enter sorting numvers</h1>
        <p>
          <label>
            <input type="checkbox" name ="sorting-number" />
            自分で入力
          </label>
          <label>
            <input type="checkbox" name ="sorting-number" />
              自動生成
          </label>
        </p>
      </div>

      <div className="controls">
        <button onClick={generateRandomArray}>ランダム配列を生成</button>
        
        <button onClick={generateRandomArray2}>ランダム数を生成</button>
        
        <ul className = "number-list">
          {test.map((num,idx) => (
            <li key={idx}>{num}</li>
          ))}
        </ul>
  
        {/* ここに「selection sort」「merge sort」ボタンを後で追加 */}
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
