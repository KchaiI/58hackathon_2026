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

type Comment = {
  id: string;
  growth_record_id: string;
  user_identifier: string;
  user_name: string;
  body: string;
  created_at: string;
};

type LikeState = {
  count: number;
  liked: boolean;
  loading: boolean;
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

function formatDatetime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill={filled ? "#e05a5a" : "none"}
      stroke={filled ? "#e05a5a" : "currentColor"}
      strokeWidth="1.8"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function GrowthRecordCard({
  record,
  userIdentifier,
  userName,
}: {
  record: GrowthRecord;
  userIdentifier: string;
  userName: string;
}) {
  const [like, setLike] = useState<LikeState>({ count: 0, liked: false, loading: true });
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ user_identifier: userIdentifier });
    fetch(`/api/growth_records/${record.id}/likes?${params}`)
      .then((r) => r.json())
      .then((d) => setLike({ count: d.count ?? 0, liked: !!d.liked, loading: false }))
      .catch(() => setLike((prev) => ({ ...prev, loading: false })));
  }, [record.id, userIdentifier]);

  async function toggleLike() {
    if (like.loading) return;
    setLike((prev) => ({ ...prev, loading: true }));
    const method = like.liked ? "DELETE" : "POST";
    const res = await fetch(`/api/growth_records/${record.id}/likes`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_identifier: userIdentifier }),
    });
    const d = await res.json();
    setLike({ count: d.count ?? 0, liked: !!d.liked, loading: false });
  }

  async function loadComments() {
    setLoadingComments(true);
    const res = await fetch(`/api/growth_records/${record.id}/comments`);
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
    setLoadingComments(false);
  }

  function handleToggleComments() {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments((v) => !v);
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/growth_records/${record.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_identifier: userIdentifier,
        user_name: userName,
        body: commentBody.trim(),
      }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentBody("");
    }
    setPosting(false);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative w-full aspect-4/3 bg-[#e4eee0]">
        <Image
          src={record.image_url}
          alt={`成長記録 ${formatDate(record.created_at)}`}
          fill
          className="object-cover"
          unoptimized
        />
        <span className="absolute top-2 left-2 text-xs bg-black/40 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
          {formatDate(record.created_at)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {record.note && (
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{record.note}</p>
        )}

        {/* Actions row */}
        <div className="flex items-center gap-4">
          {/* Like button */}
          <button
            onClick={toggleLike}
            disabled={!userIdentifier || like.loading}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#e05a5a] disabled:opacity-40 transition"
          >
            <HeartIcon filled={like.liked} />
            <span className={like.liked ? "text-[#e05a5a] font-medium" : ""}>
              {like.count}
            </span>
          </button>

          {/* Comment toggle */}
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{comments.length > 0 ? comments.length : "コメント"}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
            {loadingComments ? (
              <p className="text-xs text-gray-400">読み込み中...</p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-gray-400">まだコメントがありません</p>
            ) : (
              <ul className="space-y-2">
                {comments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-medium text-gray-800">{c.user_name}</span>
                    <span className="text-gray-400 text-xs ml-1.5">{formatDatetime(c.created_at)}</span>
                    <p className="text-gray-600 mt-0.5 leading-snug">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}

            {/* Comment form */}
            {userIdentifier ? (
              <form onSubmit={handlePostComment} className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="コメントを追加..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#3a7a30] transition"
                />
                <button
                  type="submit"
                  disabled={posting || !commentBody.trim()}
                  className="bg-[#2a5c25] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1e4a1a] disabled:opacity-40 transition shrink-0"
                >
                  {posting ? "..." : "送信"}
                </button>
              </form>
            ) : (
              <p className="text-xs text-gray-400">コメントするにはマイページからログインしてください</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserIdentifier(sessionStorage.getItem("user_email") ?? "");
    setUserName(sessionStorage.getItem("user_name") ?? "");
  }, []);

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

      {/* Growth records */}
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
          {/* vertical timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#d4e6c3]" />
          <div className="space-y-6">
            {records.map((record) => (
              <div key={record.id} className="flex gap-4">
                {/* dot marker */}
                <div className="relative shrink-0 w-10 flex justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#3a7a30] border-2 border-white shadow mt-4" />
                </div>
                {/* card */}
                <div className="flex-1 pb-2">
                  <GrowthRecordCard
                    record={record}
                    userIdentifier={userIdentifier}
                    userName={userName}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
