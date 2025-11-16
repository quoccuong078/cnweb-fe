import { AiOutlineShop } from "react-icons/ai";
import {
  FiBarChart2,
  FiUsers,
} from "react-icons/fi";

const tenantsSample = [
  { id: "t-1", name: "Cà phê Xanh", plan: "Gói Pro" },
  { id: "t-2", name: "Bánh Ngọt Lam", plan: "Gói Cơ Bản" },
  { id: "t-3", name: "Red Digital", plan: "Gói Doanh Nghiệp" },
];

const statsSample = {
  visitors: 12453,
  leads: 312,
  conversions: 24,
  revenue: 5423,
};

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-slate-100 text-indigo-600">
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-600">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Lượt truy cập (30 ngày)"
          value={statsSample.visitors.toLocaleString()}
          icon={<FiBarChart2 size={20} />}
        />
        <StatCard
          title="Khách tiềm năng"
          value={statsSample.leads}
          icon={<FiUsers size={20} />}
        />
        <StatCard
          title="Chuyển đổi"
          value={statsSample.conversions}
          icon={<AiOutlineShop size={20} />}
        />
        <StatCard
          title="Doanh thu (USD)"
          value={`$${statsSample.revenue}`}
          icon={<FiBarChart2 size={20} />}
        />
      </section>

      {/* BIỂU ĐỒ + HOẠT ĐỘNG */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow-sm border">
          <h3 className="font-semibold mb-3">Biểu đồ truy cập</h3>
          <div className="h-48 rounded-md border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
            (Khu vực biểu đồ - tích hợp Chart.js sau)
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <h3 className="font-semibold mb-3">Hoạt động gần đây</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
              <div>
                <div className="font-medium">Người dùng mới đăng ký</div>
                <div className="text-slate-500">Anna</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
              <div>
                <div className="font-medium">Trang giới thiệu được cập nhật</div>
                <div className="text-slate-500">Tối ưu SEO</div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
