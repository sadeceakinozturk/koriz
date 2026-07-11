"use client";

import { FormEvent, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

export default function EditArtworkPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Portre");
  const [woodType, setWoodType] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [story, setStory] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      if (!id) {
        setMessage("Eser kimliği bulunamadı.");
        setPageLoading(false);
        return;
      }

      try {
        const artworkRef = doc(db, "artworks", id);
        const artworkSnap = await getDoc(artworkRef);

        if (!artworkSnap.exists()) {
          setMessage("Eser bulunamadı.");
          setPageLoading(false);
          return;
        }

        const artwork = artworkSnap.data();

        if (artwork.artistId !== user.uid) {
          setMessage("Bu eseri düzenleme yetkiniz yok.");
          setPageLoading(false);
          return;
        }

        setTitle(artwork.title || "");
        setCategory(artwork.category || "Portre");
        setWoodType(artwork.woodType || "");
        setSize(artwork.size || "");
        setPrice(String(artwork.price || ""));
        setStory(artwork.story || "");
      } catch (error) {
        console.error("Eser bilgileri alınamadı:", error);
        setMessage("Eser bilgileri yüklenirken hata oluştu.");
      } finally {
        setPageLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setMessage("Eser adı boş bırakılamaz.");
      return;
    }

    if (!price.trim()) {
      setMessage("Fiyat alanı boş bırakılamaz.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const artworkRef = doc(db, "artworks", id);
      const artworkSnap = await getDoc(artworkRef);

      if (!artworkSnap.exists()) {
        setMessage("Eser bulunamadı.");
        return;
      }

      if (artworkSnap.data().artistId !== user.uid) {
        setMessage("Bu eseri düzenleme yetkiniz yok.");
        return;
      }

      await updateDoc(artworkRef, {
        title: title.trim(),
        category,
        woodType: woodType.trim(),
        size: size.trim(),
        price: price.trim(),
        story: story.trim(),
        updatedAt: serverTimestamp(),
      });

      setMessage("Eser başarıyla güncellendi.");

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (error) {
      console.error("Eser güncelleme hatası:", error);
      setMessage("Eser güncellenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 text-center shadow-xl">
          Eser bilgileri yükleniyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Eser Yönetimi
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          Eseri Düzenle
        </h1>

        <p className="mt-3 text-gray-600">
          Eser bilgilerini güncelleyip değişiklikleri kaydet.
        </p>

        {message && (
          <div className="mt-6 rounded-2xl bg-[#f6efe3] p-4 text-sm font-bold text-[#c46a2b]">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div>
            <label htmlFor="title" className="text-sm font-bold">
              Eser Adı
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="text-sm font-bold">
                Kategori
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              >
                <option value="Portre">Portre</option>
                <option value="Hat Sanatı">Hat Sanatı</option>
                <option value="Manzara">Manzara</option>
                <option value="Dekor">Dekor</option>
              </select>
            </div>

            <div>
              <label htmlFor="woodType" className="text-sm font-bold">
                Ahşap Türü
              </label>

              <input
                id="woodType"
                type="text"
                value={woodType}
                onChange={(event) => setWoodType(event.target.value)}
                placeholder="Ceviz, çam, zeytin..."
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="size" className="text-sm font-bold">
                Ölçü
              </label>

              <input
                id="size"
                type="text"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                placeholder="40 x 60 cm"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>

            <div>
              <label htmlFor="price" className="text-sm font-bold">
                Fiyat
              </label>

              <input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="2500"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="story" className="text-sm font-bold">
              Eser Hikâyesi
            </label>

            <textarea
              id="story"
              rows={6}
              value={story}
              onChange={(event) => setStory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex-1 rounded-full border border-[#c46a2b] px-8 py-4 font-bold text-[#c46a2b] hover:bg-[#f6efe3]"
            >
              İptal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-[#2b1a12] px-8 py-4 font-bold text-white hover:bg-[#c46a2b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}