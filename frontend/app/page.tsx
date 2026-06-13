import { supabase } from '@/lib/supabase'
import ListingGrid from './components/ListingGrid'

export type Listing = {
  id: string
  short_id: number
  title: string
  crop: string
  price: number
  total_slots: number
  available_slots: number
  image_url: string | null
  harvest_date: string | null
  producers: { name: string; location: string } | null
}

export const revalidate = 0

export default async function Home() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*, producers(name, location)')
    .gt('available_slots', 0)
    .order('harvest_date', { ascending: true })

  return (
    <main className="w-full px-12 py-8">
      <ListingGrid listings={(listings as Listing[]) ?? []} />
    </main>
  )
}
