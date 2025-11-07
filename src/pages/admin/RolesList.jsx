import React from "react";

const RolesList = () => {
  const roles = [
    {
      name: "Admin",
      description: "Quản trị toàn hệ thống, có toàn quyền truy cập và chỉnh sửa.",
    },
    {
      name: "Editor",
      description: "Quản lý nội dung, chỉnh sửa các trang landing của doanh nghiệp.",
    },
    {
      name: "Viewer",
      description: "Người xem, chỉ được phép truy cập và xem thông tin.",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Danh sách vai trò người dùng
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-blue-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-5 text-left text-sm font-semibold">STT</th>
              <th className="py-3 px-5 text-left text-sm font-semibold">Tên vai trò</th>
              <th className="py-3 px-5 text-left text-sm font-semibold">Mô tả</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-blue-100">
            {roles.map((role, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="py-3 px-5 text-sm">{index + 1}</td>
                <td className="py-3 px-5 font-medium text-blue-700">{role.name}</td>
                <td className="py-3 px-5 text-sm">{role.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesList;