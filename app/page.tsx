import LatestProducts from "./components/LatestProducts";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedArtists from "./components/FeaturedArtists";
import Story from "./components/Story";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6efe3] text-[#2b1a12]">
      <Header />
      <Hero />
      <Categories />
      <FeaturedArtists />
      <LatestProducts />
      <Story />
    </main>
  );
}