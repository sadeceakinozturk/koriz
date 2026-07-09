"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUid(user.uid);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        setName(data.name || "");
        setCity(data.city || "");
        setSpecialty(data.specialty || "");
        setBio(data.bio || "");
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleSave() {
    if (!uid) return;

    setLoading(true);
    setMessage("");

    try {
      await updateDoc(doc(db, "users", uid), {
        name,
        city,
        specialty,
        bio,
      });

      setMessage("Profil başarıyla güncellendi.");
    } catch {
      setMessage("Profil güncellenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Profil
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">Profili Düzenle</h1>

        <p className="mt-3 text-gray-600">
          Sanatçı bilgilerini düzenle ve Korİz profilini güçlendir.
        </p>

        {message && (
          <div className="mt-5 rounded-2xl bg-[#f6efe3] p-4 text-sm font-bold text-[#c46a2b]">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold">Ad Soyad</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Şehir</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ankara"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Uzmanlık Alanı</label>
            <input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Portre, hat sanatı, dekor..."
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Biyografi</label>
            <textarea
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendini ve sanat yolculuğunu anlat..."
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-full bg-[#2b1a12] px-6 py-4 font-bold text-white hover:bg-[#c46a2b] disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Profili Kaydet"}
          </button>
        </form>
      </section>
    </main>
  );
}