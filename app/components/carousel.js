// components/Carousel.js
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Optional (for navigation arrows)
import "swiper/css/pagination"; // Optional (for pagination dots)
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "../globals.css"

export default function Carousel() {
  // Updated slides with new images
  const slides = [
    "/images/Product_carousel1.png",
    "/images/Product_carousel2.png",
    "/images/Product_carousel3.png",
    "/images/Product_carousel4.png",
  ];

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full"
        style={{ width: "100%" }}
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-contain"
            />
          </SwiperSlide>
        ))}
        {/* Custom navigation buttons */}
        <div className="swiper-button-prev" style={{ left: "10px", color: "#fff" }}></div>
        <div className="swiper-button-next" style={{ right: "10px", color: "#fff" }}></div>
      </Swiper>
    </div>
  );
}
