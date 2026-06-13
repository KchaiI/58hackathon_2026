'use client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-2">ログイン</h1>
      <p className="text-gray-500 text-sm mb-8">支援者枠マーケットへようこそ</p>
      <button
        onClick={() => router.push('/api/login')}
        className="w-full bg-[#2a5c25] text-white py-3 rounded-xl font-medium hover:bg-[#1e4a1a] transition"
      >
        ログイン
      </button>
    </div>
  )
}
