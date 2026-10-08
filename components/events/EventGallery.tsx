import React from "react";
import Image from "next/image";
import { EventData } from "@/constants/events";

interface EventGalleryProps {
  event: EventData;
}

export default function EventGallery({ event }: EventGalleryProps) {
  const images =
    event.galleryImages && event.galleryImages.length >= 4
      ? event.galleryImages.slice(0, 4)
      : [
          "/images/home/hero/hero-1.jpg",
          "/images/home/hero/hero-1.jpg",
          "/images/home/hero/hero-1.jpg",
          "/images/home/hero/hero-1.jpg",
        ];

  return (
    <section className="w-full text-neutral-900 font-sans pb-14 sm:pb-20 md:pb-24 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="flex flex-col gap-8 sm:gap-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-secondary leading-[1.08]">
          Event Gallery
        </h2>

        {/* 2x2 Grid of Images */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {images.map((imgSrc, index) => (
            <div
              key={index}
              className="w-full relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-neutral-100 group"
            >
              <Image
                src={imgSrc}
                alt={`${event.title} gallery image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
