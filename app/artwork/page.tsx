export default function ArtworkDetailPage() {
  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 shadow-xl md:grid-cols-2">
        <div>
          <img
            src="/images/artworks/artwork-1.jpg.jpg"
            alt="Ceviz Ağacına Portre"
            className="h-[520px] w-full rounded-3xl object-cover"
          />
        </div>

        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
            Portre
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Ceviz Ağacına Portre
          </h1>

          <p className="mt-3 text-gray-600">
            Sanatçı: <span className="font-bold">Akın Öztürk</span>
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">⭐ 4.9</p>
              <p className="text-xs text-gray-500">Puan</p>
            </div>

            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">❤️ 128</p>
              <p className="text-xs text-gray-500">Beğeni</p>
            </div>

            <div className="rounded-2xl bg-[#f6efe3] p-4">
              <p className="font-extrabold">👁️ 840</p>
              <p className="text-xs text-gray-500">Görüntülenme</p>
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-3xl bg-[#f6efe3] p-5">
            <p>
              <strong>Ahşap Türü:</strong> Ceviz
            </p>
            <p>
              <strong>Teknik:</strong> El yakma / Pyrography
            </p>
            <p>
              <strong>Ölçü:</strong> 40 x 60 cm
            </p>
            <p>
              <strong>Teslimat:</strong> 3-5 iş günü
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-extrabold">Eserin Hikâyesi</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Bu eser, doğal ceviz ağacının dokusu korunarak işlenmiştir.
              Yaklaşık 18 saatlik sabırlı bir çalışma sonucunda ortaya çıkan
              portre, ateşin ahşap üzerinde bıraktığı izlerle benzersiz bir
              karakter kazanmıştır.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-3xl font-extrabold text-[#c46a2b]">
              2.500 TL
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