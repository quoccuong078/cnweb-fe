// src/components/ViewerSections/StatsSection.jsx
export default function StatsSection({ data, color = "blue" }) {
  const stats = [
    { number: data.stat1Number, label: data.stat1 },
    { number: data.stat2Number, label: data.stat2 },
    { number: data.stat3Number, label: data.stat3 },
    { number: data.stat4Number, label: data.stat4 },
  ].filter(s => s.number);

  return (
    <section className={`py-20 bg-${color}-600 text-white text-center`}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">{data.title || "Thành Tựu"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-5xl font-bold">{s.number}</div>
              <div className="text-lg mt-2 opacity-90">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}