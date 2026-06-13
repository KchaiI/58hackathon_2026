'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Listing = {
  id: string
  short_id: number
  title: string
  crop: string
  image_url: string | null
  harvest_date: string | null
  created_at: string
  producers: { name: string; location: string } | null
}

type Ownership = {
  id: string
  owner_name: string
  owner_email: string
  created_at: string
  listings: Listing | null
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function monthsUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const now = new Date()
  const harvest = new Date(dateStr)
  const diff = (harvest.getFullYear() - now.getFullYear()) * 12 + (harvest.getMonth() - now.getMonth())
  return diff > 0 ? diff : null
}

function weeksUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const now = new Date()
  const harvest = new Date(dateStr)
  const diffMs = harvest.getTime() - now.getTime()
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
  return weeks > 0 ? weeks : null
}

function harvestProgress(createdAt: string, harvestDate: string | null): number {
  if (!harvestDate) return 30
  const start = new Date(createdAt).getTime()
  const end = new Date(harvestDate).getTime()
  const now = Date.now()
  const pct = ((now - start) / (end - start)) * 100
  return Math.min(Math.max(pct, 5), 95)
}

function harvestLabel(harvestDate: string | null): string {
  if (!harvestDate) return '育成中'
  const weeks = weeksUntil(harvestDate)
  if (weeks === null) return '収穫済み'
  if (weeks <= 4) return '収穫間近'
  return '育成中'
}

function harvestLabelStyle(label: string) {
  if (label === '収穫間近') return 'bg-[#f5edd6] text-[#9a6f2a]'
  if (label === '収穫済み') return 'bg-gray-100 text-gray-500'
  return 'bg-[#e4eee0] text-[#3a7a30]'
}

function timeUntilText(harvestDate: string | null): string {
  if (!harvestDate) return ''
  const weeks = weeksUntil(harvestDate)
  if (weeks === null) return '収穫済み'
  if (weeks <= 4) return `収穫まで約${weeks}週間`
  const months = monthsUntil(harvestDate)
  return months ? `収穫まで約${months}ヶ月` : ''
}

function sinceYear(ownerships: Ownership[]): number {
  if (!ownerships.length) return new Date().getFullYear()
  const dates = ownerships.map(o => new Date(o.created_at).getFullYear())
  return Math.min(...dates)
}

export default function MyPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [ownerships, setOwnerships] = useState<Ownership[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/ownerships?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    setOwnerships(Array.isArray(data) ? data : [])
    setSubmitted(true)
    setLoading(false)
  }

  const name = ownerships[0]?.owner_name ?? ''
  const nearHarvest = ownerships.filter(o => {
    const w = weeksUntil(o.listings?.harvest_date ?? null)
    return w !== null && w <= 4
  }).length

  if (!submitted) {
    return (
      <main className="w-full px-12 py-8">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm mb-8 block">
          {'←'} 一覧に戻る
        </Link>
        <div className="max-w-md mx-auto mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">マイページ</h1>
          <p className="text-gray-500 text-sm mb-8">登録したメールアドレスで所有枠を確認できます</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3a7a30] transition"
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#2a5c25] text-white py-3 rounded-xl font-medium hover:bg-[#1e4a1a] disabled:opacity-50 transition"
            >
              {loading ? '検索中...' : '確認する'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (ownerships.length === 0) {
    return (
      <main className="w-full px-12 py-8">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm mb-8 block">
          {'←'} 一覧に戻る
        </Link>
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🌱</p>
          <p>所有している枠がありません</p>
          <Link href="/" className="text-[#3a7a30] underline mt-2 block text-sm">
            枠を探す
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full px-12 py-8">
      <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm mb-8 block">
        {'←'} 一覧に戻る
      </Link>

      {/* Profile */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#e4eee0] flex items-center justify-center text-[#3a7a30] font-bold text-lg">
          {getInitials(name)}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{name}</p>
          <p className="text-sm text-gray-400">{ownerships.length} plots owned · since {sinceYear(ownerships)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '所有中', value: ownerships.length },
          { label: '収穫間近', value: nearHarvest },
          { label: '新着の近況', value: 5 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#f5f3f0] rounded-2xl p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Ownership list */}
      <div className="space-y-3">
        {ownerships.map(o => {
          const listing = o.listings
          if (!listing) return null
          const pct = harvestProgress(listing.created_at, listing.harvest_date)
          const label = harvestLabel(listing.harvest_date)
          const timeText = timeUntilText(listing.harvest_date)

          return (
            <Link key={o.id} href={`/listings/${listing.short_id}`}>
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition cursor-pointer">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl bg-[#e4eee0] flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {listing.image_url ? (
                    <Image src={listing.image_url} alt={listing.title} fill className="object-cover" unoptimized />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[#7aaa6a]">
                      <path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9zM12 12C12 7 17 3 22 3c0 5-4 9-10 9z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900 text-sm">
                      {listing.crop}・{listing.producers?.name}
                    </p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ml-2 flex-shrink-0 ${harvestLabelStyle(label)}`}>
                      {label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>定植</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3a7a30] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span>収穫</span>
                  </div>
                  {timeText && (
                    <p className="text-xs text-gray-400 mt-1">{timeText}</p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
