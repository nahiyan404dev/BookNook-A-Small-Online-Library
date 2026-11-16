import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";

export default function Home() {
  return (
     <main>
      <Navbar/>
      <section className="container mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <BannerCarousel />
      </section>
     </main>
  );
}
