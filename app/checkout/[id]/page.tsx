"use client";

import { FormEvent, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

type Artwork = {
  id: string;
  title?: string;
  image?: string;
  price?: string | number;
  category?: string;
  artistId?: string;
  artistName?: string;
  artistEmail?: string;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const artworkId = params.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [buyerId, setBuyerId] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setBuyerId(user.uid);
      setBuyerEmail(user.email || "");

      try {
        /*
         * Kullanıcı profil bilgilerini alıyoruz.
         */
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          setFullName(userData.name || "");
          setCity(userData.city || "");
        }

        /*
         * Satın alınacak eser bilgilerini alıyoruz.
         */
        const artworkRef = doc(db, "artworks", artworkId);
        const artworkSnap = await getDoc(artworkRef);

        if (!artworkSnap.exists()) {
          setMessage("Satın almak istediğiniz eser bulunamadı.");
          setIsError(true);
          return;
        }

        const artworkData = artworkSnap.data();

        setArtwork({
          id: artworkSnap.id,
          ...artworkData,
        });

        if (artworkData.artistId === user.uid) {
          setMessage("Kendi eserin için sipariş oluşturamazsın.");
          setIsError(true);
        }
      } catch (error) {
        console.error("Sipariş sayfası yükleme hatası:", error);
        setMessage("Sipariş bilgileri yüklenirken hata oluştu.");
        setIsError(true);
      } finally {
        setPageLoading(false);
      }
    });

    return () => unsubscribe();
  }, [artworkId, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const user = auth.currentUser;

    setMessage("");
    setIsError(false);

    if (!user) {
      router.push("/login");
      return;
    }

    if (!artwork) {
      setMessage("Eser bilgisi bulunamadı.");
      setIsError(true);
      return;
    }

    if (artwork.artistId === user.uid) {
      setMessage("Kendi eserin için sipariş oluşturamazsın.");
      setIsError(true);
      return;
    }

    if (!fullName.trim()) {
      setMessage("Lütfen ad ve soyadını gir.");
      setIsError(true);
      return;
    }

    if (!phone.trim()) {
      setMessage("Lütfen telefon numaranı gir.");
      setIsError(true);
      return;
    }

    if (!city.trim()) {
      setMessage("Lütfen şehir bilgisini gir.");
      setIsError(true);
      return;
    }

    if (!district.trim()) {
      setMessage("Lütfen ilçe bilgisini gir.");
      setIsError(true);
      return;
    }

    if (!address.trim()) {
      setMessage("Lütfen açık adresini gir.");
      setIsError(true);
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "orders"), {
        artworkId: artwork.id,
        artworkTitle: artwork.title || "İsimsiz Eser",
        artworkImage: artwork.image || "",
        category: artwork.category || "",
        price: artwork.price || 0,

        buyerId: user.uid,
        buyerEmail: user.email || buyerEmail,

        sellerId: artwork.artistId || "",
        sellerName:
          artwork.artistName ||
          artwork.artistEmail ||
          "İsimsiz Sanatçı",
        sellerEmail: artwork.artistEmail || "",

        customerName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        district: district.trim(),
        address: address.trim(),
        orderNote: orderNote.trim(),

        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: "not-selected",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMessage("Sipariş talebin başarıyla oluşturuldu.");
      setIsError(false);

      setTimeout(() => {
        router.push("/orders");
      }, 1200);
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);

      setMessage("Sipariş oluşturulurken bir hata meydana geldi.");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-xl">
          Sipariş bilgileri yükleniyor...
        </div>
      </main>
    );
  }

  if (!artwork) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-extrabold">
            Eser bulunamadı
          </h1>

          <button
            type="button"
            onClick={() => router.push("/artworks")}
            className="mt-6 rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
          >
            Eserlere Dön
          </button>
        </div>
      </main>
    );
  }

  const ownArtwork =
    artwork.artistId === auth.currentUser?.uid;

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit overflow-hidden rounded-3xl bg-white shadow-xl">
          <img
            src={
              artwork.image ||
              "/images/artworks/artwork-1.jpg.jpg"
            }
            alt={artwork.title || "Korİz eseri"}
            className="h-80 w-full object-cover"
          />

          <div className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c46a2b]">
              Sipariş Özeti
            </p>

            <h1 className="mt-3 text-3xl font-extrabold">
              {artwork.title || "İsimsiz Eser"}
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Sanatçı:{" "}
              <span className="font-bold">
                {artwork.artistName ||
                  artwork.artistEmail ||
                  "İsimsiz Sanatçı"}
              </span>
            </p>

            <div className="mt-6 rounded-2xl bg-[#f6efe3] p-5">
              <p className="text-sm text-gray-600">
                Eser fiyatı
              </p>

              <p className="mt-1 text-3xl font-extrabold text-[#c46a2b]">
                {artwork.price || 0} TL
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Bu aşamada ödeme alınmaz. Sipariş talebin
              sanatçıya iletilir. Ödeme sistemi daha sonra
              eklenecektir.
            </p>
          </div>
        </aside>

        <section className="rounded-3xl bg-white p-8 shadow-xl">
          <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
            Teslimat Bilgileri
          </p>

          <h2 className="mt-3 text-4xl font-extrabold">
            Sipariş Oluştur
          </h2>

          <p className="mt-3 text-gray-600">
            Eserin sana ulaştırılabilmesi için bilgileri
            eksiksiz doldur.
          </p>

          {message && (
            <div
              className={`mt-6 rounded-2xl p-4 text-sm font-bold ${
                isError
                  ? "bg-red-50 text-red-600"
                  : "bg-[#f6efe3] text-[#c46a2b]"
              }`}
            >
              {message}
            </div>
          )}

          {!ownArtwork && (
            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="text-sm font-bold"
                >
                  Ad Soyad
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="Adınız ve soyadınız"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-bold"
                >
                  Telefon
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="05xx xxx xx xx"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="text-sm font-bold"
                  >
                    Şehir
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    disabled={submitting}
                    placeholder="Ankara"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="district"
                    className="text-sm font-bold"
                  >
                    İlçe
                  </label>

                  <input
                    id="district"
                    type="text"
                    value={district}
                    onChange={(event) =>
                      setDistrict(event.target.value)
                    }
                    disabled={submitting}
                    placeholder="Çankaya"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="text-sm font-bold"
                >
                  Açık Adres
                </label>

                <textarea
                  id="address"
                  rows={4}
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="Mahalle, cadde, sokak, bina ve daire bilgileri..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="orderNote"
                  className="text-sm font-bold"
                >
                  Sipariş Notu
                </label>

                <textarea
                  id="orderNote"
                  rows={4}
                  value={orderNote}
                  onChange={(event) =>
                    setOrderNote(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="Sanatçıya iletmek istediğin not..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                />
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/artwork/${artwork.id}`)
                  }
                  disabled={submitting}
                  className="flex-1 rounded-full border border-[#c46a2b] px-6 py-4 font-bold text-[#c46a2b] hover:bg-[#f6efe3] disabled:opacity-60"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-[#2b1a12] px-6 py-4 font-bold text-white hover:bg-[#c46a2b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Sipariş oluşturuluyor..."
                    : "Sipariş Talebi Oluştur"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}