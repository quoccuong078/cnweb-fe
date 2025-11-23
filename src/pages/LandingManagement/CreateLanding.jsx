// src/pages/LandingManagement/CreateLanding.jsx
import { useEffect, useState } from "react"; // 1. Thêm useEffect
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/api"; // 2. Import API lấy thông tin user

const CreateLanding = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("");
  
  // 3. Thêm state lưu subdomain, mặc định là loading...
  const [subdomain, setSubdomain] = useState("..."); 
  
  const navigate = useNavigate();

  // ... (giữ nguyên mảng templates)
  const templates = [
    // ... code cũ của bạn
     {
      id: 1,
      name: "Classic",
      description: "Giao diện cổ điển, phù hợp giới thiệu doanh nghiệp truyền thống.",
      preview: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300&h=150&fit=crop&crop=center",
      defaultSections: ["header", "hero", "about", "services", "contact", "footer"]
    },
    {
      id: 2,
      name: "Modern",
      description: "Phong cách hiện đại, tối giản, hình ảnh lớn bắt mắt.",
      preview: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=150&fit=crop&crop=center",
      defaultSections: ["header", "hero", "features", "pricing", "testimonials", "footer"]
    },
    {
      id: 3,
      name: "Creative",
      description: "Thiết kế sáng tạo, hiệu ứng động, phù hợp startup công nghệ.",
      preview: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=150&fit=crop&crop=center",
      defaultSections: ["header", "hero", "carousel", "stats", "team", "faq", "contact", "footer"]
    },
  ];

  // 4. Gọi API lấy thông tin Tenant/User khi component được load
  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const user = await getCurrentUser();
        // Giả sử API trả về field 'subdomain' hoặc 'tenantSubdomain'
        // Bạn cần kiểm tra chính xác API trả về gì trong console
        if (user) {
            // Ưu tiên lấy subdomain từ user/tenant, nếu không có thì fallback về mặc định
            setSubdomain(user.subdomain || user.tenantSubdomain || "yourdomain");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin tenant:", error);
        setSubdomain("yourdomain"); // Fallback nếu lỗi
      }
    };

    fetchTenantInfo();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !slug || !template) return alert("Điền đầy đủ thông tin!");

    const selectedTemplate = templates.find(t => t.name === template);
    const defaultSections = selectedTemplate ? selectedTemplate.defaultSections : [];

    const newPageData = {
      title,
      slug,
      status: "draft",
      pageSections: defaultSections.map((sectionType, index) => ({
        sectionType,
        order: index
      })),
      pageConfiguration: {
        customColors: "blue",
        templateId: selectedTemplate.id,
        // Truyền luôn subdomain vào config nếu cần thiết cho Editor hiển thị
        subdomain: subdomain 
      }
    };

    navigate("/admin/editor", { state: { newPageData } });
  };
  
  // ... (giữ nguyên generateSlug và handleTitleChange)
  const generateSlug = (text) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (newTitle && !slug) setSlug(generateSlug(newTitle));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-200 max-w-4xl mx-auto">
      {/* Header giữ nguyên */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-blue-800 mb-2">Tạo Trang Landing Mới</h1>
        <p className="text-gray-600 text-sm lg:text-base">Thiết kế trang landing page chuyên nghiệp chỉ trong vài phút</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input giữ nguyên */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">Tiêu đề trang <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            placeholder="Nhập tiêu đề trang landing của bạn..."
            value={title}
            onChange={handleTitleChange}
            className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-2 lg:py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        {/* Slug Input - PHẦN QUAN TRỌNG ĐÃ SỬA */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">
              Đường dẫn (URL)
              <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="flex items-center">
            {/* Hiển thị Subdomain động, không cho sửa */}
            <span className="bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg px-3 lg:px-4 py-2 lg:py-3 text-gray-700 font-medium text-xs lg:text-sm select-none">
              {subdomain}/
            </span>
            <input
              type="text"
              placeholder="vi-du-trang-landing"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="flex-1 border border-gray-300 rounded-r-lg px-3 lg:px-4 py-2 lg:py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
          <p className="text-xs lg:text-sm text-gray-500">
            Đường dẫn sẽ bao gồm Subdomain của doanh nghiệp bạn.
          </p>
        </div>

        {/* Phần còn lại (Template Selection, Button) giữ nguyên */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-2">Chọn giao diện (Template) <span className="text-red-500">*</span></span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((item) => (
              <div
                key={item.id}
                onClick={() => setTemplate(item.name)}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md group ${
                  template === item.name
                    ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="relative overflow-hidden">
                  <img src={item.preview} alt={`Template ${item.name}`} className="w-full h-28 lg:h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  {template === item.name && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className={`font-semibold text-sm lg:text-base mb-1 ${template === item.name ? "text-blue-700" : "text-gray-800"}`}>{item.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={!title || !slug || !template}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg shadow transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 w-full"
          >
            {title && slug && template ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Tạo Trang Ngay
              </span>
            ) : "Vui lòng điền đầy đủ thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLanding;