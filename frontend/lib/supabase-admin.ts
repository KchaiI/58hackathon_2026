import { createClient } from '@supabase/supabase-js'

// サービスロールキーを使うサーバー専用クライアント（RLSをバイパス）
// SUPABASE_SERVICE_ROLE_KEY は .env.local に設定が必要
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
