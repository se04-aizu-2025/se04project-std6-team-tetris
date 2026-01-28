// 既存のuseSortStepperに合わせたソートアルゴリズム実装

/**
 * バブルソート
 */
export function bubbleSort(arr) {
  const initialArray = [...arr];
  const array = [...arr];
  const steps = [];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - 1 - i; j++) {
      // 比較
      steps.push({
        type: "compare",
        i: j,
        j: j + 1
      });

      if (array[j] > array[j + 1]) {
        // 交換
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;

        steps.push({
          type: "swap",
          i: j,
          j: j + 1,
          array: [...array]
        });
      } else {
        // 交換なし
        steps.push({
          type: "noswap",
          i: j,
          j: j + 1
        });
      }
    }

    if (!swapped) break;
  }

  return {
    initialArray,
    steps
  };
}

/**
 * クイックソート
 */
export function quickSort(arr) {
  const initialArray = [...arr];
  const array = [...arr];
  const steps = [];

  function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // ピボットと比較
      steps.push({
        type: "compare",
        i: j,
        j: high
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            type: "swap",
            i: i,
            j: j,
            array: [...array]
          });
        } else {
          steps.push({
            type: "noswap",
            i: i,
            j: j
          });
        }
      } else {
        steps.push({
          type: "noswap",
          i: j,
          j: high
        });
      }
    }

    // ピボットを正しい位置に
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({
      type: "swap",
      i: i + 1,
      j: high,
      array: [...array]
    });

    return i + 1;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  if (array.length > 0) {
    quickSortHelper(0, array.length - 1);
  }

  return {
    initialArray,
    steps
  };
}

/**
 * マージソート
 */
export function mergeSort(arr) {
  const initialArray = [...arr];
  const array = [...arr];
  const steps = [];

  function merge(left, mid, right) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      // 比較
      steps.push({
        type: "compare",
        i: left + i,
        j: mid + 1 + j
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        type: "swap",
        i: k,
        j: k,
        array: [...array]
      });
      
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      steps.push({
        type: "swap",
        i: k,
        j: k,
        array: [...array]
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      steps.push({
        type: "swap",
        i: k,
        j: k,
        array: [...array]
      });
      j++;
      k++;
    }
  }

  function mergeSortHelper(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  if (array.length > 0) {
    mergeSortHelper(0, array.length - 1);
  }

  return {
    initialArray,
    steps
  };
}

/**
 * ヒープソート
 */
export function heapSort(arr) {
  const initialArray = [...arr];
  const array = [...arr];
  const steps = [];
  const n = array.length;

  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({
        type: "compare",
        i: largest,
        j: left
      });

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push({
        type: "compare",
        i: largest,
        j: right
      });

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      
      steps.push({
        type: "swap",
        i: i,
        j: largest,
        array: [...array]
      });

      heapify(n, largest);
    }
  }

  // ヒープの構築
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // ヒープソート
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      type: "compare",
      i: 0,
      j: i
    });

    [array[0], array[i]] = [array[i], array[0]];
    
    steps.push({
      type: "swap",
      i: 0,
      j: i,
      array: [...array]
    });

    heapify(i, 0);
  }

  return {
    initialArray,
    steps
  };
}

/**
 * 挿入ソート
 */
export function insertionSort(arr) {
  const initialArray = [...arr];
  const array = [...arr];
  const steps = [];

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0) {
      steps.push({
        type: "compare",
        i: j,
        j: i
      });

      if (array[j] > key) {
        array[j + 1] = array[j];
        
        steps.push({
          type: "swap",
          i: j,
          j: j + 1,
          array: [...array]
        });

        j--;
      } else {
        steps.push({
          type: "noswap",
          i: j,
          j: i
        });
        break;
      }
    }

    array[j + 1] = key;
    
    if (j + 1 !== i) {
      steps.push({
        type: "swap",
        i: j + 1,
        j: i,
        array: [...array]
      });
    }
  }

  return {
    initialArray,
    steps
  };
}

/**
 * ノームソート（Gnome Sort）
 * SortList.jsxで使われているため追加
 */
export function gnomeSort(arr) {
  const initialArray = [...arr];
  const array = [...arr];
  const steps = [];
  let i = 0;

  while (i < array.length) {
    if (i === 0) {
      i++;
      continue;
    }

    steps.push({
      type: "compare",
      i: i - 1,
      j: i
    });

    if (array[i] >= array[i - 1]) {
      steps.push({
        type: "noswap",
        i: i - 1,
        j: i
      });
      i++;
    } else {
      [array[i], array[i - 1]] = [array[i - 1], array[i]];
      steps.push({
        type: "swap",
        i: i - 1,
        j: i,
        array: [...array]
      });
      i--;
    }
  }

  return {
    initialArray,
    steps
  };
}

// ソートアルゴリズムのマッピング
export const sortAlgorithms = {
  bubble: bubbleSort,
  quick: quickSort,
  merge: mergeSort,
  heap: heapSort,
  insertion: insertionSort,
  gnome: gnomeSort
};
