"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  artworkId?: string;
  artworkTitle?: string;
  artworkImage?: string;
  price?: string | number;

  sellerName?: string;
  sellerEmail?: string;

  customerName?: string;
  city?: string;
  district?: string;

  status?: string;
  paymentStatus?: string;

  createdAt?: {
    seconds?: number;
  };
};

function getStatusLabel(status?: string) {
  switch (status) {
    case "approved":
      return "Onaylandı";
    case "preparing":
      return "Hazırlanıyor";
    case "shipped":
      return "Kargoya Verildi";
    case "completed":
      return "Tamamlandı";
    case "cancelled":
      return "İptal Edildi";
    case "pending":
    default:
      return "Onay Bekliyor";
  }
}

function getPaymentLabel(paymentStatus?: string) {
  switch (paymentStatus) {
    case "paid":
      return "Ödendi";
    case "cancelled":
      return "İptal";
    case "unpaid":
    default:
      return "Ödeme Alınmadı";
  }
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setMessage("");

       const ordersQuery = query(
  collection(db, "orders"),
  where("buyerId", "==", user.uid)
);

        const snapshot = await getDocs(ordersQuery);

        const data: Order[] = snapshot.docs.map((orderDoc) => ({
  id: orderDoc.id,
  ...orderDoc.data(),
}));

data.sort((first, second) => {
  const firstDate = first.createdAt?.seconds || 0;
  const secondDate = second.createdAt?.seconds || 0;

  return secondDate - firstDate;
});

setOrders(data);

        setOrders(data);
      } catch (error) {
        console.error("Siparişler alınamadı:", error);
        setMessage(
          "Siparişler yüklenemedi. Firestore indeks bağlantısı görünürse oluşturman gerekebilir."
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-center shadow-xl">
          Siparişler yükleniyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <div className="mx-auto max-w-6xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Hesabım
        </p>

        <h1 className="mt-3 text-5xl font-extrabold">
          Siparişlerim
        </h1>

        <p className="mt-3 text-gray-600">
          Oluşturduğun sipariş taleplerini ve durumlarını buradan takip
          edebilirsin.
        </p>

        {message && (
          <div className="mt-8 rounded-3xl bg-red-50 p-6 font-bold text-red-600">
            {message}
          </div>
        )}

        {!message && orders.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold">
              Henüz siparişin yok
            </h2>

            <p className="mt-3 text-gray-600">
              Galerideki eserleri inceleyerek ilk sipariş talebini
              oluşturabilirsin.
            </p>

            <Link
              href="/artworks"
              className="mt-6 inline-block rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
            >
              Eserleri Keşfet
            </Link>
          </div>
        )}

        {!message && orders.length > 0 && (
          <div className="mt-10 grid gap-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="grid overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-[240px_1fr]"
              >
                <img
                  src={
                    order.artworkImage ||
                    "/images/artworks/artwork-1.jpg.jpg"
                  }
                  alt={order.artworkTitle || "Sipariş edilen eser"}
                  className="h-64 w-full object-cover md:h-full"
                />

                <div className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c46a2b]">
                        Sipariş
                      </p>

                      <h2 className="mt-2 text-3xl font-extrabold">
                        {order.artworkTitle || "İsimsiz Eser"}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        Sanatçı:{" "}
                        <span className="font-bold">
                          {order.sellerName ||
                            order.sellerEmail ||
                            "İsimsiz Sanatçı"}
                        </span>
                      </p>
                    </div>

                    <p className="text-2xl font-extrabold text-[#c46a2b]">
                      {order.price || 0} TL
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#f6efe3] p-4">
                      <p className="text-xs font-bold text-gray-500">
                        Sipariş Durumu
                      </p>

                      <p className="mt-1 font-extrabold">
                        {getStatusLabel(order.status)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f6efe3] p-4">
                      <p className="text-xs font-bold text-gray-500">
                        Ödeme Durumu
                      </p>

                      <p className="mt-1 font-extrabold">
                        {getPaymentLabel(order.paymentStatus)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f6efe3] p-4">
                      <p className="text-xs font-bold text-gray-500">
                        Teslimat
                      </p>

                      <p className="mt-1 font-extrabold">
                        {[order.district, order.city]
                          .filter(Boolean)
                          .join(" / ") || "Belirtilmedi"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/artwork/${order.artworkId}`}
                      className="rounded-full bg-[#2b1a12] px-5 py-2 text-sm font-bold text-white hover:bg-[#c46a2b]"
                    >
                      Eseri Gör
                    </Link>

                    <Link
                      href="/artworks"
                      className="rounded-full border border-[#c46a2b] px-5 py-2 text-sm font-bold text-[#c46a2b] hover:bg-[#f6efe3]"
                    >
                      Galeriye Dön
                    </Link>
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