import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data } = await supabase
    .from('listings')
    .select('*, producers(name, location, description)')
    .eq('id', id)
    .single()

  if (!data) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(data)
}
