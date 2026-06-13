import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userIdentifier = request.nextUrl.searchParams.get('user_identifier') ?? ''

  const { count } = await getSupabaseAdmin()
    .from('growth_record_likes')
    .select('*', { count: 'exact', head: true })
    .eq('growth_record_id', id)

  let liked = false
  if (userIdentifier) {
    const { data } = await getSupabaseAdmin()
      .from('growth_record_likes')
      .select('id')
      .eq('growth_record_id', id)
      .eq('user_identifier', userIdentifier)
      .maybeSingle()
    liked = !!data
  }

  return Response.json({ count: count ?? 0, liked })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { user_identifier } = await request.json()

  if (!user_identifier) {
    return Response.json({ error: 'user_identifier は必須です' }, { status: 400 })
  }

  const { error } = await getSupabaseAdmin()
    .from('growth_record_likes')
    .insert({ growth_record_id: id, user_identifier })

  // UNIQUE制約違反 = すでにいいね済み
  if (error && error.code !== '23505') {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const { count } = await getSupabaseAdmin()
    .from('growth_record_likes')
    .select('*', { count: 'exact', head: true })
    .eq('growth_record_id', id)

  return Response.json({ count: count ?? 0, liked: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { user_identifier } = await request.json()

  if (!user_identifier) {
    return Response.json({ error: 'user_identifier は必須です' }, { status: 400 })
  }

  const { error } = await getSupabaseAdmin()
    .from('growth_record_likes')
    .delete()
    .eq('growth_record_id', id)
    .eq('user_identifier', user_identifier)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { count } = await getSupabaseAdmin()
    .from('growth_record_likes')
    .select('*', { count: 'exact', head: true })
    .eq('growth_record_id', id)

  return Response.json({ count: count ?? 0, liked: false })
}
