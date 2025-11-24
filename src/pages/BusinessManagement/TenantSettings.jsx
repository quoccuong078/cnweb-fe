// src/pages/BusinessManagement/TenantSettings.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiGlobe, FiSave, FiUser } from "react-icons/fi";
import { getCurrentUser, updateTenantInfo } from "../../services/api";

export default function TenantSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    tenantName: "",
    subdomain: ""
  });

  // Load dữ liệu hiện tại
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        
        // Lấy subdomain gốc từ API (VD: "mybrand.saaswebsite.com")
        const rawSub = user.subdomain || user.Subdomain || "";
        
        // 1. CẮT BỎ ĐUÔI DOMAIN ĐỂ HIỂN THỊ
        const displaySub = rawSub.replace(".saaswebsite.com", "");

        setFormData({
          tenantName: user.tenantName || user.TenantName || "",
          subdomain: displaySub // Chỉ hiện "mybrand"
        });
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
        toast.error("Không thể tải thông tin doanh nghiệp.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tenantName.trim()) {
      toast.error("Tên doanh nghiệp không được để trống");
      return;
    }
    
    // Validate: Không cho nhập dấu chấm
    if (formData.subdomain.includes(".")) {
         toast.error("Chỉ nhập tên định danh, không nhập đuôi domain!");
         return;
    }

    const cleanSub = formData.subdomain.trim().toLowerCase();
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(cleanSub)) {
      toast.error("Subdomain chỉ được chứa chữ thường, số và dấu gạch ngang (-)");
      return;
    }

    setSaving(true);
    try {
      // 2. GHÉP LẠI ĐUÔI DOMAIN TRƯỚC KHI GỬI VỀ BACKEND
      const fullSubdomain = `${cleanSub}.saaswebsite.com`;

      await updateTenantInfo({
        TenantName: formData.tenantName,
        Subdomain: fullSubdomain 
      });
      toast.success("Cập nhật thông tin thành công!");
      
      // Reload để cập nhật
      setTimeout(() => window.location.reload(), 1000); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.Message || "Lỗi cập nhật.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải thông tin...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình Doanh nghiệp</h1>
        <p className="text-gray-500">Quản lý thông tin chung và địa chỉ truy cập website.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tên Doanh Nghiệp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Doanh Nghiệp / Cửa hàng
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Nhập tên doanh nghiệp..."
              />
            </div>
          </div>

          {/* Subdomain Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên miền con (Subdomain)
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiGlobe className="text-gray-400" />
              </div>
              
              {/* Input chỉ cho nhập phần prefix */}
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                className="w-full pl-10 pr-40 py-2 border border-r-0 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-blue-600"
                placeholder="my-brand"
              />
              
              {/* Đuôi cố định không sửa được */}
              <div className="bg-gray-50 border border-l-0 border-gray-300 text-gray-500 px-3 py-2 rounded-r-lg text-sm select-none font-medium h-full flex items-center">
                .saaswebsite.com
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              * Lưu ý: Việc thay đổi subdomain sẽ làm thay đổi đường dẫn truy cập của TẤT CẢ các trang Landing Page hiện tại.
            </p>
          </div>

          {/* Button Submit */}
          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium ml-auto"
            >
              {saving ? (
                <>Đang lưu...</>
              ) : (
                <>
                  <FiSave /> Lưu thay đổi
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}