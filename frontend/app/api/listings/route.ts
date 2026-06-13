import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const producerId = request.nextUrl.searchParams.get('producer_id')

  if (producerId) {
    const { data } = await supabase
      .from('listings')
      .select('*, ownerships(owner_name, owner_email)')
      .eq('producer_id', producerId)
      .order('created_at', { ascending: false })
    return Response.json(data ?? [])
  }

  const { data } = await supabase
    .from('listings')
    .select('*, producers(name, location)')
    .gt('available_slots', 0)
    .order('created_at', { ascending: false })
  return Response.json(data ?? [])
}
