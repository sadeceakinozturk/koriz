"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Favorite = {
  id: string;
  artworkId?: string;
  title?: string;
  image?: string;
  category?: string;
  price?: string | number;
  artistName?: string;
};

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.uid);

      try {
        const favoritesQuery = query(
          collection(db, "users", user.uid, "favorites"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(favoritesQuery);

        const data: Favorite[] = snapshot.docs.map((favoriteDoc) => ({
          id: favoriteDoc.id,
          ...favoriteDoc.data(),
        }));

        setFavorites(data);
      } catch (error) {
        console.error("Favoriler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function removeFavorite(favoriteId: string) {
    if (!userId) return;

    try {
      setRemovingId(favoriteId);

      await deleteDoc(
        doc(db, "users", userId, "favorites", favoriteId)
      );

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (favorite) => favorite.id !== favoriteId
        )
      );
    } catch (error) {
      console.error("Favori silinemedi:", error);
    } finally {
      setRemovingId("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 text-center shadow-md">
          Favoriler yükleniyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <div className="mx-auto max-w-7xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Koleksiyonum
        </p>

        <h1 className="mt-3 text-5xl font-extrabold">
          Favorilerim
        </h1>

        <p className="mt-3 text-gray-600">
          Beğendiğin ve daha sonra incelemek istediğin eserler.
        </p>

        {favorites.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold">
              Henüz favori eserin yok
            </h2>

            <p className="mt-3 text-gray-600">
              Galerideki eserleri inceleyip favorilerine ekleyebilirsin.
            </p>

            <Link
              href="/artworks"
              className="mt-6 inline-block rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
            >
              Eserleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <article
                key={favorite.id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={
                    favorite.image ||
                    "/images/artworks/artwork-1.jpg.jpg"
                  }
                  alt={favorite.title || "Favori eser"}
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">
                  <span className="rounded-full bg-[#f6efe3] px-4 py-1 text-xs font-bold text-[#c46a2b]">
                    {favorite.category || "Kategorisiz"}
                  </span>

                  <h2 className="mt-4 text-2xl font-extrabold">
                    {favorite.title || "İsimsiz Eser"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {favorite.artistName || "İsimsiz Sanatçı"}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-xl font-extrabold text-[#c46a2b]">
                      {favorite.price || 0} TL
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={`/artwork/${
                          favorite.artworkId || favorite.id
                        }`}
                        className="rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-bold text-white hover:bg-[#c46a2b]"
                      >
                        İncele
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeFavorite(favorite.id)}
                        disabled={removingId === favorite.id}
                        className="rounded-full border border-[#c46a2b] px-4 py-2 text-sm font-bold text-[#c46a2b] hover:bg-[#f6efe3] disabled:opacity-50"
                      >
                        {removingId === favorite.id
                          ? "Siliniyor..."
                          : "Kaldır"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}