export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-16 text-[#2b1a12]">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold">
          Giriş Yap
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Korİz hesabınla giriş yap.
        </p>

        <form className="mt-8 space-y-5">

          <div>
            <label className="text-sm font-bold">
              E-posta
            </label>

            <input
              type="email"
              placeholder="ornek@mail.com"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">
              Şifre
            </label>

            <input
              type="password"
              placeholder="********"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c46a2b]"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-[#2b1a12] py-4 font-bold text-white hover:bg-[#c46a2b]"
          >
            Giriş Yap
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Hesabın yok mu?{" "}
          <a href="/register" className="font-bold text-[#c46a2b]">
            Ücretsiz Kayıt Ol
          </a>
        </p>

      </div>
    </main>
  );
}