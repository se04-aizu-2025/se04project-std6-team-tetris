import { useState } from "react";
import "./App.css";

function App() {
  const [array, setArray] = useState([1, 47, 31, 57, 35, 23, 21, 35, 31, 49, 94]);

  // ランダム配列を生成
  const generateRandomArray = () => {
    const n = 20;
    const tmp = [];
    for (let i = 0; i < n; i++) {
      tmp.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(tmp);
  };

  return (
    <div className="app">
      <h1>Sort Visualizer</h1>

      <div className="controls">
        <button onClick={generateRandomArray}>ランダム配列を生成</button>
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
