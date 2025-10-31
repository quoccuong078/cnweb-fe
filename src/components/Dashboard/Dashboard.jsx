import { useState } from "react";
import {
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import {
  AiOutlineShop,
  AiOutlineMenu,
  AiOutlineSearch,
} from "react-icons/ai";

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

function Sidebar({ collapsed, onSelect }) {
  return (
    <aside
      className={`h-full ${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r border-slate-200 p-4 transition-all`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
          S
        </div>
        {!collapsed && (
          <div className="text-lg font-semibold text-slate-800">
            SaaS Studio
          </div>
        )}
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => onSelect("dashboard")}
          className="w-full text-left flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-100"
        >
          <FiBarChart2 /> {!collapsed && <span>Tổng quan</span>}
        </button>
        <button
          onClick={() => onSelect("tenants")}
          className="w-full text-left flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-100"
        >
          <AiOutlineShop /> {!collapsed && <span>Doanh nghiệp</span>}
        </button>
        <button
          onClick={() => onSelect("users")}
          className="w-full text-left flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-100"
        >
          <FiUsers /> {!collapsed && <span>Người dùng</span>}
        </button>
        <button
          onClick={() => onSelect("settings")}
          className="w-full text-left flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-100"
        >
          <FiSettings /> {!collapsed && <span>Cài đặt</span>}
        </button>
      </nav>

      <div className="mt-auto pt-6">
        <button className="w-full flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-100">
          <FiLogOut /> {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(tenantsSample[0].id);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("dashboard");

  const currentTenant = tenantsSample.find((t) => t.id === selectedTenant);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <Sidebar collapsed={collapsed} onSelect={setSection} />

        <main className="flex-1 p-6">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed((s) => !s)}
                className="p-2 rounded-md hover:bg-slate-200"
              >
                <AiOutlineMenu size={20} />
              </button>

              <div>
                <h1 className="text-2xl font-semibold">
                  {section === "dashboard"
                    ? "Bảng điều khiển"
                    : section === "tenants"
                    ? "Doanh nghiệp"
                    : section === "users"
                    ? "Người dùng"
                    : "Cài đặt"}
                </h1>
                <p className="text-sm text-slate-500">
                  Quản lý:{" "}
                  <span className="font-medium">{currentTenant.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border">
                <AiOutlineSearch />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="ml-2 bg-transparent outline-none text-sm"
                />
              </div>

              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-white px-3 py-2 rounded-lg border shadow-sm"
              >
                {tenantsSample.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.plan}
                  </option>
                ))}
              </select>

              <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center font-semibold">
                Q
              </div>
            </div>
          </header>

          {/* --- Nội dung chính --- */}
          {section === "dashboard" && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-4 rounded-2xl shadow-sm border">
                  <h3 className="font-semibold mb-3">
                    Biểu đồ truy cập
                  </h3>
                  <div className="h-48 rounded-md border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                    (Khu vực biểu đồ - có thể tích hợp Chart.js)
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border">
                  <h3 className="font-semibold mb-3">
                    Hoạt động gần đây
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                      <div>
                        <div className="font-medium">
                          Người dùng mới đăng ký
                        </div>
                        <div className="text-slate-500">
                          Anna từ {currentTenant.name}
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                      <div>
                        <div className="font-medium">
                          Trang giới thiệu được cập nhật
                        </div>
                        <div className="text-slate-500">
                          Tối ưu SEO
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            </>
          )}

          {section === "tenants" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-semibold mb-4">Danh sách doanh nghiệp</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tenantsSample.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-lg border hover:shadow-md transition"
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-slate-500">
                      Gói: {t.plan}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 rounded bg-indigo-500 text-white">
                        Mở
                      </button>
                      <button className="px-3 py-1 rounded border">
                        Sửa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "users" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-semibold mb-4">
                Người dùng của {currentTenant.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Quản lý quyền và vai trò người dùng.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <div className="font-medium">Anna Trần</div>
                    <div className="text-sm text-slate-500">Quản trị viên</div>
                  </div>
                  <div className="text-sm text-indigo-500 cursor-pointer">
                    Quản lý
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <div className="font-medium">Michael Lê</div>
                    <div className="text-sm text-slate-500">Biên tập</div>
                  </div>
                  <div className="text-sm text-indigo-500 cursor-pointer">
                    Quản lý
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "settings" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-semibold mb-4">Cài đặt hệ thống</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">Thương hiệu & Tên miền</div>
                <div className="p-4 border rounded">Thanh toán & Gói dịch vụ</div>
                <div className="p-4 border rounded">Tích hợp</div>
                <div className="p-4 border rounded">Bảo mật</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
