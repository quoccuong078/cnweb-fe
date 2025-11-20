// src/components/ViewerSections/TeamSection.jsx
export default function TeamSection({ data }) {
  const members = [
    { name: data.member1, role: data.member1Role },
    { name: data.member2, role: data.member2Role },
    { name: data.member3, role: data.member3Role },
  ].filter(m => m.name);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">{data.title || "Đội Ngũ"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {members.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">{m.name}</h3>
              <p className="text-gray-600">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}