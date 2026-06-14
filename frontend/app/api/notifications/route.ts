import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  const since = request.nextUrl.searchParams.get('since')
  if (!email) return Response.json({ count: 0 })

  const { data: ownerships } = await supabase
    .from('ownerships')
    .select('listing_id')
    .eq('owner_email', email)

  if (!ownerships?.length) return Response.json({ count: 0 })

  const listingIds = ownerships.map((o) => o.listing_id)

  let query = supabase
    .from('growth_records')
    .select('id')
    .in('listing_id', listingIds)

  if (since && since !== '0') {
    const sinceDate = new Date(Number(since)).toISOString()
    query = query.gt('created_at', sinceDate)
  }

  const { data } = await query
  return Response.json({ count: data?.length ?? 0 })
}
