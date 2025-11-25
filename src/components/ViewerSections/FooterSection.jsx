// src/components/ViewerSections/FooterSection.jsx
export default function FooterSection({ data }) {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Logo & Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-10 object-contain bg-white/10 rounded p-1" />}
            <h3 className="text-xl font-bold">{data.logoText || "Your Brand"}</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{data.description || "Mô tả công ty"}</p>
        </div>

        {/* Sửa: Render 3 cột Links động */}
        {["links1", "links2", "links3"].map((col) => (
          <div key={col}>
            <h4 className="text-lg font-bold mb-4 text-white">
              {data[`${col}Title`] || "Liên kết"}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[1, 2, 3].map((i) => {
                const item = data[`${col}Item${i}`];
                return item ? (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        {data.copyright || "© 2025 Your Company. All rights reserved."}
      </div>
    </footer>
  );
}