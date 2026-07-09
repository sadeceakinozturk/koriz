"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      setError("");
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      router.push("/profile");
    } catch (err) {
      setError("Kayıt oluşturulamadı. E-posta veya şifreyi kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-16 text-[#2b1a12]">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold">Korİz’e Katıl</h1>

        <p className="mt-2 text-sm text-gray-600">
          Sanatçı ya da sanatsever olarak ücretsiz hesap oluştur.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold">Ad Soyad</label>
            <input
              type="text"
              placeholder="Adınız ve soyadınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">E-posta</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Şifre</label>
            <input
              type="password"
              placeholder="En az 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-full bg-[#c46a2b] px-6 py-4 font-bold text-white hover:bg-[#9d4f17] disabled:opacity-60"
          >
            {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Zaten hesabın var mı?{" "}
          <a href="/login" className="font-bold text-[#c46a2b]">
            Giriş Yap
          </a>
        </p>
      </div>
    </main>
  );
}