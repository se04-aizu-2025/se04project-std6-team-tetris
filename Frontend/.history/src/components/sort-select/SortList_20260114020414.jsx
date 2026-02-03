import React from 'react'
import Sort from './Sort';



const SortList = () => {
  
  const SORT_SYSTEMS = [
    { id: "quick", label: "クイックソート" },
    { id: "merge", label: "マージソート" },
    { id: "heap", label: "ヒープソート" },
    { id: "bubble", label: "バブルソート" },
  ];

  return (
    <div>
        <h1>Select sorting method</h1>
        
        <Sort options = {SORT_SYSTEMS}/>

    </div>
  )
}

export default SortList
