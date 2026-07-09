"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function LatestProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function getArtworks() {
      const artworksQuery = query(
        collection(db, "artworks"),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const snapshot = await getDocs(artworksQuery);

      const artworks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(artworks);
    }

    getArtworks();
  }, []);

  return (
    <section className="bg-[#f6efe3] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
              Yeni Eserler
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-[#2b1a12]">
              Ateşin Ahşapta Bıraktığı Son İzler
            </h2>
          </div>

          <button className="rounded-full border border-[#c46a2b] px-6 py-3 font-bold text-[#c46a2b] hover:bg-[#c46a2b] hover:text-white">
            Tüm Eserler
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#f6efe3] px-4 py-1 text-xs font-bold text-[#c46a2b]">
                    {product.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    ❤️ {product.likes || 0}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-[#2b1a12]">
                  {product.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {product.artistEmail}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-extrabold text-[#c46a2b]">
                    {product.price} TL
                  </p>

<Link
  href={`/artwork/${product.id}`}
  className="rounded-full bg-[#2b1a12] px-5 py-2 text-sm font-bold text-white hover:bg-[#c46a2b]"
>
  İncele
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}