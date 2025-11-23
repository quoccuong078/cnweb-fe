// BusinessTable.jsx
import React from "react";

const BusinessTable = ({ businesses, onEdit, onDelete, onViewUsers }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
            <table className="min-w-full">
                <thead>
                    <tr className="bg-indigo-50 text-indigo-600">
                        <th className="px-4 py-3 text-left">Tên doanh nghiệp</th>
                        <th className="px-4 py-3 text-left">Mã số thuế</th>
                        <th className="px-4 py-3 text-left">Địa chỉ</th>
                        <th className="px-4 py-3 text-left">SĐT</th>
                        <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {businesses.map((biz) => (
                        <tr key={biz.id} className="border-t">
                            <td className="px-4 py-3">{biz.companyName}</td>
                            <td className="px-4 py-3">{biz.taxCode}</td>
                            <td className="px-4 py-3">{biz.address}</td>
                            <td className="px-4 py-3">{biz.phone}</td>
                            <td className="px-4 py-3 flex gap-2 justify-center">
                                <button
                                    onClick={() => onEdit(biz)}
                                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    Sửa
                                </button>

                                <button
                                    onClick={() => onDelete(biz.id)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Xóa
                                </button>

                                <button
                                    onClick={() => onViewUsers(biz.id)}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Xem User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BusinessTable;
