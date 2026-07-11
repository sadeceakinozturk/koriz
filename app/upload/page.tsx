"use client";

import { ChangeEvent, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

type CloudinaryResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Portre");
  const [woodType, setWoodType] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [story, setStory] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setMessage("");
    setIsError(false);

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageFile(null);
      setImagePreview("");
      setMessage(
        "Yalnızca JPG, JPEG, PNG veya WebP formatında fotoğraf seçebilirsin."
      );
      setIsError(true);
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageFile(null);
      setImagePreview("");
      setMessage("Fotoğraf boyutu en fazla 5 MB olabilir.");
      setIsError(true);
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    setMessage("");
    setIsError(false);

    if (!title.trim()) {
      setMessage("Lütfen eser adını gir.");
      setIsError(true);
      return;
    }

    if (!woodType.trim()) {
      setMessage("Lütfen ahşap türünü gir.");
      setIsError(true);
      return;
    }

    if (!size.trim()) {
      setMessage("Lütfen eser ölçüsünü gir.");
      setIsError(true);
      return;
    }

    if (!price.trim()) {
      setMessage("Lütfen fiyat bilgisini gir.");
      setIsError(true);
      return;
    }

    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      setMessage("Lütfen geçerli bir fiyat gir.");
      setIsError(true);
      return;
    }

    if (!imageFile) {
      setMessage("Lütfen bir eser fotoğrafı seç.");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);

      /*
       * Kullanıcının adını Firestore'daki users belgesinden alıyoruz.
       */
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const artistName = userSnap.exists()
        ? userSnap.data().name || "İsimsiz Sanatçı"
        : "İsimsiz Sanatçı";

      /*
       * Fotoğrafı Cloudinary'ye yüklüyoruz.
       */
      const formData = new FormData();

      formData.append("file", imageFile);
      formData.append("upload_preset", "koriz_upload");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/vmufpwpx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const imageData =
        (await response.json()) as CloudinaryResponse;

      if (!response.ok || !imageData.secure_url) {
        throw new Error(
          imageData.error?.message ||
            "Fotoğraf Cloudinary'ye yüklenemedi."
        );
      }

      const imageUrl = imageData.secure_url;

      /*
       * Eser bilgilerini Firestore'a kaydediyoruz.
       */
      await addDoc(collection(db, "artworks"), {
        title: title.trim(),
        category,
        woodType: woodType.trim(),
        size: size.trim(),
        price: price.trim(),
        story: story.trim(),

        artistId: user.uid,
        artistEmail: user.email || "",
        artistName,

        image: imageUrl,
        imagePublicId: imageData.public_id || "",

        likes: 0,
        views: 0,
        createdAt: serverTimestamp(),
      });

      setMessage("Eser ve fotoğraf başarıyla yayınlandı.");
      setIsError(false);

      /*
       * Formu temizliyoruz.
       */
      setTitle("");
      setCategory("Portre");
      setWoodType("");
      setSize("");
      setPrice("");
      setStory("");
      setImageFile(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      console.error("Eser kaydetme hatası:", error);

      setIsError(true);

      if (error instanceof Error) {
        setMessage(`Hata: ${error.message}`);
      } else {
        setMessage(
          "Eser kaydedilirken bilinmeyen bir hata oluştu."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Yeni Eser
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          Eser Yükle
        </h1>

        <p className="mt-3 text-gray-600">
          Ahşap yakma çalışmanı Korİz’de sergilemek için
          bilgileri doldur.
        </p>

        {message && (
          <div
            className={`mt-5 rounded-2xl p-4 text-sm font-bold ${
              isError
                ? "bg-red-50 text-red-600"
                : "bg-[#f6efe3] text-[#c46a2b]"
            }`}
          >
            {message}
          </div>
        )}

        <form
          className="mt-8 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleUpload();
          }}
        >
          <div>
            <label
              htmlFor="artwork-image"
              className="text-sm font-bold"
            >
              Eser Fotoğrafı
            </label>

            <input
              ref={fileInputRef}
              id="artwork-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-gray-500">
              JPG, JPEG, PNG veya WebP yükleyebilirsin. En
              fazla 5 MB.
            </p>

            {imageFile && (
              <p className="mt-2 text-sm font-semibold text-green-600">
                ✔ {imageFile.name}
              </p>
            )}

            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-3xl border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Seçilen eser önizlemesi"
                  className="h-80 w-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="text-sm font-bold"
            >
              Eser Adı
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              placeholder="Örn: Ceviz Ağacına Portre"
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="text-sm font-bold"
              >
                Kategori
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={loading}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
              >
                <option value="Portre">Portre</option>
                <option value="Hat Sanatı">Hat Sanatı</option>
                <option value="Manzara">Manzara</option>
                <option value="Dekor">Dekor</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="woodType"
                className="text-sm font-bold"
              >
                Ahşap Türü
              </label>

              <input
                id="woodType"
                value={woodType}
                onChange={(event) =>
                  setWoodType(event.target.value)
                }
                type="text"
                placeholder="Ceviz, çam, zeytin..."
                disabled={loading}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="size"
                className="text-sm font-bold"
              >
                Ölçü
              </label>

              <input
                id="size"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                type="text"
                placeholder="40 x 60 cm"
                disabled={loading}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="text-sm font-bold"
              >
                Fiyat
              </label>

              <input
                id="price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="1"
                placeholder="2500"
                disabled={loading}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="story"
              className="text-sm font-bold"
            >
              Eser Hikâyesi
            </label>

            <textarea
              id="story"
              rows={6}
              value={story}
              onChange={(event) => setStory(event.target.value)}
              placeholder="Bu eser nasıl ortaya çıktı?"
              disabled={loading}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b] disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-[#2b1a12] px-8 py-4 font-bold text-white hover:bg-[#c46a2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Fotoğraf ve eser yayınlanıyor..."
              : "Eseri Yayınla"}
          </button>
        </form>
      </section>
    </main>
  );
}