'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Producer = {
  user_id: string
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
  if (sold >= listing.total_slots) return { label: '満枠', cls: 'bg-[#e8dcc5] text-[#7a5020]' }
  if (listing.harvest_date) {
    const days = Math.ceil((new Date(listing.harvest_date).getTime() - Date.now()) / 86400000)
    if (days <= 30) return { label: '収穫間近', cls: 'bg-[#e8dcc5] text-[#7a5020]' }
  }
  return { label: '育成中', cls: 'bg-[#d4e6c3] text-[#2a5c2a]' }
}

function GrowthRecordForm({ listingId, onClose }: { listingId: string; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('画像を選択してください'); return }
    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const path = `${listingId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('growth-images')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError(`アップロード失敗: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('growth-images').getPublicUrl(path)
    const imageUrl = urlData.publicUrl

    const res = await fetch('/api/growth_records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, image_url: imageUrl, note: note || null }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? '投稿に失敗しました')
      setUploading(false)
      return
    }

    setDone(true)
    setUploading(false)
  }

  if (done) {
    return (
      <div className="mt-4 pt-4 border-t border-[#f0ede6] text-center py-6">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm text-[#2a5c2a] font-medium">投稿しました</p>
        <button onClick={onClose} className="mt-3 text-xs text-[#9a9080] underline">閉じる</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-[#f0ede6] space-y-3">
      <p className="text-xs font-medium text-[#5a5040]">成長記録を投稿</p>

      <div
        onClick={() => fileRef.current?.click()}
        className="relative w-full aspect-video rounded-xl bg-[#f2f7f0] border-2 border-dashed border-[#b4d4a4] flex items-center justify-center cursor-pointer hover:bg-[#e8f3e4] transition overflow-hidden"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <p className="text-3xl mb-1">📷</p>
            <p className="text-xs text-[#9a9080]">タップして画像を選択</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="コメント（任意）　例：葉が大きく育ってきました！"
        rows={2}
        className="w-full bg-[#f2f7f0] rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3a7a30] resize-none"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-[#2a5c25] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#1e4a1a] disabled:opacity-50 transition"
        >
          {uploading ? 'アップロード中...' : '投稿する'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-sm text-[#9a9080] bg-[#f0ede6] hover:bg-[#e8e4db] transition"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

export default function ProducerDashboard() {
  const [producers, setProducers] = useState<Producer[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [listings, setListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [openFormId, setOpenFormId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/producers')
      .then(res => res.json())
      .then(data => { if (data) setProducers(data) })
  }, [])

  useEffect(() => {
    if (!selectedId) { setListings([]); return }
    setLoadingListings(true)
    fetch(`/api/listings?producer_id=${selectedId}`)
      .then(res => res.json())
      .then(data => { setListings(data ?? []); setLoadingListings(false) })
  }, [selectedId])

  const selectedProducer = producers.find(p => p.user_id === selectedId)
  const totalOwners = listings.reduce((sum, l) => sum + (l.total_slots - l.available_slots), 0)
  const totalRevenue = listings.reduce((sum, l) => sum + l.price * (l.total_slots - l.available_slots), 0)

  return (
    <main className="w-full px-12 py-8">
<div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">生産者ダッシュボード</h1>
          <p className="text-[#9a9080] mt-1 text-sm">自分の枠一覧と支援者数を確認できます</p>
        </div>
      </div>

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
            <option key={p.user_id} value={p.user_id}>
              {p.name}{p.location ? ` (${p.location})` : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedProducer && (
        <div className="border border-[#e0dbd2] rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#d4dfc8] rounded-2xl p-4">
              <p className="text-xs text-[#9a9080] mb-1">出品中の枠</p>
              <p className="text-3xl font-bold text-[#1a1a1a]">{listings.length}</p>
            </div>
            <div className="bg-[#d4dfc8] rounded-2xl p-4">
              <p className="text-xs text-[#9a9080] mb-1">支援者総数</p>
              <p className="text-3xl font-bold text-[#1a1a1a]">{totalOwners}</p>
            </div>
            <div className="bg-[#d4dfc8] rounded-2xl p-4">
              <p className="text-xs text-[#9a9080] mb-1">累計売上</p>
              <p className="text-xl font-bold text-[#1a1a1a] leading-tight mt-1">¥{totalRevenue.toLocaleString()}</p>
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
                const isOpen = openFormId === listing.id
                return (
                  <div key={listing.id} className="bg-white rounded-2xl p-5">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#dce8d0] flex items-center justify-center shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a5c2a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a9 9 0 0 1 0 12" />
                          <path d="M12 14V22" />
                          <path d="M8 18c1.5-1 2.5-2.5 4-4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <Link href={`/listings/${listing.id}`} className="min-w-0 flex-1 mr-3">
                            <h2 className="text-base font-semibold text-[#1a1a1a] hover:underline leading-snug">{listing.title}</h2>
                            <p className="text-xs text-[#9a9080] mt-0.5">{listing.crop}</p>
                          </Link>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${status.cls}`}>{status.label}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-[#9a9080] mb-1">
                            <span>定植</span><span>収穫</span>
                          </div>
                          <div className="bg-[#d4dfc8] rounded-full h-2">
                            <div className="bg-[#2a5c2a] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <p className="text-xs text-[#9a9080]">
                          {sold} / {listing.total_slots} 枠 ({pct}%)
                          {listing.harvest_date && ` · 収穫予定: ${listing.harvest_date}`}
                          {` · ¥${listing.price.toLocaleString()}/枠`}
                        </p>
                      </div>
                    </div>

                    {/* Growth record post button */}
                    {!isOpen && (
                      <button
                        onClick={() => setOpenFormId(listing.id)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-[#b4d4a4] text-[#2a5c2a] text-sm hover:bg-[#f2f7f0] transition"
                      >
                        <span>📷</span>
                        <span>成長記録を投稿する</span>
                      </button>
                    )}

                    {isOpen && (
                      <GrowthRecordForm
                        listingId={listing.id}
                        onClose={() => setOpenFormId(null)}
                      />
                    )}

                    {owners.length > 0 && !isOpen && (
                      <div className="mt-4 pt-4 border-t border-[#f0ede6]">
                        <p className="text-xs font-medium text-[#9a9080] mb-2">支援者 ({owners.length}人)</p>
                        <ul className="space-y-1">
                          {owners.map((o, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <span className="w-5 h-5 rounded-full bg-[#dce8d0] text-[#2a5c2a] text-xs flex items-center justify-center font-medium shrink-0">{i + 1}</span>
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
