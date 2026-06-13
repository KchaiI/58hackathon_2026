"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  crop: string;
  description: string;
  price: number;
  total_slots: number;
  available_slots: number;
  image_url: string | null;
  harvest_date: string | null;
  producers: { name: string; location: string; description: string } | null;
};

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`bg-[#e4eee0] flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-10 h-10 text-[#7aaa6a]"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

export default function ListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data));
  }, [id]);

  async function handlePurchase(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!listing || listing.available_slots <= 0) return;
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ownerships/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listing.id, user_id: user.id }),
    });
    if (res.ok) {
      router.push(
        `/payment_demo?price=${listing.price}&title=${encodeURIComponent(listing.title)}`,
      );
      return;
    }
    setLoading(false);
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-8 text-gray-400">
        読み込み中...
      </div>
    );
  }

  const mainImage =
    listing.image_url || `https://picsum.photos/seed/${listing.id}/800/600`;

  return (
    <main className="w-full px-12 py-8">
      <button
        onClick={() => router.push("/")}
        className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 text-sm"
      >
        {"←"} 一覧に戻る
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div>
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[1, 2, 3].map((i) => (
              <ImagePlaceholder key={i} className="aspect-4/3 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Details + Form */}
        <div>
          <span className="text-xs bg-[#daebd4] text-[#3a7a30] px-2.5 py-1 rounded-full">
            {listing.crop}
          </span>
          <h1 className="text-3xl font-bold mt-3 text-gray-900">
            {listing.title}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {listing.producers?.name}・{listing.producers?.location}
          </p>

          {listing.description && (
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              {listing.description}
            </p>
          )}

          {/* Info card */}
          <div className="mt-5 p-4 bg-[#f5f3f0] rounded-xl flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ¥{listing.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                残り {listing.available_slots}/{listing.total_slots} 枠
              </p>
            </div>
            {listing.harvest_date && (
              <div className="text-right">
                <p className="text-xs text-gray-400">収穫予定</p>
                <p className="font-bold text-gray-900 mt-0.5">
                  {listing.harvest_date}
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          {listing.available_slots > 0 ? (
            <form onSubmit={handlePurchase} className="mt-6 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2a5c25] text-white py-3 rounded-xl font-medium hover:bg-[#1e4a1a] disabled:opacity-50 transition"
              >
                {loading
                  ? "処理中..."
                  : `¥${listing.price.toLocaleString()} でオーナー登録する`}
              </button>
            </form>
          ) : (
            <div className="mt-6 p-4 bg-gray-100 rounded-xl text-center text-gray-500">
              この枠は満員です
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
