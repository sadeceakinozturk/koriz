const categories = [
  { name: "Portre", icon: "👤", desc: "Kişiye özel portre çalışmaları" },
  { name: "Hat Sanatı", icon: "✒️", desc: "Ahşap üzerine yazı ve hat eserleri" },
  { name: "Manzara", icon: "🌄", desc: "Doğa ve şehir temalı çalışmalar" },
  { name: "Dekor", icon: "🪵", desc: "Ev ve ofis için dekoratif ürünler" },
];

export default function Categories() {
  return (
    <section className="bg-[#f6efe3] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-bold uppercase tracking-[0.25em] text-[#c46a2b]">
          Kategoriler
        </p>

        <h2 className="mt-3 text-4xl font-extrabold text-[#2b1a12]">
          Ahşabın Ateşle Buluştuğu Alanlar
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-3xl bg-white p-7 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-4xl">{category.icon}</div>
              <h3 className="mt-5 text-xl font-bold text-[#2b1a12]">
                {category.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {category.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}