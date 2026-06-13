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

function getStatus(listing: Listing): { label: string; cls: string } {
  const sold = listing.total_slots - listing.available_slots
  if (sold >= listing.total_slots) {
    return { label: '満枠', cls: 'bg-[#e8dcc5] text-[#7a5020]' }
  }
  if (listing.harvest_date) {
    const days = Math.ceil((new Date(listing.harvest_date).getTime() - Date.now()) / 86400000)
    if (days <= 30) return { label: '収穫間近', cls: 'bg-[#e8dcc5] text-[#7a5020]' }
  }
  return { label: '育成中', cls: 'bg-[#d4e6c3] text-[#2a5c2a]' }
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
    <main className="w-full px-12 py-8">
      <button onClick={() => router.push('/')} className="flex items-center gap-1 text-sm text-white bg-[#2a5c25] px-4 py-2 rounded-lg hover:bg-[#1e4a1a] transition mb-8">
        {'←'} 一覧に戻る
      </button>

      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">生産者ダッシュボード</h1>
          <p className="text-[#9a9080] mt-1 text-sm">自分の枠一覧とオーナー数を確認できます</p>
        </div>
        <Link
          href="/producer/create"
          className="bg-[#2a5c25] text-white px-4 py-2 rounded-xl hover:bg-[#1e4a1a] text-sm font-medium transition"
        >
          新しい枠を出品する
        </Link>
      </div>

      {/* 生産者セレクター */}
      <div className="mb-6">
          <label className="block text-sm font-medium text-[#5a5040] mb-2">生産者を選択</label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="w-full bg-[#e8e4db] border-0 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2a5c2a] text-[#1a1a1a] text-sm appearance-none cursor-pointer"
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
          <div className="border border-[#e0dbd2] rounded-2xl p-6">
            {/* サマリーカード */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#d4dfc8] rounded-2xl p-4">
                <p className="text-xs text-[#9a9080] mb-1">出品中の枠</p>
                <p className="text-3xl font-bold text-[#1a1a1a]">{listings.length}</p>
              </div>
              <div className="bg-[#d4dfc8] rounded-2xl p-4">
                <p className="text-xs text-[#9a9080] mb-1">オーナー総数</p>
                <p className="text-3xl font-bold text-[#1a1a1a]">{totalOwners}</p>
              </div>
              <div className="bg-[#d4dfc8] rounded-2xl p-4">
                <p className="text-xs text-[#9a9080] mb-1">累計売上</p>
                <p className="text-xl font-bold text-[#1a1a1a] leading-tight mt-1">
                  ¥{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {loadingListings ? (
              <p className="text-[#9a9080] text-center py-10 text-sm">読み込み中...</p>
            ) : listings.length === 0 ? (
              <div className="text-center py-10 text-[#9a9080]">
                <p className="text-sm">まだ出品がありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map(listing => {
                  const sold = listing.total_slots - listing.available_slots
                  const pct = listing.total_slots > 0 ? Math.round((sold / listing.total_slots) * 100) : 0
                  const owners = listing.ownerships ?? []
                  const status = getStatus(listing)
                  return (
                    <div key={listing.id} className="bg-white rounded-2xl p-5">
                      <div className="flex gap-4">
                        {/* アイコンボックス */}
                        <div className="w-14 h-14 rounded-2xl bg-[#dce8d0] flex items-center justify-center shrink-0">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2a5c2a"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2a9 9 0 0 1 0 12" />
                            <path d="M12 14V22" />
                            <path d="M8 18c1.5-1 2.5-2.5 4-4" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* タイトル & バッジ */}
                          <div className="flex justify-between items-start mb-3">
                            <Link href={`/listings/${listing.id}`} className="min-w-0 flex-1 mr-3">
                              <h2 className="text-base font-semibold text-[#1a1a1a] hover:underline leading-snug">
                                {listing.title}
                              </h2>
                              <p className="text-xs text-[#9a9080] mt-0.5">{listing.crop}</p>
                            </Link>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${status.cls}`}>
                              {status.label}
                            </span>
                          </div>

                          {/* プログレスバー */}
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-[#9a9080] mb-1">
                              <span>定植</span>
                              <span>収穫</span>
                            </div>
                            <div className="bg-[#d4dfc8] rounded-full h-2">
                              <div
                                className="bg-[#2a5c2a] h-2 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          {/* サブテキスト */}
                          <p className="text-xs text-[#9a9080]">
                            {sold} / {listing.total_slots} 枠 ({pct}%)
                            {listing.harvest_date && ` · 収穫予定: ${listing.harvest_date}`}
                            {` · ¥${listing.price.toLocaleString()}/枠`}
                          </p>
                        </div>
                      </div>

                      {/* オーナーリスト */}
                      {owners.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f0ede6]">
                          <p className="text-xs font-medium text-[#9a9080] mb-2">
                            オーナー ({owners.length}人)
                          </p>
                          <ul className="space-y-1">
                            {owners.map((o, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <span className="w-5 h-5 rounded-full bg-[#dce8d0] text-[#2a5c2a] text-xs flex items-center justify-center font-medium shrink-0">
                                  {i + 1}
                                </span>
                                <span className="font-medium text-[#1a1a1a]">{o.owner_name}</span>
                                <span className="text-[#9a9080] text-xs truncate">{o.owner_email}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
    </main>
  )
}
