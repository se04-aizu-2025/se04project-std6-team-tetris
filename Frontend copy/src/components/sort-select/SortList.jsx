import React from "react";
import Sort from "./Sort";

const SortList = ({ value, onChange }) => {

  const SORT_SYSTEMS = [
    { id: "quick", label: "クイックソート" },
    { id: "merge", label: "マージソート" },
    {id: "heap", label: "ヒープソート" },
    { id: "gnome", label: "ノームソート" },
    { id: "insertion", label: "挿入ソート" },
    { id: "bubble", label: "バブルソート" },
  ];

  return (
    <div>
        <h1>Select sorting method</h1>
        
        <Sort options={SORT_SYSTEMS} value={value} onChange={onChange} />

    </div>
  );
};

export default SortList
