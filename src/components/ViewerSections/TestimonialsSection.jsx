// src/components/ViewerSections/TestimonialsSection.jsx
export default function TestimonialsSection({ data, color = "blue" }) {
  // Sửa: Thêm testimonial3 và avatar
  const items = [
    { text: data.testimonial1, author: data.testimonial1Author, avatar: data.testimonial1Avatar },
    { text: data.testimonial2, author: data.testimonial2Author, avatar: data.testimonial2Avatar },
    { text: data.testimonial3, author: data.testimonial3Author, avatar: data.testimonial3Avatar },
  ].filter(t => t.text);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className={`text-4xl font-bold mb-12 text-${color}-700`}>
          {data.title || "Khách Hàng Nói Gì"}
        </h2>
        
        {/* Sửa: Grid responsive linh hoạt hơn cho 3 items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center">
              {/* Sửa: Hiển thị Avatar */}
              {t.avatar && (
                <img 
                  src={t.avatar} 
                  alt={t.author} 
                  className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white shadow-sm"
                />
              )}
              
              <p className="text-gray-600 italic mb-4">"{t.text}"</p>
              <p className={`font-bold text-${color}-600`}>- {t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}