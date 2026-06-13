import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await getSupabaseAdmin()
    .from('growth_record_comments')
    .select('*')
    .eq('growth_record_id', id)
    .order('created_at', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json(data ?? [])
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { user_identifier, user_name, body } = await request.json()

  if (!user_identifier || !user_name || !body) {
    return Response.json({ error: 'user_identifier, user_name, body は必須です' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('growth_record_comments')
    .insert({ growth_record_id: id, user_identifier, user_name, body })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json(data, { status: 201 })
}
