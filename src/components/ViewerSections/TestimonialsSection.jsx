// src/components/ViewerSections/TestimonialsSection.jsx
export default function TestimonialsSection({ data }) {
  const items = [
    { text: data.testimonial1, author: data.testimonial1Author },
    { text: data.testimonial2, author: data.testimonial2Author },
  ].filter(t => t.text);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">{data.title || "Khách Hàng Nói Gì"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((t, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-xl italic text-gray-700">
              <p className="text-lg mb-4">"{t.text}"</p>
              <p className="font-bold text-gray-900">- {t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}