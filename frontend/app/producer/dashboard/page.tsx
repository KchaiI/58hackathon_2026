"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Ownership = {
  profiles: { name: string; email: string } | null;
};

type Listing = {
  id: string;
  title: string;
  crop: string;
  price: number;
  total_slots: number;
  available_slots: number;
  harvest_date: string | null;
  image_url: string | null;
  ownerships: Ownership[];
};

function getStatus(listing: Listing): { label: string; cls: string } {
  const sold = listing.total_slots - listing.available_slots;
  if (sold >= listing.total_slots) {
    return { label: "満枠", cls: "bg-[#e8dcc5] text-[#7a5020]" };
  }
  if (listing.harvest_date) {
    const days = Math.ceil(
      (new Date(listing.harvest_date).getTime() - Date.now()) / 86400000,
    );
    if (days <= 30)
      return { label: "収穫間近", cls: "bg-[#e8dcc5] text-[#7a5020]" };
  }
  return { label: "育成中", cls: "bg-[#d4e6c3] text-[#2a5c2a]" };
}

export default function ProducerDashboard() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings/?producer_id=${user.id}`,
      )
        .then((r) => r.json())
        .then((data) => {
          setListings(data ?? []);
          setLoading(false);
        });
    });
  }, [router]);

  const totalOwners = listings.reduce(
    (sum, l) => sum + (l.total_slots - l.available_slots),
    0,
  );
  const totalRevenue = listings.reduce(
    (sum, l) => sum + l.price * (l.total_slots - l.available_slots),
    0,
  );

  return (
    <main className="w-full px-12 py-8">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-sm text-white bg-[#2a5c25] px-4 py-2 rounded-lg hover:bg-[#1e4a1a] transition mb-8"
      >
        {"←"} 一覧に戻る
      </button>

      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            生産者ダッシュボード
          </h1>
          <p className="text-[#9a9080] mt-1 text-sm">
            自分の枠一覧とオーナー数を確認できます
          </p>
        </div>
        <Link
          href="/producer/create"
          className="bg-[#2a5c25] text-white px-4 py-2 rounded-xl hover:bg-[#1e4a1a] text-sm font-medium transition"
        >
          新しい枠を出品する
        </Link>
      </div>
    </main>
  );
}
