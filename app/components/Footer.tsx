export default function Footer() {
  return (
    <footer className="bg-[#1f120c] px-6 py-14 text-[#f7e6d2]">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            Kor<span className="text-[#f0a04b]">İz</span>
          </h2>
          <p className="mt-4 text-sm leading-7">
            Ahşap yakma sanatını dijital dünyayla buluşturan sanat ve pazar yeri platformu.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Hızlı Menü</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Ana Sayfa</li>
            <li>Sanatçılar</li>
            <li>Eserler</li>
            <li>Hikâyeler</li>
            <li>İletişim</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">Kategoriler</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Portre</li>
            <li>Hat Sanatı</li>
            <li>Manzara</li>
            <li>Dekor</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">İletişim</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Türkiye</li>
            <li>info@koriz.com</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-[#d9b99b]">
        © 2026 Korİz — Tüm Hakları Saklıdır.
      </div>
    </footer>
  );
}