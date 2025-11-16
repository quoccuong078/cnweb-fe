import { FiEdit, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const sampleLandings = [
  {
    id: 1,
    title: "Landing Coffee House",
    slug: "coffee-house",
    template: "Modern",
    updatedAt: "2025-01-10",
  },
  {
    id: 2,
    title: "Digital Agency",
    slug: "digital-agency",
    template: "Creative",
    updatedAt: "2025-01-05",
  },
];

export default function LandingManagement() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Quản lý Landing Page</h1>
          <p className="text-gray-500 text-sm mt-1">
            Danh sách landing page của doanh nghiệp
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/create-landing")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FiPlus size={18} /> Tạo Landing Page
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sampleLandings.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">{item.title}</h3>
            <p className="text-gray-500 text-sm">URL: /{item.slug}</p>
            <p className="text-gray-500 text-sm">
              Template: <span className="font-medium">{item.template}</span>
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400">
                Cập nhật: {item.updatedAt}
              </span>

              <button
                onClick={() => navigate(`/admin/editor?id=${item.id}`)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 text-sm"
              >
                <FiEdit size={16} /> Sửa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
