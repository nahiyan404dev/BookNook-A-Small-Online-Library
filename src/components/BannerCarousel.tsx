"use client";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const banners = [
  { src: "/banners/banner-1.jpg", alt: "The Lord of the Rings banner" },
  { src: "/banners/banner-2.jpg", alt: "The Lord of the Rings book set" },
  { src: "/banners/banner-3.jpg", alt: "BookNook miniature bookshop" },
  { src: "/banners/banner-4.jpg", alt: "BookNook banner" },
];

export default function BannerCarousel() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
      ]}
      className="w-full"
    >
      <CarouselContent className="ml-0">
        {banners.map((banner) => (
          <CarouselItem key={banner.src} className="pl-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1] md:aspect-[2.8/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.src}
                alt={banner.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-3 border-[#EAE7F2] bg-white/80 text-[#5426B8] hover:bg-[#5426B8] hover:text-white" />
      <CarouselNext className="right-3 border-[#EAE7F2] bg-white/80 text-[#5426B8] hover:bg-[#5426B8] hover:text-white" />
    </Carousel>
  );
}
