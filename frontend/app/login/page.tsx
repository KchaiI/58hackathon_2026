"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDemoLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: "admin@gmail.com",
      password: "admin123",
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // profilesに名前・住所・メールを保存
      await supabase.from("profiles").insert({
        id: data.user!.id,
        name,
        email,
        address,
      });
    }
    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {mode === "login" ? "ログイン" : "新規登録"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <>
            <input
              type="text"
              required
              placeholder="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
            <input
              type="text"
              placeholder="住所"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </>
        )}
        <input
          type="email"
          required
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          type="password"
          required
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2a5c25] text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録する"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-sm text-[#3a7a30] underline w-full text-center"
      >
        {mode === "login" ? "アカウントを作成する" : "ログインはこちら"}
      </button>
      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
        >
          デモとして続ける
        </button>
      </div>
    </div>
  );
}
