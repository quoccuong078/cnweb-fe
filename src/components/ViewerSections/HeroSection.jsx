// src/components/ViewerSections/HeroSection.jsx
export default function HeroSection({ data, color = "blue" }) {
  return (
    <section className={`relative bg-${color}-600 text-white py-24 text-center overflow-hidden`}>
      {data.backgroundImage && (
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
          {data.title || "Chào mừng bạn"}
        </h1>
        <p className="text-xl lg:text-2xl mb-10 opacity-90">
          {data.subtitle || "Giải pháp tốt nhất cho doanh nghiệp"}
        </p>
        {data.buttonText && (
          <a
            href="#contact"
            className="inline-block bg-white text-gray-800 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-lg"
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}