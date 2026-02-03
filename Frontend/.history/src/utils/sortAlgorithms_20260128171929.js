// ソートアルゴリズムの各ステップをログに記録する関数群

/**
 * バブルソート
 * 隣接する要素を比較して交換を繰り返す
 */
export function bubbleSort(arr) {
  const array = [...arr];
  const log = [];
  const n = array.length;

  // 初期状態を記録
  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: "初期状態"
  });

  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - 1 - i; j++) {
      // 比較中
      log.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `${array[j]} と ${array[j + 1]} を比較`
      });

      if (array[j] > array[j + 1]) {
        // 交換
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;

        log.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `${array[j + 1]} と ${array[j]} を交換`
        });
      }
    }

    // 末尾の要素が確定
    sorted.push(n - 1 - i);
    log.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `${array[n - 1 - i]} が確定位置に`
    });

    if (!swapped) break;
  }

  // 最後の要素も確定
  if (sorted.length < n) {
    sorted.push(0);
    log.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: "ソート完了"
    });
  }

  return log;
}

/**
 * クイックソート
 * ピボットを基準に分割して再帰的にソート
 */
export function quickSort(arr) {
  const array = [...arr];
  const log = [];

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: -1,
    description: "初期状態"
  });

  const sorted = [];

  function partition(low, high) {
    const pivot = array[high];
    const pivotIndex = high;
    
    log.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: pivotIndex,
      description: `ピボット: ${pivot} (インデックス ${high})`
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      log.push({
        array: [...array],
        comparing: [j, pivotIndex],
        swapping: [],
        sorted: [...sorted],
        pivot: pivotIndex,
        description: `${array[j]} と ピボット ${pivot} を比較`
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          log.push({
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            pivot: pivotIndex,
            description: `${array[j]} と ${array[i]} を交換`
          });
        }
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    log.push({
      array: [...array],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [...sorted],
      pivot: i + 1,
      description: `ピボット ${pivot} を正しい位置へ`
    });

    sorted.push(i + 1);
    return i + 1;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
      log.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        pivot: -1,
        description: `インデックス ${low} が確定`
      });
    }
  }

  if (array.length > 0) {
    quickSortHelper(0, array.length - 1);
  }

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    pivot: -1,
    description: "ソート完了"
  });

  return log;
}

/**
 * マージソート
 * 配列を分割してマージしながらソート
 */
export function mergeSort(arr) {
  const array = [...arr];
  const log = [];
  const sorted = [];

  log.push({
    array: [...array],
    comparing: [],
    merging: [],
    sorted: [...sorted],
    description: "初期状態"
  });

  function merge(left, mid, right) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    log.push({
      array: [...array],
      comparing: [],
      merging: Array.from({length: right - left + 1}, (_, i) => left + i),
      sorted: [...sorted],
      description: `マージ: インデックス ${left} から ${right}`
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      log.push({
        array: [...array],
        comparing: [left + i, mid + 1 + j],
        merging: Array.from({length: right - left + 1}, (_, idx) => left + idx),
        sorted: [...sorted],
        description: `${leftArr[i]} と ${rightArr[j]} を比較`
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      k++;

      log.push({
        array: [...array],
        comparing: [],
        merging: Array.from({length: right - left + 1}, (_, idx) => left + idx),
        sorted: [...sorted],
        description: `${array[k-1]} を配置`
      });
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      j++;
      k++;
    }

    log.push({
      array: [...array],
      comparing: [],
      merging: [],
      sorted: [...sorted],
      description: `マージ完了: ${left} から ${right}`
    });
  }

  function mergeSortHelper(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      log.push({
        array: [...array],
        comparing: [],
        merging: [],
        sorted: [...sorted],
        description: `分割: [${left}...${mid}] と [${mid+1}...${right}]`
      });

      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  if (array.length > 0) {
    mergeSortHelper(0, array.length - 1);
  }

  // 全要素を確定済みにする
  for (let i = 0; i < array.length; i++) {
    sorted.push(i);
  }

  log.push({
    array: [...array],
    comparing: [],
    merging: [],
    sorted: [...sorted],
    description: "ソート完了"
  });

  return log;
}

/**
 * ヒープソート
 * ヒープ構造を使ってソート
 */
export function heapSort(arr) {
  const array = [...arr];
  const log = [];
  const sorted = [];
  const n = array.length;

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "初期状態"
  });

  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      log.push({
        array: [...array],
        comparing: [largest, left],
        swapping: [],
        sorted: [...sorted],
        description: `${array[largest]} と ${array[left]} (左の子) を比較`
      });

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      log.push({
        array: [...array],
        comparing: [largest, right],
        swapping: [],
        sorted: [...sorted],
        description: `${array[largest]} と ${array[right]} (右の子) を比較`
      });

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      
      log.push({
        array: [...array],
        comparing: [],
        swapping: [i, largest],
        sorted: [...sorted],
        description: `${array[largest]} と ${array[i]} を交換してヒープ化`
      });

      heapify(n, largest);
    }
  }

  // ヒープの構築
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "最大ヒープ構築完了"
  });

  // ヒープソート
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    
    log.push({
      array: [...array],
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
      description: `最大値 ${array[i]} を末尾へ移動`
    });

    sorted.push(i);

    log.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `${array[i]} が確定位置に`
    });

    heapify(i, 0);
  }

  sorted.push(0);
  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "ソート完了"
  });

  return log;
}

/**
 * 挿入ソート
 * 要素を1つずつ取り出して適切な位置に挿入
 */
export function insertionSort(arr) {
  const array = [...arr];
  const log = [];
  const sorted = [0]; // 最初の要素は常にソート済み

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [0],
    description: "初期状態 (最初の要素はソート済み)"
  });

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    log.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      description: `${key} を挿入する位置を探す`
    });

    while (j >= 0 && array[j] > key) {
      log.push({
        array: [...array],
        comparing: [j, i],
        swapping: [],
        sorted: [...sorted],
        description: `${array[j]} > ${key}: ${array[j]} を右にシフト`
      });

      array[j + 1] = array[j];
      
      log.push({
        array: [...array],
        comparing: [],
        swapping: [j, j + 1],
        sorted: [...sorted],
        description: `${array[j + 1]} を位置 ${j + 1} へシフト`
      });

      j--;
    }

    array[j + 1] = key;
    sorted.push(i);

    log.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `${key} を位置 ${j + 1} に挿入`
    });
  }

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "ソート完了"
  });

  return log;
}

/**
 * バケットソート (シンプル版)
 * 値の範囲を分割してバケツに振り分け
 */
export function bucketSort(arr) {
  const array = [...arr];
  const log = [];
  const n = array.length;

  if (n === 0) return log;

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    buckets: [],
    description: "初期状態"
  });

  // 最小値と最大値を見つける
  const min = Math.min(...array);
  const max = Math.max(...array);
  const bucketCount = Math.min(10, n);
  const bucketSize = Math.ceil((max - min + 1) / bucketCount);

  // バケツの初期化
  const buckets = Array.from({ length: bucketCount }, () => []);

  // 要素をバケツに振り分け
  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.floor((array[i] - min) / bucketSize);
    buckets[Math.min(bucketIndex, bucketCount - 1)].push(array[i]);

    log.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: [],
      buckets: buckets.map(b => [...b]),
      description: `${array[i]} をバケット ${Math.min(bucketIndex, bucketCount - 1)} に追加`
    });
  }

  // 各バケツをソート
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      buckets[i].sort((a, b) => a - b);
      
      log.push({
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        buckets: buckets.map(b => [...b]),
        description: `バケット ${i} をソート: [${buckets[i].join(', ')}]`
      });

      for (let j = 0; j < buckets[i].length; j++) {
        array[index] = buckets[i][j];
        index++;

        log.push({
          array: [...array],
          comparing: [],
          swapping: [index - 1],
          sorted: Array.from({length: index}, (_, k) => k),
          buckets: buckets.map(b => [...b]),
          description: `${buckets[i][j]} を配列に戻す`
        });
      }
    }
  }

  log.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({length: n}, (_, i) => i),
    buckets: [],
    description: "ソート完了"
  });

  return log;
}

// ソートアルゴリズムのマッピング
export const sortAlgorithms = {
  bubble: bubbleSort,
  quick: quickSort,
  merge: mergeSort,
  heap: heapSort,
  insertion: insertionSort,
  bucket: bucketSort
};
