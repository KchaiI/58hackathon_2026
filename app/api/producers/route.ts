import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { producerName, location, title, crop, description, price, totalSlots, harvestDate, imageUrl } = body

  if (!producerName || !title || !crop || !price || !totalSlots) {
    return NextResponse.json({ error: 'producerName, title, crop, price, totalSlots は必須です' }, { status: 400 })
  }

  const { data: producer, error: producerError } = await supabase
    .from('producers')
    .insert({ name: producerName, location: location ?? null })
    .select()
    .single()

  if (producerError || !producer) {
    return NextResponse.json({ error: '生産者の登録に失敗しました' }, { status: 500 })
  }

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .insert({
      producer_id: producer.id,
      title,
      crop,
      description: description ?? null,
      price: Number(price),
      total_slots: Number(totalSlots),
      available_slots: Number(totalSlots),
      harvest_date: harvestDate || null,
      image_url: imageUrl || null,
    })
    .select()
    .single()

  if (listingError) return NextResponse.json({ error: listingError.message }, { status: 500 })

  return NextResponse.json(listing, { status: 201 })
}
