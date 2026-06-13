"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function PaymentForm() {
  const params = useSearchParams();
  const price = params.get("price") ?? "0";
  const title = params.get("title") ?? "";
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 2000));
    setStatus("success");
    await new Promise((r) => setTimeout(r, 1500));
    const listingId = params.get("listing_id");
    const name = params.get("name");
    const email = params.get("email");

    await fetch("/api/ownerships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: listingId,
        owner_name: name,
        owner_email: email,
      }),
    });

    router.push("/my");
  }

  if (status !== "idle") {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        {status === "loading" ? (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                border: "5px solid #e0e0e0",
                borderTop: "5px solid #2563eb",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 24px",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ fontSize: 20, color: "#333", fontWeight: 600 }}>
              支払い実行中...
            </p>
          </>
        ) : (
          <p style={{ fontSize: 28, color: "#16a34a", fontWeight: 700 }}>
            Success!!
          </p>
        )}
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#f5f6fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
      }}
    >
      <div
        style={{
          background: "white",
          width: 400,
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 8, color: "#333" }}>
          カード情報の入力
        </h2>
        {title && (
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#777",
              marginBottom: 20,
            }}
          >
            {title}
          </p>
        )}
        <div style={{ textAlign: "center", fontSize: 28, marginBottom: 20 }}>
          💳 VISA ・ Mastercard ・ JCB
        </div>

        <form onSubmit={handlePay}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                marginBottom: 6,
                color: "#555",
              }}
            >
              カード番号
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 8,
                fontSize: 16,
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                marginBottom: 6,
                color: "#555",
              }}
            >
              カード名義
            </label>
            <input
              type="text"
              placeholder="TARO YAMADA"
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 8,
                fontSize: 16,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  marginBottom: 6,
                  color: "#555",
                }}
              >
                有効期限
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  fontSize: 16,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  marginBottom: 6,
                  color: "#555",
                }}
              >
                セキュリティコード
              </label>
              <input
                type="password"
                placeholder="CVV"
                maxLength={4}
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  fontSize: 16,
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 14,
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            ¥{Number(price).toLocaleString()} を支払う
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 15,
            color: "#777",
            fontSize: 13,
          }}
        >
          🔒 SSL暗号化通信で保護されています
        </p>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentForm />
    </Suspense>
  );
}
