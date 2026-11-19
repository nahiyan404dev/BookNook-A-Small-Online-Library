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
  { src: '/banners/banner.jpg', alt: "Library" },
  { src: "/banners/book_01.jpg", alt: "The" },
  { src: "/banners/book_02.jpg", alt: "BookNook miniature bookshop" },
  { src: '/banners/book_03.jpg', alt: "BookNook banner" },
];

export default function BannerCarousel() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
      ]}
      className="w-full"
    >
      {/* Spacing: -ml-4 on the content + pl-4 on each item = 16px gap between slides */}
      <CarouselContent className="-ml-4">
        {banners.map((banner) => (
          <CarouselItem key={banner.src} className="pl-4">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl sm:aspect-[2/1] md:aspect-[2.8/1]">
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
