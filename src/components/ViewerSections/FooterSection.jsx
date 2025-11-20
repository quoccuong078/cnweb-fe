// src/components/ViewerSections/FooterSection.jsx
export default function FooterSection({ data }) {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-10" />}
            <h3 className="text-xl font-bold">{data.logoText || "Your Brand"}</h3>
          </div>
          <p className="text-sm text-gray-400">{data.description || "Mô tả công ty"}</p>
        </div>
        {/* Các cột link có thể mở rộng sau */}
        <div></div><div></div><div></div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
        {data.copyright || "© 2025 Your Company. All rights reserved."}
      </div>
    </footer>
  );
}