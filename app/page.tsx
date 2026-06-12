import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

export default async function Home() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*, producers(name, location)')
    .gt('available_slots', 0)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🌿 オーナー枠マーケット</h1>
          <p className="text-gray-500 mt-1">日本の農家・林業家のオーナーになろう</p>
        </div>
        <Link
          href="/producer/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          枠を出品する
        </Link>
      </div>

      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing: any) => (
            <Link key={listing.id} href={`/listings/${listing.id}`}>
              <div className="border rounded-xl p-5 hover:shadow-md transition cursor-pointer">
                {listing.image_url && (
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {listing.crop}
                    </span>
                    <h2 className="text-lg font-semibold mt-2">{listing.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {listing.producers?.name} · {listing.producers?.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">¥{listing.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      残り {listing.available_slots}/{listing.total_slots} 枠
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🌱</p>
          <p>まだ出品がありません</p>
          <Link href="/producer/new" className="text-green-600 underline mt-2 block">
            最初の枠を出品する
          </Link>
        </div>
      )}
    </main>
  )
}
