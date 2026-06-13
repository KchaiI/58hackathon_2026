'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    producerName: '',
    location: '',
    title: '',
    crop: '',
    description: '',
    price: '',
    totalSlots: '',
    harvestDate: '',
    imageUrl: '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/producers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) router.push('/')
    else setLoading(false)
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 mb-6 block">
        ← 一覧に戻る
      </button>
      <h1 className="text-2xl font-bold mb-6">オーナー枠を出品する</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section>
          <h2 className="font-semibold text-gray-700 mb-3">生産者情報</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">農家・生産者名</label>
              <input
                type="text" required value={form.producerName}
                onChange={e => set('producerName', e.target.value)}
                placeholder="例：長野わさび農園"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">所在地</label>
              <input
                type="text" value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="例：長野県松本市"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-gray-700 mb-3">オーナー枠の内容</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">タイトル</label>
              <input
                type="text" required value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="例：長野産わさびのオーナーになろう"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">作物・品目</label>
              <input
                type="text" required value={form.crop}
                onChange={e => set('crop', e.target.value)}
                placeholder="例：わさび、抹茶、山椒、杉"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">説明</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                placeholder="育て方・収穫物・特徴など"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">価格（円）</label>
                <input
                  type="number" required value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="50000"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">枠数</label>
                <input
                  type="number" required value={form.totalSlots}
                  onChange={e => set('totalSlots', e.target.value)}
                  placeholder="10"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">収穫予定日（任意）</label>
              <input
                type="date" value={form.harvestDate}
                onChange={e => set('harvestDate', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">画像URL（任意）</label>
              <input
                type="url" value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </section>

        <button
          type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? '出品中...' : '出品する'}
        </button>
      </form>
    </main>
  )
}
