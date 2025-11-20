// src/components/ViewerSections/ServicesSection.jsx
export default function ServicesSection({ data, color = "blue" }) {
  const services = [data.service1, data.service2, data.service3].filter(Boolean);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className={`text-4xl font-bold text-${color}-700 mb-12`}>
          {data.title || "Dịch Vụ"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div key={i} className="p-8 border rounded-xl hover:border-blue-500 transition">
              <h3 className="text-xl font-bold mb-3">{s}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}