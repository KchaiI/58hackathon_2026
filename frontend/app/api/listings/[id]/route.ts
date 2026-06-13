import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/listings/[id]'>) {
  const { id } = await ctx.params

  const { data } = await supabase
    .from('listings')
    .select('*, producers(name, location, description)')
    .eq('id', id)
    .single()

  if (!data) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(data)
}
