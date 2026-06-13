import { supabase } from '@/lib/supabase'
import ListingGrid from '../components/ListingGrid'
import type { Listing } from '../page'

export const revalidate = 0

export default async function ListingsPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*, producers(name, location)')
    .gt('available_slots', 0)
    .order('created_at', { ascending: false })

  return (
    <main className="w-full px-12 py-8">
      <ListingGrid listings={(listings as Listing[]) ?? []} />
    </main>
  )
}
