// src/components/ViewerSections/PricingSection.jsx
export default function PricingSection({ data, color = "blue" }) {
  const plans = [
    { name: data.plan1, price: data.plan1Price, features: data.plan1Features, featured: data.plan1Featured, btn: data.plan1Button },
    { name: data.plan2, price: data.plan2Price, features: data.plan2Features, featured: data.plan2Featured, btn: data.plan2Button },
    { name: data.plan3, price: data.plan3Price, features: data.plan3Features, featured: data.plan3Featured, btn: data.plan3Button },
  ].filter(p => p.name);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className={`text-4xl font-bold mb-12 text-${color}-700`}>
          {data.title || "Bảng Giá"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-8 shadow-lg ${p.featured ? "ring-4 ring-blue-500 scale-105" : ""}`}
            >
              {p.featured && <div className="bg-blue-600 text-white text-sm py-1 px-4 rounded-full inline-block mb-4">Phổ biến nhất</div>}
              <h3 className="text-2xl font-bold mb-4">{p.name}</h3>
              <div className="text-4xl font-bold mb-6">{p.price}</div>
              <ul className="text-left space-y-3 mb-8">
                {p.features?.split("\n").map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-bold transition ${p.featured ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"}`}>
                {p.btn || "Chọn gói"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}