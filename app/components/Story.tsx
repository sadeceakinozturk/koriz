export default function Story() {
  return (
    <section className="bg-[#2b1a12] px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-[#f0a04b]">
            Eser Hikâyeleri
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Her Eserin Ateşle Yazılmış Bir Hikâyesi Var
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#f7e6d2]">
            Korİz’de her ürün yalnızca bir obje değildir. Kullanılan ahşabın
            dokusu, sanatçının sabrı ve ateşin bıraktığı izler birlikte benzersiz
            bir hikâye oluşturur.
          </p>

          <button className="mt-8 rounded-full bg-[#f0a04b] px-8 py-4 font-bold text-[#2b1a12] hover:bg-white">
            Hikâyeleri Oku
          </button>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#7b3f22] to-[#f0a04b] p-8 shadow-2xl">
          <blockquote className="text-2xl font-bold leading-relaxed">
            “Ateş yalnızca ahşabı yakmaz; ustanın emeğini, sabrını ve ruhunu da
            eserin içine işler.”
          </blockquote>

          <p className="mt-6 text-sm text-[#f7e6d2]">
            Korİz Manifestosu
          </p>
        </div>
      </div>
    </section>
  );
}