"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

type Work = {
  id: string;
  title?: string;
  image?: string;
  likes?: number;
  price?: string | number;
  category?: string;
};

export default function ProfilePage() {
  const [name, setName] = useState("Yükleniyor...");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setName(data.name || "İsimsiz Kullanıcı");
          setEmail(data.email || user.email || "");
          setCity(data.city || "");
          setSpecialty(data.specialty || "");
          setBio(data.bio || "");
        } else {
          setName("İsimsiz Kullanıcı");
          setEmail(user.email || "");
        }

        const artworksQuery = query(
          collection(db, "artworks"),
          where("artistId", "==", user.uid)
        );

        const artworksSnap = await getDocs(artworksQuery);

        const userWorks: Work[] = artworksSnap.docs.map((artworkDoc) => ({
          id: artworkDoc.id,
          ...artworkDoc.data(),
        }));

        setWorks(userWorks);
      } catch (error) {
        console.error("Profil bilgileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
async function handleDeleteArtwork(workId: string, workTitle: string) {
  const user = auth.currentUser;

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const confirmed = window.confirm(
    `"${workTitle}" isimli eseri silmek istediğine emin misin?\n\nBu işlem geri alınamaz.`
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeletingId(workId);

    const artworkRef = doc(db, "artworks", workId);
    const artworkSnap = await getDoc(artworkRef);

    if (!artworkSnap.exists()) {
      alert("Eser bulunamadı.");

      setWorks((currentWorks) =>
        currentWorks.filter((work) => work.id !== workId)
      );

      return;
    }

    if (artworkSnap.data().artistId !== user.uid) {
      alert("Bu eseri silme yetkiniz yok.");
      return;
    }

    await deleteDoc(artworkRef);

    setWorks((currentWorks) =>
      currentWorks.filter((work) => work.id !== workId)
    );

    alert("Eser başarıyla silindi.");
  } catch (error) {
    console.error("Eser silme hatası:", error);
    alert("Eser silinirken bir hata oluştu.");
  } finally {
    setDeletingId("");
  }
}

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-center shadow-xl">
          Profil yükleniyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2b1a12] to-[#c46a2b] text-5xl font-extrabold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">{name}</h1>

            <p className="mt-2 font-bold text-[#c46a2b]">
              {email}
            </p>

            {city && (
              <p className="mt-2 text-sm font-bold text-gray-700">
                📍 {city}
              </p>
            )}

            {specialty && (
              <p className="mt-2 text-sm font-bold text-[#c46a2b]">
                🎨 {specialty}
              </p>
            )}

            <p className="mt-3 max-w-3xl leading-7 text-gray-600">
              {bio ||
                "Korİz üyesi. Bu kullanıcı henüz biyografi eklemedi."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/favorites"
              className="rounded-full border border-[#c46a2b] px-6 py-3 font-bold text-[#c46a2b] hover:bg-[#f6efe3]"
            >
              Favorilerim
            </Link>

            <Link
              href="/profile/edit"
              className="rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
            >
              Profili Düzenle
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl bg-[#f6efe3] p-5 text-center">
            <p className="text-2xl font-extrabold">{works.length}</p>
            <p className="text-sm text-gray-600">Eser</p>
          </div>

          <div className="rounded-2xl bg-[#f6efe3] p-5 text-center">
            <p className="text-2xl font-extrabold">0</p>
            <p className="text-sm text-gray-600">Takipçi</p>
          </div>

          <div className="rounded-2xl bg-[#f6efe3] p-5 text-center">
            <p className="text-2xl font-extrabold">0</p>
            <p className="text-sm text-gray-600">Takip</p>
          </div>

          <div className="rounded-2xl bg-[#f6efe3] p-5 text-center">
            <p className="text-2xl font-extrabold">Yeni</p>
            <p className="text-sm text-gray-600">Durum</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
              Portföyüm
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Yüklediğim Eserler
            </h2>
          </div>

          <Link
            href="/upload"
            className="rounded-full bg-[#c46a2b] px-6 py-3 text-center font-bold text-white hover:bg-[#9d4f17]"
          >
            Yeni Eser Yükle
          </Link>
        </div>

        {works.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-md">
            <h3 className="text-2xl font-extrabold">
              Henüz eser yüklemedin
            </h3>

            <p className="mt-3 text-gray-600">
              İlk eserini yükleyerek portföyünü oluşturmaya başlayabilirsin.
            </p>

            <Link
              href="/upload"
              className="mt-6 inline-block rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
            >
              Eser Yükle
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <article
                key={work.id}
                className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/artwork/${work.id}`}>
                  <img
                    src={
                      work.image ||
                      "/images/artworks/artwork-1.jpg.jpg"
                    }
                    alt={work.title || "Korİz eseri"}
                    className="h-64 w-full object-cover"
                  />
                </Link>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f6efe3] px-3 py-1 text-xs font-bold text-[#c46a2b]">
                      {work.category || "Kategorisiz"}
                    </span>

                    <span className="text-sm text-gray-500">
                      ❤️ {work.likes || 0}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold">
                    {work.title || "İsimsiz Eser"}
                  </h3>

                  <p className="mt-2 font-bold text-[#c46a2b]">
                    {work.price || 0} TL
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                   <Link
                    href={`/artwork/${work.id}`}
                    className="rounded-full bg-[#2b1a12] px-3 py-2 text-center text-sm font-bold text-white hover:bg-[#c46a2b]"
                   >
                    İncele
                   </Link>

                   <Link
                    href={`/artwork/edit/${work.id}`}
                    className="rounded-full border border-[#c46a2b] px-3 py-2 text-center text-sm font-bold text-[#c46a2b] hover:bg-[#f6efe3]"
                   >
                    Düzenle
                  </Link>

                  <button
                   type="button"
                   onClick={() =>
                    handleDeleteArtwork(
                     work.id,
                     work.title || "İsimsiz Eser"
                    )
                   }
                     disabled={deletingId === work.id}
                     className="rounded-full border border-red-500 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                   {deletingId === work.id ? "Siliniyor..." : "Sil"}
                   </button>
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}