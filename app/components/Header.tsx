export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#2b1a12] text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide">
            Kor<span className="text-[#f0a04b]">İz</span>
          </h1>
          <p className="text-xs text-gray-300">
            Ahşaba Ateşle Hayat Ver
          </p>
        </div>

        <nav className="hidden gap-8 font-medium md:flex">
          <a href="#" className="hover:text-[#f0a04b]">Ana Sayfa</a>
          <a href="#" className="hover:text-[#f0a04b]">Sanatçılar</a>
          <a href="#" className="hover:text-[#f0a04b]">Eserler</a>
          <a href="#" className="hover:text-[#f0a04b]">Hikâyeler</a>
          <a href="#" className="hover:text-[#f0a04b]">İletişim</a>
        </nav>

        <button className="rounded-full bg-[#c46a2b] px-5 py-2 font-semibold transition hover:bg-[#f0a04b] hover:text-[#2b1a12]">
          Giriş Yap
        </button>
      </div>
    </header>
  );
}