import React from "react";
import { useSortPlayer } from "../hooks/useSortPlayer";

export default function SortVisualizer({ sortJson }) {
  const { array, start, reset } = useSortPlayer(sortJson);

  return (
    <div>
      <div className="button">
        <button onClick={start}>START</button>
        <button onClick={reset}>RESET</button>
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
