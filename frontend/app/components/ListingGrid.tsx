'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '../page'

function monthsUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const now = new Date()
  const harvest = new Date(dateStr)
  const diff =
    (harvest.getFullYear() - now.getFullYear()) * 12 +
    (harvest.getMonth() - now.getMonth())
  return diff > 0 ? diff : null
}

export default function ListingGrid({ listings }: { listings: Listing[] }) {
  const [activeCategory, setActiveCategory] = useState('すべて')
  const [query, setQuery] = useState('')

  const crops = ['すべて', ...Array.from(new Set(listings.map((l) => l.crop)))]

  const filtered = listings.filter((l) => {
    const matchCategory = activeCategory === 'すべて' || l.crop === activeCategory
    const q = query.trim().toLowerCase()
    const matchQuery =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.crop.toLowerCase().includes(q) ||
      l.producers?.location?.toLowerCase().includes(q) ||
      l.producers?.name?.toLowerCase().includes(q)
    return matchCategory && matchQuery
  })

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-[#3a7a30]"
            >
              <path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9zM12 12C12 7 17 3 22 3c0 5-4 9-10 9z" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900">
              オーナー枠マーケット
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            日本の農家・林業家のオーナーになろう
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/producer/dashboard"
            className="border border-[#2a5c25] text-[#2a5c25] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-50 transition"
          >
            生産者ダッシュボード
          </Link>
          <Link
            href="/producer/create"
            className="bg-[#2a5c25] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e4a1a] transition"
          >
            枠を出品する
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="作物名・産地・農園名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3a7a30] transition"
        />
      </div>

      {/* Filter + Sort */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 flex-wrap">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setActiveCategory(crop)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                activeCategory === crop
                  ? 'border-gray-800 text-gray-900 font-medium bg-white'
                  : 'border-gray-200 text-gray-500 bg-white hover:border-gray-400'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500 flex items-center gap-1 whitespace-nowrap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          収穫が近い順
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filtered.map((listing, index) => {
            const used = listing.total_slots - listing.available_slots
            const pct = Math.round((used / listing.total_slots) * 100)
            const months = monthsUntil(listing.harvest_date)

            return (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer bg-[#f2f7f0]">
                  {/* Image */}
                  <div className="relative w-full h-44 bg-[#e4eee0] flex items-center justify-center">
                    <Image
                      src={listing.image_url || `https://picsum.photos/seed/${listing.id}/600/400`}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-[#daebd4] text-[#3a7a30] px-2.5 py-1 rounded-full">
                        {listing.crop}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ¥{listing.price.toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mt-2">
                      {listing.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {listing.producers?.location}
                    </p>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="h-1.5 bg-[#d0e4cc] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3a7a30] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        残り {listing.available_slots}/{listing.total_slots} 枠
                        {months != null && `・収穫まで約${months}ヶ月`}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🌱</p>
          <p>まだ出品がありません</p>
          <Link
            href="/producer/create"
            className="text-[#3a7a30] underline mt-2 block"
          >
            最初の枠を出品する
          </Link>
        </div>
      )}
    </div>
  )
}
