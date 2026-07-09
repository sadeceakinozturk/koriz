"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function ArtworkDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getArtwork() {
      if (!id) return;

      const artworkRef = doc(db, "artworks", id);
      const artworkSnap = await getDoc(artworkRef);

      if (artworkSnap.exists()) {
        setArtwork({
          id: artworkSnap.id,
          ...artworkSnap.data(),
        });
      }

      setLoading(false);
    }

    getArtwork();
  }, [id]);

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
            src={artwork.image}
            alt={artwork.title}
            className="h-[520px] w-full rounded-3xl object-cover"
          />
        </div>

        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
            {artwork.category}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">{artwork.title}</h1>

          <p className="mt-3 text-gray-600">
            Sanatçı: <span className="font-bold">{artwork.artistEmail}</span>
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">⭐ Yeni</p>
              <p className="text-xs text-gray-500">Puan</p>
            </div>

            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">❤️ {artwork.likes || 0}</p>
              <p className="text-xs text-gray-500">Beğeni</p>
            </div>

            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">👁️ {artwork.views || 0}</p>
              <p className="text-xs text-gray-500">Görüntülenme</p>
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-3xl bg-[#f6efe3] p-5">
            <p>
              <strong>Ahşap Türü:</strong> {artwork.woodType}
            </p>
            <p>
              <strong>Teknik:</strong> El yakma / Pyrography
            </p>
            <p>
              <strong>Ölçü:</strong> {artwork.size}
            </p>
            <p>
              <strong>Teslimat:</strong> 3-5 iş günü
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-extrabold">Eserin Hikâyesi</h2>
            <p className="mt-3 leading-7 text-gray-600">{artwork.story}</p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-3xl font-extrabold text-[#c46a2b]">
              {artwork.price} TL
            </p>

            <div className="flex gap-3">
              <button className="rounded-full border border-[#c46a2b] px-5 py-3 font-bold text-[#c46a2b] hover:bg-[#f6efe3]">
                Favori
              </button>

              <button className="rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]">
                Satın Al
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}