'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PaymentForm() {
  const params = useSearchParams()
  const price = params.get('price') ?? '0'
  const title = params.get('title') ?? ''

  return (
    <main style={{
      background: '#f5f6fa', display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '100vh', margin: 0,
    }}>
      <div style={{
        background: 'white', width: 400, padding: 30,
        borderRadius: 15, boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#333' }}>
          カード情報の入力
        </h2>
        {title && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#777', marginBottom: 20 }}>
            {title}
          </p>
        )}
        <div style={{ textAlign: 'center', fontSize: 28, marginBottom: 20 }}>
          💳 VISA ・ Mastercard ・ JCB
        </div>

        <form onSubmit={e => e.preventDefault()}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#555' }}>
              カード番号
            </label>
            <input
              type="text" placeholder="1234 5678 9012 3456" maxLength={19}
              style={{ width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 8, fontSize: 16 }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#555' }}>
              カード名義
            </label>
            <input
              type="text" placeholder="TARO YAMADA"
              style={{ width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 8, fontSize: 16 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#555' }}>
                有効期限
              </label>
              <input
                type="text" placeholder="MM / YY"
                style={{ width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 8, fontSize: 16 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#555' }}>
                セキュリティコード
              </label>
              <input
                type="password" placeholder="CVV" maxLength={4}
                style={{ width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 8, fontSize: 16 }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: 14, background: '#2563eb', color: 'white',
              border: 'none', borderRadius: 8, fontSize: 17, cursor: 'pointer',
            }}
          >
            ¥{Number(price).toLocaleString()} を支払う
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 15, color: '#777', fontSize: 13 }}>
          🔒 SSL暗号化通信で保護されています
        </p>
      </div>
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentForm />
    </Suspense>
  )
}
