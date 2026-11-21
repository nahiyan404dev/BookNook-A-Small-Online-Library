
import BannerCarousel from "@/components/BannerCarousel";
import DiscoverSection from "@/components/home/DiscoverSection";
import AllBooksPage from "./allbooks/page";
 

export default function Home() {
  return (
    <>
      <main>
        <section className="px-4 pt-6 md:px-6">
          <BannerCarousel />
           
            <DiscoverSection />
           
          <AllBooksPage/>
        </section>
        
      </main>
      
    </>
  );
}
