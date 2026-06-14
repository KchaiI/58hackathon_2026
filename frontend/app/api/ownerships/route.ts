import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  const listingId = request.nextUrl.searchParams.get('listing_id')

  if (listingId) {
    const { data } = await supabase
      .from('ownerships')
      .select('id, owner_name, slots')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
    return Response.json(data ?? [])
  }

  if (!email) return Response.json([], { status: 400 })

  const { data } = await supabase
    .from('ownerships')
    .select('*, listings(id, title, crop, image_url, harvest_date, created_at, producers(name, location))')
    .eq('owner_email', email)
    .order('created_at', { ascending: false })
  return Response.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const { listing_id, owner_name, owner_email } = await request.json()

  const { data: listing } = await supabase
    .from('listings')
    .select('available_slots')
    .eq('id', listing_id)
    .single()

  if (!listing) return Response.json({ error: '枠が見つかりません' }, { status: 404 })
  if (listing.available_slots <= 0) return Response.json({ error: 'この枠は満員です' }, { status: 409 })

  await supabase.from('ownerships').insert({ listing_id, owner_name, owner_email, slots: 1 })
  await supabase.from('listings').update({ available_slots: listing.available_slots - 1 }).eq('id', listing_id)

  return Response.json({ success: true }, { status: 201 })
}
