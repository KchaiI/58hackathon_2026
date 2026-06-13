"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type GrowthRecord = {
  id: string;
  listing_id: string;
  image_url: string;
  note: string | null;
  created_at: string;
};

type Listing = {
  id: string;
  title: string;
  crop: string;
  image_url: string | null;
  harvest_date: string | null;
  created_at: string;
  producers: { name: string; location: string } | null;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function MyListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((data) => setListing(data));

    fetch(`/api/growth_records?listing_id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setRecords(Array.isArray(data) ? data : []);
        setLoadingRecords(false);
      })
      .catch(() => setLoadingRecords(false));
  }, [id]);

  if (!listing) {
    return (
      <main className="w-full px-12 py-8 text-gray-400">読み込み中...</main>
    );
  }

  return (
    <main className="w-full px-12 py-8 max-w-2xl">
      <Link
        href="/my"
        className="text-gray-400 hover:text-gray-600 text-sm mb-6 block"
      >
        {"←"} マイページに戻る
      </Link>

      {/* Listing header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-20 h-20 rounded-2xl bg-[#e4eee0] overflow-hidden shrink-0">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-8 h-8 text-[#7aaa6a]"
              >
                <path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9zM12 12C12 7 17 3 22 3c0 5-4 9-10 9z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <span className="text-xs bg-[#daebd4] text-[#3a7a30] px-2.5 py-1 rounded-full">
            {listing.crop}
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            {listing.title}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {listing.producers?.name}・{listing.producers?.location}
          </p>
          {listing.harvest_date && (
            <p className="text-xs text-gray-400 mt-0.5">
              収穫予定: {formatDate(listing.harvest_date)}
            </p>
          )}
        </div>
      </div>

      {/* Growth timeline */}
      <h2 className="text-base font-bold text-gray-800 mb-4">成長記録</h2>

      {loadingRecords ? (
        <p className="text-gray-400 text-sm">読み込み中...</p>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#f5f3f0] rounded-2xl">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-gray-400 text-sm">まだ成長記録がありません</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#d4e6c3]" />
          <div className="space-y-6">
            {records.map((record) => (
              <div key={record.id} className="flex gap-4">
                <div className="relative shrink-0 w-10 flex justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#3a7a30] border-2 border-white shadow mt-1.5" />
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-xs text-gray-400 mb-2">
                    {formatDate(record.created_at)}
                  </p>
                  <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#e4eee0]">
                    <Image
                      src={record.image_url}
                      alt={`成長記録 ${formatDate(record.created_at)}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  {record.note && (
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {record.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
