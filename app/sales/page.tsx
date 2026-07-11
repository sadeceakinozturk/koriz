"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
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

  buyerId?: string;
  buyerEmail?: string;

  customerName?: string;
  phone?: string;
  city?: string;
  district?: string;
  address?: string;
  orderNote?: string;

  status?: string;
  paymentStatus?: string;

  createdAt?: {
    seconds?: number;
  };
};

const statusOptions = [
  {
    value: "pending",
    label: "Onay Bekliyor",
  },
  {
    value: "approved",
    label: "Onaylandı",
  },
  {
    value: "preparing",
    label: "Hazırlanıyor",
  },
  {
    value: "shipped",
    label: "Kargoya Verildi",
  },
  {
    value: "completed",
    label: "Tamamlandı",
  },
  {
    value: "cancelled",
    label: "İptal Edildi",
  },
];

function getStatusLabel(status?: string) {
  return (
    statusOptions.find((option) => option.value === status)?.label ||
    "Onay Bekliyor"
  );
}

function getStatusClass(status?: string) {
  switch (status) {
    case "approved":
      return "bg-blue-50 text-blue-700";

    case "preparing":
      return "bg-yellow-50 text-yellow-700";

    case "shipped":
      return "bg-purple-50 text-purple-700";

    case "completed":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    case "pending":
    default:
      return "bg-[#f6efe3] text-[#c46a2b]";
  }
}

export default function SalesPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const salesQuery = query(
          collection(db, "orders"),
          where("sellerId", "==", user.uid)
        );

        const snapshot = await getDocs(salesQuery);

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
      } catch (error) {
        console.error("Satış siparişleri alınamadı:", error);
        setMessage("Siparişler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function updateOrderStatus(
    orderId: string,
    newStatus: string
  ) {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setUpdatingId(orderId);
      setMessage("");

      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      setMessage("Sipariş durumu başarıyla güncellendi.");
    } catch (error) {
      console.error("Sipariş durumu güncellenemedi:", error);
      setMessage(
        "Sipariş durumu güncellenirken bir hata oluştu."
      );
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-center shadow-xl">
          Gelen siparişler yükleniyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <div className="mx-auto max-w-6xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Sanatçı Paneli
        </p>

        <h1 className="mt-3 text-5xl font-extrabold">
          Satışlarım
        </h1>

        <p className="mt-3 text-gray-600">
          Eserlerin için oluşturulan sipariş taleplerini buradan
          yönetebilirsin.
        </p>

        {message && (
          <div className="mt-8 rounded-2xl bg-white p-4 font-bold text-[#c46a2b] shadow-md">
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-extrabold">
              Henüz gelen sipariş yok
            </h2>

            <p className="mt-3 text-gray-600">
              Eserlerinden biri için sipariş oluşturulduğunda burada
              görünecek.
            </p>

            <Link
              href="/profile"
              className="mt-6 inline-block rounded-full bg-[#2b1a12] px-6 py-3 font-bold text-white hover:bg-[#c46a2b]"
            >
              Profilime Dön
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <div className="grid lg:grid-cols-[280px_1fr]">
                  <img
                    src={
                      order.artworkImage ||
                      "/images/artworks/artwork-1.jpg.jpg"
                    }
                    alt={order.artworkTitle || "Sipariş edilen eser"}
                    className="h-72 w-full object-cover lg:h-full"
                  />

                  <div className="p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold uppercase tracking-[0.2em] text-[#c46a2b]">
                          Gelen Sipariş
                        </p>

                        <h2 className="mt-2 text-3xl font-extrabold">
                          {order.artworkTitle || "İsimsiz Eser"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                          Alıcı:{" "}
                          <span className="font-bold">
                            {order.customerName ||
                              order.buyerEmail ||
                              "İsimsiz Kullanıcı"}
                          </span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-extrabold text-[#c46a2b]">
                          {order.price || 0} TL
                        </p>

                        <span
                          className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-[#f6efe3] p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          İletişim
                        </p>

                        <p className="mt-3">
                          <strong>Ad Soyad:</strong>{" "}
                          {order.customerName || "Belirtilmedi"}
                        </p>

                        <p className="mt-2">
                          <strong>E-posta:</strong>{" "}
                          {order.buyerEmail || "Belirtilmedi"}
                        </p>

                        <p className="mt-2">
                          <strong>Telefon:</strong>{" "}
                          {order.phone || "Belirtilmedi"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f6efe3] p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Teslimat Adresi
                        </p>

                        <p className="mt-3">
                          <strong>Şehir:</strong>{" "}
                          {order.city || "Belirtilmedi"}
                        </p>

                        <p className="mt-2">
                          <strong>İlçe:</strong>{" "}
                          {order.district || "Belirtilmedi"}
                        </p>

                        <p className="mt-2 leading-6">
                          <strong>Adres:</strong>{" "}
                          {order.address || "Belirtilmedi"}
                        </p>
                      </div>
                    </div>

                    {order.orderNote && (
                      <div className="mt-4 rounded-2xl border border-[#c46a2b] p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#c46a2b]">
                          Sipariş Notu
                        </p>

                        <p className="mt-3 leading-7">
                          {order.orderNote}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <label
                          htmlFor={`status-${order.id}`}
                          className="text-sm font-bold"
                        >
                          Sipariş Durumunu Değiştir
                        </label>

                        <select
                          id={`status-${order.id}`}
                          value={order.status || "pending"}
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value
                            )
                          }
                          disabled={updatingId === order.id}
                          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
                        >
                          {statusOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/artwork/${order.artworkId}`}
                          className="rounded-full border border-[#c46a2b] px-5 py-3 text-center text-sm font-bold text-[#c46a2b] hover:bg-[#f6efe3]"
                        >
                          Eseri Gör
                        </Link>

                        <Link
                          href="/profile"
                          className="rounded-full bg-[#2b1a12] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#c46a2b]"
                        >
                          Profilime Dön
                        </Link>
                      </div>
                    </div>

                    {updatingId === order.id && (
                      <p className="mt-3 text-sm font-bold text-[#c46a2b]">
                        Sipariş durumu güncelleniyor...
                      </p>
                    )}
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