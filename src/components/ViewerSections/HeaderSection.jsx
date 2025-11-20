// src/components/ViewerSections/HeaderSection.jsx
import { getColorClasses } from "../Editor/utils/getColorClasses";

export default function HeaderSection({ data, color = "blue" }) {
  const textColor = getColorClasses(color, "700").text || "text-blue-700";

  return (
    <header className="bg-white border-b border-gray-200 py-5 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center px-6 gap-4">
        <div className="flex items-center gap-4">
          {data.logoImage && (
            <img src={data.logoImage} alt="Logo" className="h-12 object-contain" />
          )}
          <h1 className={`text-2xl font-bold ${textColor}`}>
            {data.logoText || "Your Brand"}
          </h1>
        </div>

        <nav className="flex flex-wrap gap-6 justify-center">
          {[data.menu1, data.menu2, data.menu3, data.menu4].map((item, i) => (
            item && (
              <a key={i} href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">
                {item}
              </a>
            )
          ))}
        </nav>

        {data.buttonText && (
          <button className={`bg-${color}-600 hover:bg-${color}-700 text-white px-6 py-2 rounded-lg font-semibold transition`}>
            {data.buttonText}
          </button>
        )}
      </div>
    </header>
  );
}