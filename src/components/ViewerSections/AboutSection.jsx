// src/components/ViewerSections/AboutSection.jsx
export default function AboutSection({ data, color = "blue" }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className={`text-4xl font-bold text-${color}-700 mb-8`}>
          {data.title || "Về Chúng Tôi"}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          {data.content || "Chúng tôi là đội ngũ chuyên nghiệp..."}
        </p>
      </div>
    </section>
  );
}