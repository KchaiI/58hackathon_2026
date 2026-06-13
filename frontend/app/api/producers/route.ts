import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  if (email) {
    const { data } = await supabase
      .from('producers')
      .select('user_id, name, location, email')
      .eq('email', email)
    return Response.json(data ?? [])
  }
  const { data } = await supabase
    .from('producers')
    .select('user_id, name, location, email')
    .order('created_at', { ascending: false })
  return Response.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const { producerName, location, email, title, crop, description, price, totalSlots, harvestDate, imageUrl } = await request.json()

  const { data: producer, error: producerError } = await supabase
    .from('producers')
    .insert({ user_id: crypto.randomUUID(), name: producerName, location, email: email || null })
    .select()
    .single()

  if (!producer) return Response.json({ error: '生産者の登録に失敗しました', detail: producerError?.message }, { status: 500 })

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .insert({
      producer_id: producer.user_id,
      title, crop, description,
      price: Number(price),
      total_slots: Number(totalSlots),
      available_slots: Number(totalSlots),
      harvest_date: harvestDate || null,
      image_url: imageUrl || null,
    })
    .select()
    .single()

  if (!listing) return Response.json({ error: '出品の登録に失敗しました', detail: listingError?.message }, { status: 500 })

  return Response.json(listing, { status: 201 })
}
