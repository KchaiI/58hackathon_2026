'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const ownerLinks = [
  { label: '支援者枠マーケット', href: '/listings', icon: '🌱' },
  { label: 'マイページ', href: '/supporter', icon: '👤' },
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
  const isProducerPage = pathname.startsWith('/producer')
  const btnColor = isProducerPage ? theme.producer.btn : theme.owner.btn

  useEffect(() => {
    const isProducer = pathname.startsWith('/producer')
    document.body.style.backgroundColor = isProducer ? '#eaf0f7' : '#eef6eb'
  }, [pathname])

  if (pathname === '/login') return null

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-9 h-9 rounded-full text-white flex items-center justify-center shadow-md transition shrink-0 ${btnColor}`}
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
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 mt-4 mb-4">
          <Image src="/agriowner_icon_1024.png" alt="AgriOwner" width={36} height={36} className="rounded-lg" />
          <span className="font-bold text-gray-900 text-base">AgriOwner</span>
        </div>

        {/* Role toggle */}
        <div className="mx-4 mb-6 flex rounded-xl overflow-hidden border border-[#e0dbd2]">
          {(['owner', 'producer'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-base font-medium transition ${
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${
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
