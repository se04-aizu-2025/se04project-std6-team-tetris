export const SORT_DESCRIPTIONS = {
  quick: {
    id: "quick",
    title: "クイックソート (Quick Sort)",
    summary:
      "基準値（ピボット）を1つ選び、ピボットより小さいグループ/大きいグループに分割（partition）して、分割した各グループを再帰的にソートします。平均的にとても高速な代表的ソートです。",
    howItWorks: [
      "配列からピボット（基準）を選ぶ",
      "ピボットより小さい要素と大きい要素に分割する（partition）",
      "分割した左右の配列をそれぞれ同じ方法でソートする（再帰）",
      "分割が進み、要素数が1以下になったら終了",
    ],
    complexity: {
      timeAverage: "O(n log n)",
      timeWorst: "O(n^2) ※ピボット次第",
      space: "O(log n) 目安（再帰）",
      stable: "不安定 (unstable)",
    },
    goodFor: ["平均ケースが速い", "追加メモリが少なめ"],
    notGoodFor: ["最悪ケースがO(n^2)になり得る", "安定ソートではない"],
  },
  merge: {
    id: "merge",
    title: "マージソート (Merge Sort)",
    summary:
      "配列を半分に分割し続け（divide）、小さくなった配列を順にマージ（merge）していくことでソートします。常に \(O(n \\log n)\) で安定ソートなのが強みです。",
    howItWorks: [
      "配列を半分に分割する",
      "分割した配列をそれぞれ同じ方法で分割し続ける",
      "要素数1になった配列同士を、順番を保ちながらマージしていく",
      "最終的に全体がソートされた配列になる",
    ],
    complexity: {
      timeAverage: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)",
      stable: "安定 (stable)",
    },
    goodFor: ["最悪でも速い（保証がある）", "安定ソート", "外部ソートにも向く"],
    notGoodFor: ["追加メモリ（O(n)）が必要"],
  },
  heap: {
    id: "heap",
    title: "ヒープソート (Heap Sort)",
    summary:
      "ヒープ（完全二分木の性質を満たすデータ構造）を使って最大値/最小値を効率よく取り出し、取り出した順に並べてソートします。最悪でも \(O(n \\log n)\) で追加メモリが少ないのが特徴です。",
    howItWorks: [
      "配列からヒープ（最大ヒープ/最小ヒープ）を構築する",
      "根（最大/最小）を末尾と交換して確定させる",
      "ヒープサイズを1つ減らし、ヒープ性を回復（heapify）する",
      "これを繰り返して全体を並べ替える",
    ],
    complexity: {
      timeAverage: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(1)",
      stable: "不安定 (unstable)",
    },
    goodFor: ["最悪でもO(n log n)", "追加メモリがほぼ不要"],
    notGoodFor: ["安定ソートではない", "実装がやや複雑"],
  },
  gnome: {
    id: "gnome",
    title: "ノームソート (Gnome Sort)",
    summary:
      "隣り合う要素を見て、順番が正しければ前に進み、逆ならswapして1つ戻る…を繰り返すソートです。動きが直感的で、挿入ソートに近いイメージで理解できます。",
    howItWorks: [
      "現在位置と1つ前を比較する",
      "順番が正しければ1つ進む",
      "順番が逆ならswapして1つ戻る（戻れないなら進む）",
      "最後まで到達したら完了",
    ],
    complexity: {
      timeAverage: "O(n^2)",
      timeWorst: "O(n^2)",
      space: "O(1)",
      stable: "安定 (stable)",
    },
    goodFor: ["実装・可視化がシンプル", "小規模データなら分かりやすい"],
    notGoodFor: ["大きいデータには向かない（基本的に二乗時間）"],
  },
  insertion: {
    id: "insertion",
    title: "挿入ソート (Insertion Sort)",
    summary:
      "左側を「ソート済み」とみなし、右側から1つ取り出して、ソート済み部分の正しい位置に“挿入”していくソートです。ほぼ整列済みのデータに強いです。",
    howItWorks: [
      "左から順に1つ取り出し、左側のソート済み部分へ挿入する",
      "挿入位置が見つかるまで、必要なら要素を右へずらす",
      "次の要素で同じことを繰り返す",
      "最後まで終われば完了",
    ],
    complexity: {
      timeAverage: "O(n^2)",
      timeWorst: "O(n^2)",
      space: "O(1)",
      stable: "安定 (stable)",
    },
    goodFor: ["ほぼ整列済みだと高速（最良 O(n)）", "追加メモリ不要", "安定ソート"],
    notGoodFor: ["ランダムで大きいデータだと遅い（O(n^2)）"],
  },
  bubble: {
    id: "bubble",
    title: "バブルソート (Bubble Sort)",
    summary:
      "隣り合う要素を比較して、順番が逆なら交換(swap)する…を繰り返して大きい値(または小さい値)を端に“泡のように”押し上げていくソートです。",
    howItWorks: [
      "左から順に、隣り合う2つを比較します（compare）",
      "順番が逆なら交換します（swap）",
      "1周すると、最大（または最小）が端に確定します",
      "未確定部分だけを対象に、同じことを繰り返します",
    ],
    complexity: {
      timeAverage: "O(n^2)",
      timeWorst: "O(n^2)",
      space: "O(1)",
      stable: "安定 (stable)",
    },
    goodFor: ["実装が簡単", "学習・可視化に向いている"],
    notGoodFor: ["データが大きいと遅い（基本的に二乗時間）"],
  },
};

