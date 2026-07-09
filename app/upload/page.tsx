"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Portre");
  const [woodType, setWoodType] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [story, setStory] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await addDoc(collection(db, "artworks"), {
        title,
        category,
        woodType,
        size,
        price,
        story,
        artistId: user.uid,
        artistEmail: user.email,
        image: "/images/artworks/artwork-1.jpg.jpg",
        likes: 0,
        views: 0,
        createdAt: serverTimestamp(),
      });

      setMessage("Eser başarıyla yayınlandı.");

      setTitle("");
      setCategory("Portre");
      setWoodType("");
      setSize("");
      setPrice("");
      setStory("");
    } catch {
      setMessage("Eser kaydedilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Yeni Eser
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">Eser Yükle</h1>

        <p className="mt-3 text-gray-600">
          Ahşap yakma çalışmanı Korİz’de sergilemek için bilgileri doldur.
        </p>

        {message && (
          <div className="mt-5 rounded-2xl bg-[#f6efe3] p-4 text-sm font-bold text-[#c46a2b]">
            {message}
          </div>
        )}

        <form className="mt-8 grid gap-5">
          <div>
            <label className="text-sm font-bold">Eser Fotoğrafı</label>
            <input
              type="file"
              accept="image/*"
              disabled
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 opacity-60"
            />
            <p className="mt-2 text-xs text-gray-500">
              Fotoğraf yükleme Firebase Storage açıldıktan sonra aktif olacak.
            </p>
          </div>

          <div>
            <label className="text-sm font-bold">Eser Adı</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Örn: Ceviz Ağacına Portre"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              >
                <option>Portre</option>
                <option>Hat Sanatı</option>
                <option>Manzara</option>
                <option>Dekor</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold">Ahşap Türü</label>
              <input
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                type="text"
                placeholder="Ceviz, çam, zeytin..."
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold">Ölçü</label>
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                type="text"
                placeholder="40 x 60 cm"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Fiyat</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="text"
                placeholder="2500"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold">Eser Hikâyesi</label>
            <textarea
              rows={6}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Bu eser nasıl ortaya çıktı?"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 rounded-full bg-[#2b1a12] px-8 py-4 font-bold text-white hover:bg-[#c46a2b] disabled:opacity-60"
          >
            {loading ? "Yayınlanıyor..." : "Eseri Yayınla"}
          </button>
        </form>
      </section>
    </main>
  );
}