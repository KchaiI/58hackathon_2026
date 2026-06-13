import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { listing_id, owner_name, owner_email } = body

  if (!listing_id || !owner_name || !owner_email) {
    return NextResponse.json({ error: 'listing_id, owner_name, owner_email は必須です' }, { status: 400 })
  }

  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('available_slots')
    .eq('id', listing_id)
    .single()

  if (fetchError || !listing) {
    return NextResponse.json({ error: '枠が見つかりません' }, { status: 404 })
  }

  if (listing.available_slots <= 0) {
    return NextResponse.json({ error: 'この枠は満員です' }, { status: 409 })
  }

  const { error: insertError } = await supabase
    .from('ownerships')
    .insert({ listing_id, owner_name, owner_email, slots: 1 })

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  await supabase
    .from('listings')
    .update({ available_slots: listing.available_slots - 1 })
    .eq('id', listing_id)

  return NextResponse.json({ success: true }, { status: 201 })
}
