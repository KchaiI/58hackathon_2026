'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Producer = {
  id: string
  name: string
  location: string | null
}

type Ownership = {
  owner_name: string
  owner_email: string
}

type Listing = {
  id: string
  title: string
  crop: string
  price: number
  total_slots: number
  available_slots: number
  harvest_date: string | null
  image_url: string | null
  ownerships: Ownership[]
}

export default function ProducerDashboard() {
  const router = useRouter()
  const [producers, setProducers] = useState<Producer[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [listings, setListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(false)

  useEffect(() => {
    supabase
      .from('producers')
      .select('id, name, location')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setProducers(data)
      })
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setListings([])
      return
    }
    setLoadingListings(true)
    fetch(`/api/listings?producer_id=${selectedId}`)
      .then(res => res.json())
      .then(data => {
        setListings(data ?? [])
        setLoadingListings(false)
      })
  }, [selectedId])

  const selectedProducer = producers.find(p => p.id === selectedId)
  const totalOwners = listings.reduce((sum, l) => sum + (l.total_slots - l.available_slots), 0)
  const totalRevenue = listings.reduce((sum, l) => sum + l.price * (l.total_slots - l.available_slots), 0)

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 mb-6 block">
        ← 一覧に戻る
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">生産者ダッシュボード</h1>
          <p className="text-gray-500 mt-1 text-sm">自分の枠一覧とオーナー数を確認できます</p>
        </div>
        <Link
          href="/producer/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
        >
          新しい枠を出品する
        </Link>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">生産者を選択</label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        >
          <option value="">
            {producers.length === 0 ? '読み込み中...' : `-- 生産者を選んでください (${producers.length}件) --`}
          </option>
          {producers.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}{p.location ? ` (${p.location})` : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedProducer && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{listings.length}</p>
              <p className="text-sm text-gray-500 mt-1">出品中の枠</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-700">{totalOwners}</p>
              <p className="text-sm text-gray-500 mt-1">オーナー総数</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">¥{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">累計売上</p>
            </div>
          </div>

          {loadingListings ? (
            <p className="text-gray-400 text-center py-10">読み込み中...</p>
          ) : listings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>まだ出品がありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map(listing => {
                const sold = listing.total_slots - listing.available_slots
                const pct = listing.total_slots > 0 ? Math.round((sold / listing.total_slots) * 100) : 0
                const owners = listing.ownerships ?? []
                return (
                  <div key={listing.id} className="border rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {listing.crop}
                        </span>
                        <Link href={`/listings/${listing.id}`}>
                          <h2 className="text-base font-semibold mt-2 hover:underline cursor-pointer">{listing.title}</h2>
                        </Link>
                        {listing.harvest_date && (
                          <p className="text-xs text-gray-400 mt-1">収穫予定: {listing.harvest_date}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">¥{listing.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">/枠</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {sold} / {listing.total_slots} 枠
                        <span className="ml-2 text-green-600 font-medium">({pct}%)</span>
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        オーナー ({owners.length}人)
                      </p>
                      {owners.length === 0 ? (
                        <p className="text-xs text-gray-400">まだオーナーがいません</p>
                      ) : (
                        <ul className="space-y-1">
                          {owners.map((o, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-medium">
                                {i + 1}
                              </span>
                              <span className="font-medium">{o.owner_name}</span>
                              <span className="text-gray-400 text-xs">{o.owner_email}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </main>
  )
}
