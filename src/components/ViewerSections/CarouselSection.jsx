// src/components/ViewerSections/CarouselSection.jsx
import { useState } from "react";

export default function CarouselSection({ data, color = "blue" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = data.slides || [];

  if (slides.length === 0) {
    return (
      <section className="py-20 bg-gray-100 text-center">
        <p className="text-gray-500">Chưa có slide nào</p>
      </section>
    );
  }

  const next = () => setCurrentIndex((i) => (i + 1) % slides.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {data.title && (
          <h2 className={`text-4xl font-bold text-center mb-12 text-${color}-700`}>
            {data.title}
          </h2>
        )}

        <div className="relative">
          {/* Slide */}
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div className="relative aspect-video bg-gray-200">
              {slides[currentIndex].image ? (
                <img
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <span className="text-2xl">Click để upload ảnh</span>
                </div>
              )}
              {slides[currentIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <p className="text-white text-xl font-bold text-center">
                    {slides[currentIndex].caption}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nút prev/next */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl transition"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl transition"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {slides.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentIndex ? `bg-${color}-600` : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}