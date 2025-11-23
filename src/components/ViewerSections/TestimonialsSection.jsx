// src/components/ViewerSections/TestimonialsSection.jsx
export default function TestimonialsSection({ data, color = "blue" }) {
  // 1. Thêm prop color vào tham số nhận vào (mặc định là blue)
  
  const items = [
    { text: data.testimonial1, author: data.testimonial1Author },
    { text: data.testimonial2, author: data.testimonial2Author },
  ].filter(t => t.text);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* 2. Cập nhật class màu cho Tiêu đề: Dùng text-{color}-700 thay vì mặc định */}
        <h2 className={`text-4xl font-bold mb-12 text-${color}-700`}>
          {data.title || "Khách Hàng Nói Gì"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((t, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-xl italic text-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-lg mb-4">"{t.text}"</p>
              
              {/* 3. Cập nhật class màu cho Tác giả: Dùng text-{color}-600 */}
              <p className={`font-bold text-${color}-600`}>
                - {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}