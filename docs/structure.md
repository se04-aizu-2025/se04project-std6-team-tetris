# ディレクトリ構造メモ

## frontend/

### frontend/src/components/
- SortControls  
  ソート選択ボタン、開始ボタン、手動入力UI
- ArrayView  
  配列を棒グラフなどで可視化
- StepInfo  
  compare / swap などの情報表示

### frontend/src/hooks/
- useSteps  
  JSONの steps を順に再生するロジック
- useTimer  
  再生スピード制御用

### frontend/src/utils/
- loadJson  
  JSONファイル読み込み
- parseSteps  
  steps配列を扱いやすい形に変換

---
