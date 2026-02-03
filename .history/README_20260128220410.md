# se04project-std6-team-tetris

実行方法
Backend（C言語サーバ）

backend ディレクトリへ移動

cd backend


Makefile を用いてビルド

make


サーバ起動

./server


※ Windows の場合

.\server.exe


バックエンドサーバは http://127.0.0.1:8081 で待ち受けます。

Frontend（React + Vite）

frontend ディレクトリへ移動

cd frontend


依存関係のインストール

npm install


開発サーバ起動

npm run dev


起動後、表示された URL
（通常は http://localhost:5173）にブラウザでアクセスしてください。

利用手順

ソートアルゴリズムを選択（bubble / merge / insertion / quick など）

配列をランダム生成、または手動入力

START ボタンを押す

ソート過程をステップ操作または自動再生で確認

実行時の注意点

Backend を起動してから Frontend を起動してください

フロントエンドからバックエンドへは
POST /sort（JSON）で通信します

ブラウザ通信のため、バックエンド側では
CORS および OPTIONS（プリフライトリクエスト）に対応しています