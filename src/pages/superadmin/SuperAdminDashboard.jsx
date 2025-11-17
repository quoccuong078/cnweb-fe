export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">

      {/* 3 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-purple-600">
          <h3 className="text-lg font-bold text-purple-700">Tổng Tenant</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-blue-700">Tổng người dùng</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-600">
          <h3 className="text-lg font-bold text-green-700">Doanh thu tháng</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800">₫842M</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold text-purple-700 mb-2">Chào mừng SuperAdmin!</h2>
        <p className="text-gray-600">Bạn đang ở quyền quản trị cao nhất hệ thống.</p>
      </div>
    </div>
  );
}
