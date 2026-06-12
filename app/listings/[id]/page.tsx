'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ListingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase
      .from('listings')
      .select('*, producers(name, location, description)')
      .eq('id', id)
      .single()
      .then(({ data }) => setListing(data))
  }, [id])

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault()
    if (!listing || listing.available_slots <= 0) return
    setLoading(true)

    await supabase.from('ownerships').insert({
      listing_id: listing.id,
      owner_name: name,
      owner_email: email,
      slots: 1,
    })

    await supabase
      .from('listings')
      .update({ available_slots: listing.available_slots - 1 })
      .eq('id', listing.id)

    setDone(true)
    setLoading(false)
  }

  if (!listing) return <div className="max-w-2xl mx-auto px-4 py-8">読み込み中...</div>

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 mb-6 block">
        ← 一覧に戻る
      </button>

      {listing.image_url && (
        <img src={listing.image_url} alt={listing.title} className="w-full h-56 object-cover rounded-xl mb-6" />
      )}

      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{listing.crop}</span>
      <h1 className="text-2xl font-bold mt-3">{listing.title}</h1>
      <p className="text-gray-500 mt-1">{listing.producers?.name} · {listing.producers?.location}</p>

      <p className="mt-4 text-gray-700 leading-relaxed">{listing.description}</p>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">¥{listing.price.toLocaleString()}</p>
          <p className="text-sm text-gray-400">残り {listing.available_slots}/{listing.total_slots} 枠</p>
        </div>
        {listing.harvest_date && (
          <div className="text-right text-sm text-gray-500">
            <p>収穫予定</p>
            <p className="font-medium">{listing.harvest_date}</p>
          </div>
        )}
      </div>

      {done ? (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-semibold text-green-700">オーナー登録が完了しました！</p>
          <p className="text-sm text-gray-500 mt-1">{email} に確認メールを送信しました</p>
        </div>
      ) : listing.available_slots > 0 ? (
        <form onSubmit={handlePurchase} className="mt-8 space-y-4">
          <h2 className="font-semibold text-lg">オーナー登録</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1">お名前</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">メールアドレス</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '処理中...' : `¥${listing.price.toLocaleString()} でオーナー登録する`}
          </button>
        </form>
      ) : (
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center text-gray-500">
          この枠は満員です
        </div>
      )}
    </main>
  )
}
