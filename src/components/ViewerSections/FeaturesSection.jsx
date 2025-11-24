// src/components/ViewerSections/FeaturesSection.jsx
export default function FeaturesSection({ data, color = "blue" }) {
  // Sửa: Lấy thêm trường Icon
  const features = [
    { title: data.feature1, desc: data.feature1Desc, icon: data.feature1Icon },
    { title: data.feature2, desc: data.feature2Desc, icon: data.feature2Icon },
    { title: data.feature3, desc: data.feature3Desc, icon: data.feature3Icon },
  ].filter(f => f.title);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className={`text-4xl font-bold text-center text-${color}-700 mb-12`}>
          {data.title || "Tính Năng Nổi Bật"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition">
              {/* LOGIC HIỂN THỊ ẢNH */}
              <div className={`w-16 h-16 bg-${color}-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden`}>
                {f.icon ? (
                  <img src={f.icon} alt={f.title} className="w-10 h-10 object-contain" />
                ) : (
                  <span className={`text-${color}-600 text-2xl font-bold`}>✓</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}