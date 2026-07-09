export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-12 text-[#2b1a12]">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Yeni Eser
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">Eser Yükle</h1>

        <p className="mt-3 text-gray-600">
          Ahşap yakma çalışmanı Korİz’de sergilemek için bilgileri doldur.
        </p>

        <form className="mt-8 grid gap-5">
          <div>
            <label className="text-sm font-bold">Eser Fotoğrafı</label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Eser Adı</label>
            <input
              type="text"
              placeholder="Örn: Ceviz Ağacına Portre"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold">Kategori</label>
              <select className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]">
                <option>Portre</option>
                <option>Hat Sanatı</option>
                <option>Manzara</option>
                <option>Dekor</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold">Ahşap Türü</label>
              <input
                type="text"
                placeholder="Ceviz, çam, zeytin..."
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold">Ölçü</label>
              <input
                type="text"
                placeholder="40 x 60 cm"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Fiyat</label>
              <input
                type="text"
                placeholder="2500"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold">Eser Hikâyesi</label>
            <textarea
              rows={6}
              placeholder="Bu eser nasıl ortaya çıktı?"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <button
            type="button"
            className="mt-4 rounded-full bg-[#2b1a12] px-8 py-4 font-bold text-white hover:bg-[#c46a2b]"
          >
            Eseri Yayınla
          </button>
        </form>
      </section>
    </main>
  );
}