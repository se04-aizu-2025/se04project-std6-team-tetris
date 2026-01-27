import React from "react";
import Sort from "./Sort";

const SortList = ({ value, onChange }) => {
  // backend側の method 仕様に合わせる（あなたのサーバは quick/merge/... を受ける前提）
  const SORT_SYSTEMS = [
    { id: "quick", label: "クイックソート" },
    { id: "merge", label: "マージソート" },
    { id: "bubble", label: "バブルソート" },
    { id: "insertion", label: "挿入ソート" },
    { id: "selection", label: "選択ソート" },
    { id: "gnome", label: "ノームソート" },
  ];

  return (
    <div>
      <h2>ソート方式</h2>
      <Sort options={SORT_SYSTEMS} value={value} onChange={onChange} />
    </div>
  );
};

export default SortList;
