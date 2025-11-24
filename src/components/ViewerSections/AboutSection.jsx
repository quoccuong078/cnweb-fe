// src/components/ViewerSections/AboutSection.jsx
export default function AboutSection({ data, color = "blue" }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className={`text-4xl font-bold text-${color}-700 mb-12 text-center`}>
          {data.title || "Về Chúng Tôi"}
        </h2>
        
        {/* SỬA: Chia layout 2 cột nếu có ảnh, giống Editor */}
        <div className={`flex flex-col ${data.aboutImage ? 'lg:flex-row' : ''} gap-10 items-center`}>
          
          {/* Hiển thị ảnh nếu có */}
          {data.aboutImage && (
            <div className="w-full lg:w-1/2">
              <img 
                src={data.aboutImage} 
                alt="About Us" 
                className="rounded-2xl shadow-lg w-full object-cover h-64 lg:h-96" 
              />
            </div>
          )}

          <div className={`w-full ${data.aboutImage ? 'lg:w-1/2' : 'text-center'}`}>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {data.content || "Chúng tôi là đội ngũ chuyên nghiệp..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}