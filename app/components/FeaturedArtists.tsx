const artists = [
  {
    name: "Akın Öztürk",
    city: "Ankara",
    specialty: "Portre ve özel sipariş çalışmaları",
    works: 24,
    rating: "4.9",
  },
  {
    name: "Elif Kaya",
    city: "İstanbul",
    specialty: "Doğa ve hayvan figürleri",
    works: 18,
    rating: "4.8",
  },
  {
    name: "Mehmet Usta",
    city: "Konya",
    specialty: "Hat sanatı ve dekoratif levhalar",
    works: 31,
    rating: "5.0",
  },
];

export default function FeaturedArtists() {
  return (
    <section className="bg-[#fff8ef] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
              Öne Çıkan Sanatçılar
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-[#2b1a12]">
              Ateşle Ahşaba Ruh Katan Ustalar
            </h2>
          </div>

          <button className="rounded-full border border-[#c46a2b] px-6 py-3 font-bold text-[#c46a2b] hover:bg-[#c46a2b] hover:text-white">
            Tüm Sanatçılar
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="rounded-3xl bg-white p-7 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2b1a12] to-[#c46a2b] text-2xl font-extrabold text-white">
                  {artist.name.charAt(0)}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#2b1a12]">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-500">{artist.city}</p>
                </div>
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                {artist.specialty}
              </p>

              <div className="mt-6 flex justify-between rounded-2xl bg-[#f6efe3] p-4 text-sm">
                <div>
                  <p className="font-extrabold text-[#2b1a12]">{artist.works}</p>
                  <p className="text-gray-500">Eser</p>
                </div>

                <div>
                  <p className="font-extrabold text-[#2b1a12]">⭐ {artist.rating}</p>
                  <p className="text-gray-500">Puan</p>
                </div>
              </div>

              <button className="mt-6 w-full rounded-full bg-[#2b1a12] px-5 py-3 font-bold text-white hover:bg-[#c46a2b]">
                Profili Gör
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}