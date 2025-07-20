# Mapbox学習プロジェクト

このプロジェクトは、Mapbox GL JSとreact-map-glを使用した地理空間データ可視化の学習環境です。React Router v7をベースとし、TDD（テスト駆動開発）手法でMapbox統合を実装しています。

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`ファイルを`.env.local`にコピーし、実際の値を設定してください：

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集：

```bash
# Mapboxアクセストークン（必須）
VITE_MAPBOX_ACCESS_TOKEN=pk.your_actual_mapbox_access_token

# カスタムMapboxスタイルURL（任意）
VITE_MAPBOX_STYLE_URL=mapbox://styles/your-username/your-style-id
```

### 3. Mapboxアクセストークンの取得

1. [Mapbox](https://account.mapbox.com/)でアカウントを作成
2. [アクセストークンページ](https://account.mapbox.com/access-tokens/)でパブリックトークン（`pk.`で始まる）を取得
3. `.env.local`の`VITE_MAPBOX_ACCESS_TOKEN`に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開くとMapboxマップが表示されます。

## 🧪 テスト実行

このプロジェクトは包括的なテストスイート（41個のテスト）を含んでいます：

```bash
# 全テスト実行
npm run test

# 型チェック
npm run typecheck

# プロダクションビルド
npm run build
```

## 📁 プロジェクト構成

```
learning-mapbox/
├── app/
│   ├── components/          # Reactコンポーネント
│   │   └── MapContainer.tsx # Mapboxマップコンポーネント
│   ├── hooks/              # カスタムフック
│   │   └── useMapbox.ts    # Mapbox管理フック
│   ├── utils/              # ユーティリティ関数
│   │   ├── mapbox-env.ts   # 環境変数管理
│   │   └── mapbox-style.ts # スタイル管理
│   ├── types/              # TypeScript型定義
│   │   └── mapbox.ts       # Mapbox関連の型
│   └── __tests__/          # テストファイル
│       ├── components/     # コンポーネントテスト
│       ├── integration/    # 統合テスト
│       └── utils/          # ユーティリティテスト
├── .env.local              # 環境変数（Git管理外）
├── .env.example            # 環境変数テンプレート
└── CLAUDE.md              # 開発ガイドライン
```

## ⚙️ 設定可能な環境変数

| 変数名 | 必須 | 説明 | 例 |
|--------|------|------|-----|
| `VITE_MAPBOX_ACCESS_TOKEN` | ✅ | Mapboxアクセストークン | `pk.eyJ1Ijk...` |
| `VITE_MAPBOX_STYLE_URL` | ❌ | カスタムスタイルURL | `mapbox://styles/username/styleid` |

環境変数が設定されていない場合、デフォルトのMapboxスタイルが使用されます。

## 🛠️ 技術スタック

### フロントエンド
- **React Router v7**: フルスタックReactフレームワーク（SSR有効）
- **React 19**: 最新のReactフレームワーク
- **TypeScript 5.8+**: 型安全な開発環境
- **TailwindCSS 4.1+**: ユーティリティファーストCSS

### マップ・GIS
- **Mapbox GL JS**: インタラクティブマップライブラリ
- **react-map-gl**: Mapbox GL JSのReactラッパー
- **カスタムMapboxスタイル**: Mapbox Studioで作成

### 開発・テスト
- **Vitest**: 高速テストフレームワーク
- **Testing Library**: Reactコンポーネントテスト
- **TDD方式**: t-wada式テスト駆動開発
- **Vite 6.3+**: 高速ビルドツール

## 🎯 学習目標

### 基礎レベル
1. **Mapbox GL JS**の基本的な使用方法
2. **react-map-gl**を使ったReact統合
3. **環境変数管理**とセキュリティ
4. **TypeScript**での型安全なMapbox開発

### 応用レベル
5. **カスタムMapboxスタイル**の作成と適用
6. **TDD（テスト駆動開発）**の実践
7. **統合テスト**によるエンドツーエンドテスト
8. **エラーハンドリング**とフォールバック処理

### 将来の学習計画
- GeoJSON データの読み込みと可視化
- WebGL カスタムレイヤー
- リアルタイムデータ更新
- 大規模データセットの最適化
- シェーダープログラミング

## 🧪 テスト構成

このプロジェクトには41個の包括的なテストが含まれています：

- **環境変数管理テスト** (4テスト)
- **Mapboxスタイル管理テスト** (10テスト) 
- **useMapboxフックテスト** (5テスト)
- **MapContainerコンポーネントテスト** (12テスト)
- **統合テスト** (6テスト + 1スキップ)
- **環境テスト** (4テスト)

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

このプロジェクトは学習目的で作成されています。イシューやプルリクエストは歓迎します。

---

詳細な開発ガイドラインについては、[`CLAUDE.md`](./CLAUDE.md)をご参照ください。