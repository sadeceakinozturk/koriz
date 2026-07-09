"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const works = [
  {
    title: "Ceviz Ağacına Portre",
    image: "/images/artworks/artwork-1.jpg.jpg",
    likes: 128,
  },
  {
    title: "Kurt Motifli Tablo",
    image: "/images/artworks/artwork-2.jpg.jpg",
    likes: 96,
  },
  {
    title: "Osmanlı Hat Eseri",
    image: "/images/artworks/artwork-3.jpg.jpg",
    likes: 154,
  },
];

export default function ProfilePage() {
  const [name, setName] = useState("Yükleniyor...");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "İsimsiz Kullanıcı");
        setEmail(data.email || user.email || "");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#2b1a12] to-[#c46a2b] text-5xl font-extrabold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">{name}</h1>
            <p className="mt-2 font-bold text-[#c46a2b]">{email}</p>
            <p className="mt-3 max-w-3xl leading-7 text-gray-600">
              Korİz üyesi. Bu alan daha sonra kullanıcının biyografisi, şehir
              bilgisi ve uzmanlık alanlarıyla doldurulacak.
            </p>
          </div>

          <button className="rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]">
            Profili Düzenle
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-[#f6efe3] p-5 text-center">
            <p className="text-2xl font-extrabold">0</p>
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
        <h2 className="text-3xl font-extrabold">Sanatçının Eserleri</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {works.map((work) => (
            <div
              key={work.title}
              className="overflow-hidden rounded-3xl bg-white shadow-md"
            >
              <img
                src={work.image}
                alt={work.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-extrabold">{work.title}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  ❤️ {work.likes} beğeni
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}