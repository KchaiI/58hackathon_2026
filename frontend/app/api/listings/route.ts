import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const producerId = req.nextUrl.searchParams.get('producer_id')

  let query = supabase
    .from('listings')
    .select('*, producers(name, location), ownerships(owner_name, owner_email)')
    .order('created_at', { ascending: false })

  if (producerId) {
    query = query.eq('producer_id', producerId)
  } else {
    query = query.gt('available_slots', 0)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
