export const SORT_DESCRIPTIONS = {
  quick: {
    summary: "分割統治でピボットを基準に配列を分割して整列します。",
    complexity: "平均 O(n log n)、最悪 O(n^2)",
    stable: "不安定",
    notes: "実装・ピボット選択で性能が変わる。平均は高速。",
  },
  merge: {
    summary: "分割統治で分割してマージしながら整列します。",
    complexity: "O(n log n)",
    stable: "安定",
    notes: "追加メモリが必要。大規模データで安定して速い。",
  },
  selection: {
    summary: "最小（最大）要素を選んで前から確定していきます。",
    complexity: "O(n^2)",
    stable: "不安定（実装次第）",
    notes: "交換回数は少ないが比較回数は多い。",
  },
  gnome: {
    summary: "要素を前後に移動させながら整列します（Gnome sort）。",
    complexity: "平均 O(n^2)",
    stable: "安定（実装次第）",
    notes: "単純だが大きい配列には不向き。",
  },
  bubble: {
    summary: "隣接要素を比較して交換し、最大値を末尾へ押し上げます。",
    complexity: "O(n^2)（最良 O(n)）",
    stable: "安定",
    notes: "教育用途向き。大きい配列には不向き。",
  },
  insertion: {
    summary: "手札を整えるように、前から挿入して整列します。",
    complexity: "平均 O(n^2)（最良 O(n)）",
    stable: "安定",
    notes: "ほぼ整列済みのデータで強い。",
  },
};
