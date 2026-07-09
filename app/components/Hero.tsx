export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2b1a12] via-[#5a2f1d] to-[#9d4f17] px-6 py-32 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f0a04b]">
        Ahşap yakma sanatının dijital buluşma noktası
      </p>

      <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
        Ahşaba Ateşle Hayat Ver
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#f7e6d2]">
        Korİz, sanatçıların eserlerini sergilediği, hikâyelerini anlattığı ve sanatseverlerle buluştuğu özel bir platformdur.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <button className="rounded-full bg-[#f0a04b] px-8 py-4 font-bold text-[#2b1a12]">
          Eserleri Keşfet
        </button>

        <button className="rounded-full border border-[#f0a04b] px-8 py-4 font-bold text-[#f0a04b]">
          Sanatçı Ol
        </button>
      </div>
    </section>
  );
}