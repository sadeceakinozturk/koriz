"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadArtwork() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const artworkRef = doc(db, "artworks", id);
        const artworkSnap = await getDoc(artworkRef);

        if (artworkSnap.exists()) {
          setArtwork({
            id: artworkSnap.id,
            ...artworkSnap.data(),
          });
        }

        const user = auth.currentUser;

        if (user) {
          const favoriteRef = doc(
            db,
            "users",
            user.uid,
            "favorites",
            id
          );

          const favoriteSnap = await getDoc(favoriteRef);
          setIsFavorite(favoriteSnap.exists());
        }
      } catch (error) {
        console.error("Eser yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtwork();
  }, [id]);

  async function handleFavorite() {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!artwork || !id) {
      return;
    }

    try {
      setFavoriteLoading(true);
      setMessage("");

      const favoriteRef = doc(
        db,
        "users",
        user.uid,
        "favorites",
        id
      );

      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
        setMessage("Eser favorilerden çıkarıldı.");
      } else {
        await setDoc(favoriteRef, {
          artworkId: id,
          title: artwork.title || "",
          image: artwork.image || "",
          category: artwork.category || "",
          price: artwork.price || "",
          artistId: artwork.artistId || "",
          artistName:
            artwork.artistName ||
            artwork.artistEmail ||
            "İsimsiz Sanatçı",
          createdAt: serverTimestamp(),
        });

        setIsFavorite(true);
        setMessage("Eser favorilere eklendi.");
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
      setMessage("Favori işlemi sırasında hata oluştu.");
    } finally {
      setFavoriteLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        Yükleniyor...
      </main>
    );
  }

  if (!artwork) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        Eser bulunamadı.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 shadow-xl md:grid-cols-2">
        <div>
          <img
            src={
              artwork.image ||
              "/images/artworks/artwork-1.jpg.jpg"
            }
            alt={artwork.title || "Korİz eseri"}
            className="h-[520px] w-full rounded-3xl object-cover"
          />
        </div>

        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
            {artwork.category || "Kategorisiz"}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            {artwork.title || "İsimsiz Eser"}
          </h1>

          <p className="mt-3 text-gray-600">
            Sanatçı:{" "}
            <span className="font-bold">
              {artwork.artistName ||
                artwork.artistEmail ||
                "İsimsiz Sanatçı"}
            </span>
          </p>

          {message && (
            <div className="mt-5 rounded-2xl bg-[#f6efe3] p-4 text-sm font-bold text-[#c46a2b]">
              {message}
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">⭐ Yeni</p>
              <p className="text-xs text-gray-500">Puan</p>
            </div>

            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">
                ❤️ {artwork.likes || 0}
              </p>
              <p className="text-xs text-gray-500">Beğeni</p>
            </div>

            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">
                👁️ {artwork.views || 0}
              </p>
              <p className="text-xs text-gray-500">
                Görüntülenme
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-3xl bg-[#f6efe3] p-5">
            <p>
              <strong>Ahşap Türü:</strong>{" "}
              {artwork.woodType || "Belirtilmedi"}
            </p>

            <p>
              <strong>Teknik:</strong> El yakma / Pyrography
            </p>

            <p>
              <strong>Ölçü:</strong>{" "}
              {artwork.size || "Belirtilmedi"}
            </p>

            <p>
              <strong>Teslimat:</strong> 3-5 iş günü
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-extrabold">
              Eserin Hikâyesi
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {artwork.story || "Bu eser için henüz hikâye eklenmedi."}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-3xl font-extrabold text-[#c46a2b]">
              {artwork.price || 0} TL
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleFavorite}
                disabled={favoriteLoading}
                className={`rounded-full border px-5 py-3 font-bold transition disabled:opacity-60 ${
                  isFavorite
                    ? "border-[#c46a2b] bg-[#c46a2b] text-white"
                    : "border-[#c46a2b] text-[#c46a2b] hover:bg-[#f6efe3]"
                }`}
              >
                {favoriteLoading
                  ? "İşleniyor..."
                  : isFavorite
                    ? "❤️ Favoriden Çıkar"
                    : "🤍 Favoriye Ekle"}
              </button>

              <Link
  href={`/checkout/${artwork.id}`}
  className="rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
>
  Satın Al
</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}