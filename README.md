# トークテーマガチャ 🎲

参加者の中からランダムに1人を選んで、トークテーマを割り当てるWebアプリケーションです。

## 機能

- ✨ 最大10人まで参加者を登録可能
- 🎯 ランダムに選ばれた人とテーマを表示
- 📝 テーマはJSONファイルで簡単に追加・編集可能
- 📱 レスポンシブデザイン対応
- 🎨 美しいアニメーション付きUI

## 使い方

1. `index.html` をブラウザで開く
2. 参加者の名前を入力（最大10人）
3. 「ガチャを回す!」ボタンをクリック
4. 選ばれた人とテーマが表示されます

## テーマのカスタマイズ

`themes.json` ファイルを編集することで、トークテーマを自由に追加・変更できます。

```json
{
    "themes": [
        "あなたのテーマ1",
        "あなたのテーマ2",
        "あなたのテーマ3"
    ]
}
```

## ファイル構成

- `index.html` - メインのHTMLファイル
- `style.css` - スタイルシート
- `script.js` - JavaScript（ガチャロジック）
- `themes.json` - トークテーマのデータファイル
- `package.json` - プロジェクト情報とバージョン管理
- `update-version.js` - バージョン自動更新スクリプト

## バージョン管理

このプロジェクトでは、コミット時に自動的にバージョン番号が更新されます。

### バージョンの更新方法

1. `package.json` のバージョンを更新:
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

2. コミット時に自動的に `index.html` のバージョン表示が更新されます

### 手動でバージョンを更新する場合

```bash
node update-version.js
```

## 動作環境

モダンブラウザ（Chrome, Firefox, Safari, Edgeなど）で動作します。

## ローカルで実行する場合

JSONファイルを読み込むため、ローカルサーバーで実行することをお勧めします。

### 簡単な方法（Python使用）

```bash
# Python 3の場合
python -m http.server 8000

# ブラウザで http://localhost:8000 を開く
```

### VS Code Live Server使用

1. VS Codeで拡張機能「Live Server」をインストール
2. `index.html` を右クリック→「Open with Live Server」

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。