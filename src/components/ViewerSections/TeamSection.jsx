// src/components/ViewerSections/TeamSection.jsx
export default function TeamSection({ data, color = "blue" }) { // Thêm prop color
  // Sửa: Map đủ trường dữ liệu (image, desc)
  const members = [
    { name: data.member1, role: data.member1Role, image: data.member1Image, desc: data.member1Desc },
    { name: data.member2, role: data.member2Role, image: data.member2Image, desc: data.member2Desc },
    { name: data.member3, role: data.member3Role, image: data.member3Image, desc: data.member3Desc },
  ].filter(m => m.name);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className={`text-4xl font-bold mb-12 text-${color}-700`}>{data.title || "Đội Ngũ"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {members.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              {/* Sửa: Hiển thị ảnh thật */}
              {m.image ? (
                <img 
                  src={m.image} 
                  alt={m.name} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-sm" 
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              
              <h3 className="text-xl font-bold">{m.name}</h3>
              <p className={`text-${color}-600 font-medium mb-2`}>{m.role}</p>
              
              {/* Sửa: Thêm mô tả */}
              {m.desc && <p className="text-gray-500 text-sm">{m.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}