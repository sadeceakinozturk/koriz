const products = [
  {
    title: "Ceviz Ağacına Portre",
    artist: "Akın Öztürk",
    category: "Portre",
    price: "2.500 TL",
    likes: 128,
    image: "/images/artworks/artwork-1.jpg.jpg",
  },
  {
    title: "Kurt Motifli Ahşap Tablo",
    artist: "Elif Kaya",
    category: "Manzara",
    price: "1.800 TL",
    likes: 96,
    image: "/images/artworks/artwork-2.jpg.jpg",
  },
  {
    title: "Osmanlı Hat Eseri",
    artist: "Mehmet Usta",
    category: "Hat Sanatı",
    price: "3.200 TL",
    likes: 154,
    image: "/images/artworks/artwork-3.jpg.jpg",
  },
];

export default function LatestProducts() {
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
              key={product.title}
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
                    ❤️ {product.likes}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-[#2b1a12]">
                  {product.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">{product.artist}</p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-extrabold text-[#c46a2b]">
                    {product.price}
                  </p>

                  <button className="rounded-full bg-[#2b1a12] px-5 py-2 text-sm font-bold text-white hover:bg-[#c46a2b]">
                    İncele
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}