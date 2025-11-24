// src/components/ViewerSections/ServicesSection.jsx
export default function ServicesSection({ data, color = "blue" }) {
  // Sửa: Map dữ liệu đầy đủ thay vì chỉ lấy mảng string
  const services = [
    { title: data.service1, desc: data.service1Desc, image: data.service1Image },
    { title: data.service2, desc: data.service2Desc, image: data.service2Image },
    { title: data.service3, desc: data.service3Desc, image: data.service3Image },
  ].filter(s => s.title); // Chỉ lấy những dịch vụ có tên

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className={`text-4xl font-bold text-${color}-700 mb-12`}>
          {data.title || "Dịch Vụ"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div key={i} className={`p-8 border rounded-xl hover:border-${color}-500 transition flex flex-col items-center`}>
              {/* LOGIC HIỂN THỊ ẢNH */}
              {s.image && (
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="w-24 h-24 object-contain mb-6"
                />
              )}
              
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              {s.desc && <p className="text-gray-600 text-sm">{s.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}