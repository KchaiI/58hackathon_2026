'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateListingPage() {
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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

  const inputClass = 'w-full bg-[#f0f4f8] rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none border border-black transition'

  return (
    <main className="w-full px-12 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">支援者枠を出品する</h1>
        <p className="text-sm text-gray-600 mb-8">
          畑の一区画を、世界中の支援者に。<span className="text-red-500">*</span> は必須項目です
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-[#1a3a5c] pb-2 border-b border-gray-200 mb-4">
              生産者情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">
                  農家・生産者名 <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={form.producerName} onChange={e => set('producerName', e.target.value)} placeholder="例：長野わさび農園" className={inputClass} />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">所在地</label>
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)} placeholder="例：長野県松本市" className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#1a3a5c] pb-2 border-b border-gray-200 mb-4">
              支援者枠の内容
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="例：長野産わさびの支援者になろう" className={inputClass} />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">
                  作物・品目 <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={form.crop} onChange={e => set('crop', e.target.value)} placeholder="例：わさび、抹茶、山椒、杉" className={inputClass} />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">説明</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="育て方・収穫物・特徴など" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1.5">海外の支援者にはAIが翻訳して届けます。ふだんの言葉で大丈夫です。</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-1.5">
                    価格（円） <span className="text-red-500">*</span>
                  </label>
                  <input type="number" required value={form.price} onChange={e => set('price', e.target.value)} placeholder="50000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-1.5">
                    枠数 <span className="text-red-500">*</span>
                  </label>
                  <input type="number" required value={form.totalSlots} onChange={e => set('totalSlots', e.target.value)} placeholder="10" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">
                  収穫予定日 <span className="text-xs text-gray-400 font-normal ml-1">任意</span>
                </label>
                <input type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-800 mb-1.5">
                  画像URL <span className="text-xs text-gray-400 font-normal ml-1">任意</span>
                </label>
                <input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
            </div>
          </section>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#1a3a5c] text-white py-3.5 rounded-xl font-medium hover:bg-[#0f2540] disabled:opacity-50 transition"
          >
            {loading ? '出品中...' : '出品する'}
          </button>
        </form>
      </div>
    </main>
  )
}
