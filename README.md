# オーナー枠マーケット

農家・林業家などの生産者がオーナー制度を開設できるプラットフォーム。外国人が日本固有の作物・木のオーナーになり、育つ過程を追いながら収穫後の加工品を受け取れる。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **デプロイ**: Vercel
- **CI/CD**: GitHub Actions

---

## ローカル開発のセットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/KchaiI/58hackathon_2026.git
cd 58hackathon_2026
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.local` ファイルをプロジェクトルートに作成し、以下を記載：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase の URL と anon key は [Supabase ダッシュボード](https://supabase.com) の **Settings → API** から取得できます。

### 4. データベースのテーブルを作成

Supabase ダッシュボードの **SQL Editor** で以下を実行：

```sql
create table producers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid references producers(id) on delete cascade,
  title text not null,
  description text,
  crop text not null,
  price integer not null,
  total_slots integer not null,
  available_slots integer not null,
  image_url text,
  harvest_date date,
  created_at timestamptz default now()
);

create table ownerships (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  owner_name text not null,
  owner_email text not null,
  slots integer not null default 1,
  created_at timestamptz default now()
);
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアクセスできます。

---

## CI/CD（GitHub Actions + Vercel）

`main` ブランチに push すると自動でデプロイが走ります。

### GitHub Secrets に以下を登録

リポジトリの **Settings → Secrets and variables → Actions** で追加：

| Secret名 | 説明 |
|---|---|
| `VERCEL_TOKEN` | Vercel のアクセストークン |
| `VERCEL_ORG_ID` | `.vercel/project.json` の `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` の `projectId` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase のプロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase の anon key |

### Vercel との紐付け

```bash
npx vercel login
npx vercel link
```

---

## ページ構成

| URL | 内容 |
|---|---|
| `/` | オーナー枠一覧 |
| `/listings/[id]` | 枠の詳細・オーナー登録 |
| `/producer/new` | 生産者による枠の出品 |
