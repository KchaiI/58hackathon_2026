'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ownerLinks = [
  { label: '枠一覧', href: '/', icon: '🌱' },
  { label: 'マイページ', href: '/my', icon: '👤' },
]

const producerLinks = [
  { label: 'ダッシュボード', href: '/producer/dashboard', icon: '📊' },
  { label: '枠を出品する', href: '/producer/create', icon: '➕' },
]

const theme = {
  owner: {
    btn: 'bg-[#2a5c25] hover:bg-[#1e4a1a]',
    active: 'bg-[#e4eee0] text-[#2a5c25]',
    toggle: 'bg-[#2a5c25] text-white',
  },
  producer: {
    btn: 'bg-[#1a3a5c] hover:bg-[#0f2540]',
    active: 'bg-[#dde8f5] text-[#1a3a5c]',
    toggle: 'bg-[#1a3a5c] text-white',
  },
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<'owner' | 'producer'>('owner')
  const pathname = usePathname()

  const links = role === 'owner' ? ownerLinks : producerLinks
  const t = theme[role]

  useEffect(() => {
    const isProducer = pathname.startsWith('/producer')
    document.body.style.backgroundColor = isProducer ? '#eaf0f7' : '#eef6eb'
  }, [pathname])

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-9 h-9 rounded-full text-white flex items-center justify-center shadow-md transition shrink-0 ${t.btn}`}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-40 bg-white shadow-xl flex flex-col transition-transform duration-300 w-60 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14" />

        {/* Role toggle */}
        <div className="mx-4 mt-4 mb-6 flex rounded-xl overflow-hidden border border-[#e0dbd2]">
          {(['owner', 'producer'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium transition ${
                role === r
                  ? theme[r].toggle
                  : 'bg-white text-[#5a5040] hover:bg-[#f5f3f0]'
              }`}
            >
              {r === 'owner' ? '支援者' : '生産者'}
            </button>
          ))}
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3">
          {links.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                pathname === href ? t.active : 'text-[#3a3530] hover:bg-[#f5f3f0]'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
