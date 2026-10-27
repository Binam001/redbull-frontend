import Image from "next/image";
import React from "react";

interface ImageDivider1Props {
  image1?: string;
  image2?: string;
  alt1?: string;
  alt2?: string;
  className?: string;
}

const ImageDivider1: React.FC<ImageDivider1Props> = ({
  image1 = "/images/product/gold-can-ad-6.webp",
  image2 = "/images/product/gold-can-ad-5.webp",
  alt1 = "Carbonated Can Visual 1",
  alt2 = "Carbonated Can Visual 2",
  className = "",
}) => {
  return (
    <div className={`h-svh w-full relative overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 w-full h-full">
        {/* Image 1: Black Background with padding around image */}
        <div className="relative w-full h-full bg-white p-4 sm:p-6 lg:p-10 xl:p-14 flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={image1}
              alt={alt1}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Image 2: White Background with padding around image */}
        <div className="relative w-full h-full bg-secondary p-4 sm:p-6 lg:p-10 xl:p-14 flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={image2}
              alt={alt2}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDivider1;
