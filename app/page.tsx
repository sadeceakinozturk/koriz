import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6efe3] text-[#2b1a12]">
      <Header />
      <Hero />
      <Categories />
    </main>
  );
}