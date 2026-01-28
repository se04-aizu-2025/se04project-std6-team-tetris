import React from "react";
import Sort from "./Sort";

const SortList = ({ value, onChange }) => {
  const SORT_SYSTEMS = [
    { id: "quick", label: "Quick Sort" },
    { id: "merge", label: "Merge Sort" },
    { id: "heap", label: "Heap Sort" },
    { id: "gnome", label: "Gnome Sort" },
    { id: "insertion", label: "Insertion Sort" },
    { id: "bubble", label: "Bubble Sort" },
  ];

  return (
    <div>
      <h1>Select sorting method</h1>
      <Sort options={SORT_SYSTEMS} value={value} onChange={onChange} />
    </div>
  );
};

export default SortList;
