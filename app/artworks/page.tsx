"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

type Artwork = {
  id: string;
  title?: string;
  category?: string;
  artistEmail?: string;
  price?: string | number;
  image?: string;
  likes?: number;
  createdAt?: {
    seconds?: number;
  };
};

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const artworksPerPage = 6;

  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        setError("");

        const artworksQuery = query(
          collection(db, "artworks"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(artworksQuery);

        const data: Artwork[] = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setArtworks(data);
      } catch (err) {
        console.error("Eserler alınamadı:", err);
        setError("Eserler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, sortOption]);

  const filteredArtworks = useMemo(() => {
    const search = searchText.trim().toLocaleLowerCase("tr-TR");

    const filtered = artworks.filter((artwork) => {
      const title = artwork.title?.toLocaleLowerCase("tr-TR") || "";
      const artist = artwork.artistEmail?.toLocaleLowerCase("tr-TR") || "";

      const matchesSearch =
        title.includes(search) || artist.includes(search);

      const matchesCategory =
        selectedCategory === "Tümü" ||
        artwork.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((first, second) => {
      const firstPrice = Number(first.price) || 0;
      const secondPrice = Number(second.price) || 0;

      const firstDate = first.createdAt?.seconds || 0;
      const secondDate = second.createdAt?.seconds || 0;

      switch (sortOption) {
        case "oldest":
          return firstDate - secondDate;

        case "price-low":
          return firstPrice - secondPrice;

        case "price-high":
          return secondPrice - firstPrice;

        case "likes":
          return (second.likes || 0) - (first.likes || 0);

        case "newest":
        default:
          return secondDate - firstDate;
      }
    });
  }, [artworks, searchText, selectedCategory, sortOption]);

  const totalPages = Math.ceil(
    filteredArtworks.length / artworksPerPage
  );

  const startIndex = (currentPage - 1) * artworksPerPage;

  const paginatedArtworks = filteredArtworks.slice(
    startIndex,
    startIndex + artworksPerPage
  );

  const categories = [
    "Tümü",
    "Portre",
    "Hat Sanatı",
    "Manzara",
    "Dekor",
  ];

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
            Galeri
          </p>

          <h1 className="mt-3 text-5xl font-extrabold">
            Tüm Eserler
          </h1>

          <p className="mt-3 text-gray-600">
            Korİz sanatçılarının eserlerini keşfet.
          </p>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-md">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div>
              <label
                htmlFor="artwork-search"
                className="text-sm font-bold"
              >
                Eser ara
              </label>

              <input
                id="artwork-search"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Eser adı veya sanatçı e-postası..."
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>

            <div>
              <label
                htmlFor="artwork-sort"
                className="text-sm font-bold"
              >
                Sırala
              </label>

              <select
                id="artwork-sort"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] lg:min-w-52"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                <option value="likes">En Çok Beğenilen</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                    isSelected
                      ? "border-[#c46a2b] bg-[#c46a2b] text-white"
                      : "border-[#c46a2b] text-[#c46a2b] hover:bg-[#f6efe3]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-600">
            {filteredArtworks.length} eser bulundu
          </p>

          {(searchText || selectedCategory !== "Tümü") && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedCategory("Tümü");
              }}
              className="text-sm font-bold text-[#c46a2b] hover:underline"
            >
              Filtreleri temizle
            </button>
          )}
        </div>

        {loading && (
          <div className="mt-10 rounded-3xl bg-white p-8 text-center shadow-md">
            Eserler yükleniyor...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-3xl bg-red-50 p-8 text-center font-bold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredArtworks.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-8 text-center shadow-md">
            <h2 className="text-2xl font-extrabold">
              Eser bulunamadı
            </h2>

            <p className="mt-2 text-gray-600">
              Arama kelimesini veya kategori seçimini değiştirebilirsin.
            </p>
          </div>
        )}

        {!loading && !error && filteredArtworks.length > 0 && (
          <>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedArtworks.map((artwork) => (
                <article
                  key={artwork.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={
                      artwork.image ||
                      "/images/artworks/artwork-1.jpg.jpg"
                    }
                    alt={artwork.title || "Korİz eseri"}
                    className="h-72 w-full object-cover"
                  />

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#f6efe3] px-4 py-1 text-xs font-bold text-[#c46a2b]">
                        {artwork.category || "Kategorisiz"}
                      </span>

                      <span className="text-sm text-gray-500">
                        ❤️ {artwork.likes || 0}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-extrabold">
                      {artwork.title || "İsimsiz Eser"}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {artwork.artistEmail || "Sanatçı bilgisi yok"}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="text-xl font-extrabold text-[#c46a2b]">
                        {artwork.price || 0} TL
                      </span>

                      <Link
                        href={`/artwork/${artwork.id}`}
                        className="rounded-full bg-[#2b1a12] px-5 py-2 font-bold text-white hover:bg-[#c46a2b]"
                      >
                        İncele
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#c46a2b] px-5 py-2 font-bold text-[#c46a2b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Önceki
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-10 w-10 rounded-full font-bold transition ${
                        currentPage === pageNumber
                          ? "bg-[#c46a2b] text-white"
                          : "border border-[#c46a2b] text-[#c46a2b] hover:bg-[#f6efe3]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-[#c46a2b] px-5 py-2 font-bold text-[#c46a2b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}