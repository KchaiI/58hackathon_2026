import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const listingId = request.nextUrl.searchParams.get('listing_id')
  if (!listingId) return Response.json([], { status: 400 })

  const { data } = await supabase
    .from('growth_records')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: true })

  return Response.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const { listing_id, image_url, note } = await request.json()

  if (!listing_id || !image_url) {
    return Response.json({ error: 'listing_id と image_url は必須です' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('growth_records')
    .insert({ listing_id, image_url, note: note || null })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json(data, { status: 201 })
}
