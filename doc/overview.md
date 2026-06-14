# AgriOwner — リポジトリ概要

農家・林業家が作物・木のオーナー枠をオンライン販売するプラットフォーム。購入者は育成過程を追跡し、収穫物を受け取ることができる。

---

## システム構成

```mermaid
graph TD
  Browser["ブラウザ"]
  Next["Next.js App\n(Vercel)"]
  API["API Routes\n/api/*"]
  Supabase["Supabase\n(PostgreSQL)"]
  Auth["Supabase Auth"]

  Browser -->|"ページリクエスト"| Next
  Browser -->|"fetch /api/*"| API
  API -->|"DB操作"| Supabase
  Next -->|"認証チェック\n(middleware)"| Auth
  Auth -->|"セッション"| Next
```

- **フロントエンド・バックエンドともに Next.js** で一元管理（Vercel にデプロイ）
- バックエンドサーバーは存在せず、`/app/api/` 以下の API Routes が DB アクセスを担う
- DB・認証は **Supabase** に委譲

---

## ページ構成

```mermaid
graph LR
  Login["/login\nデモログイン"]
  Home["/\n枠一覧"]
  Detail["/listings/[id]\n枠の詳細"]
  Payment["/payment_demo\n支払いデモ"]
  My["/my\nマイページ"]
  Dashboard["/producer/dashboard\n生産者ダッシュボード"]
  Create["/producer/create\n枠を出品"]

  Login -->|"ログイン"| My
  Home -->|"枠を選択"| Detail
  Detail -->|"オーナー登録"| Payment
  Payment -->|"支払い完了"| My
  Dashboard -->|"新規出品"| Create
  Create -->|"出品完了"| Dashboard
```

---

## データフロー

### 枠購入フロー

```mermaid
sequenceDiagram
  actor User
  participant Detail as /listings/[id]
  participant Payment as /payment_demo
  participant API as /api/ownerships
  participant DB as Supabase

  User->>Detail: 名前・メール入力
  Detail->>Payment: クエリパラメータで情報を渡す
  User->>Payment: カード情報入力・支払いボタン
  Payment->>API: POST { listing_id, owner_name, owner_email }
  API->>DB: available_slots 確認
  DB-->>API: 現在の残り枠数
  API->>DB: ownerships INSERT
  API->>DB: listings available_slots -1
  Payment-->>User: Success!! 表示
  Payment->>Payment: /my へ遷移
```

### 枠出品フロー

```mermaid
sequenceDiagram
  actor Producer
  participant CreatePage as /producer/create
  participant API as /api/producers
  participant DB as Supabase

  Producer->>CreatePage: 生産者情報・枠情報を入力
  CreatePage->>API: POST { producerName, location, title, crop, price, ... }
  API->>DB: producers UPSERT
  API->>DB: listings INSERT
  DB-->>API: 登録完了
  API-->>CreatePage: 201 Created
  CreatePage->>CreatePage: /producer/dashboard へ遷移
```

---

## DB スキーマ

```mermaid
erDiagram
  profiles {
    uuid id PK
    text name
    text email
    text address
  }

  producers {
    uuid user_id PK
    text name
    text location
    text description
    text image_url
    timestamp created_at
  }

  listings {
    uuid id PK
    uuid producer_id FK
    text title
    text crop
    text description
    int price
    int total_slots
    int available_slots
    text image_url
    date harvest_date
    timestamp created_at
  }

  ownerships {
    uuid id PK
    uuid listing_id FK
    text user_id
    int slots
    timestamp created_at
  }

  producers ||--o{ listings : "出品"
  listings ||--o{ ownerships : "購入"
  profiles ||--o{ ownerships : "所有"
```

---

## API Routes

| メソッド | エンドポイント       | 説明                                       |
| -------- | -------------------- | ------------------------------------------ |
| GET      | `/api/listings`      | 枠一覧（`?producer_id=` で生産者絞り込み） |
| GET      | `/api/listings/[id]` | 枠の詳細（producers 結合）                 |
| GET      | `/api/ownerships`    | 所有枠一覧（`?email=` 必須）               |
| POST     | `/api/ownerships`    | 枠を購入・available_slots を -1            |
| GET      | `/api/producers`     | 生産者一覧                                 |
| POST     | `/api/producers`     | 生産者 + 枠を同時作成                      |

---

## デプロイフロー

```mermaid
graph LR
  Push["git push\nmain ブランチ"]
  CI["GitHub Actions\ndeploy.yml"]
  Install["npm install\n(frontend/)"]
  Build["vercel build"]
  Deploy["vercel deploy\n--prod"]
  Vercel["Vercel\n本番環境"]

  Push --> CI
  CI --> Install
  Install --> Build
  Build --> Deploy
  Deploy --> Vercel
```

- PR 時はプレビューデプロイ、`main` マージ時は本番デプロイ
- 環境変数（`NEXT_PUBLIC_SUPABASE_URL` 等）は GitHub Secrets → Vercel 経由で注入

---

## 技術スタック

| 領域           | 技術                    |
| -------------- | ----------------------- |
| フレームワーク | Next.js 16 (App Router) |
| 言語           | TypeScript              |
| スタイリング   | Tailwind CSS v4         |
| DB / 認証      | Supabase (PostgreSQL)   |
| デプロイ       | Vercel + GitHub Actions |
