// src/pages/Landings/LandingDetailView.jsx
import { ArrowLeft, BadgeCheck, Building, CalendarDays, ExternalLink, Eye, Globe, LayoutTemplate } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLandingDetailForSuperAdmin } from "../../services/api";

export default function LandingDetailView() {
  const { id } = useParams();
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        setLoading(true);
        const data = await getLandingDetailForSuperAdmin(id);
        setLanding(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin trang này.");
      } finally {
        setLoading(false);
      }
    };
    fetchLanding();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
    </div>
  );

  if (error || !landing) return (
    <div className="p-10 text-center text-red-500 font-medium">
        {error || "Không tìm thấy landing page"}
    </div>
  );

  // --- LOGIC URL LIVE MỚI ---
  const getLiveUrl = () => {
    // 1. Kiểm tra môi trường
    const isLocal = window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1");
    
    // 2. Domain chính khi chạy Production (Thay bằng domain thật của bạn)
    const productionBaseDomain = "saas-platform.com"; 

    // 3. Xác định subdomain (Quan trọng: Fallback nếu DB null)
    const subdomain = landing.subdomain || "unknown";

    if (isLocal) {
        // Ở Localhost, React Router xử lý route dạng: localhost:5173/:subdomain/:slug
        // Chúng ta phải dùng đúng subdomain của TENANT, không phải của SuperAdmin đang đăng nhập
        return `${window.location.origin}/${subdomain}/${landing.slug}`;
    } else {
        // Ở Production
        if (landing.customDomain) {
            // Nếu Tenant có custom domain
            return `https://${landing.customDomain}/${landing.slug}`;
        } else {
            // Nếu dùng Subdomain hệ thống
            return `https://${subdomain}.${productionBaseDomain}/${landing.slug}`;
        }
    }
  };

  const liveUrl = getLiveUrl();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/superadmin/landings" className="p-3 bg-white rounded-xl shadow hover:shadow-md transition text-gray-600">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-purple-700">{landing.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
                <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-sm">ID: {landing.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Building size={14}/> {landing.tenantName}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Nút Xem Live */}
          <a href={liveUrl} target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-white border border-green-600 text-green-700 rounded-xl flex items-center gap-2 hover:bg-green-50 transition font-bold shadow-sm">
            <ExternalLink size={18} />
            Xem Live
          </a>
          
          {/* Nút Sửa: Đã cập nhật thành /superadmin/editor */}
          <Link to={`/superadmin/editor?id=${landing.id}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition font-bold shadow-md shadow-blue-200">
            <Eye size={18} />
            Truy cập Editor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin cấu hình */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <LayoutTemplate className="text-purple-600"/> Thông tin cấu hình
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Tiêu đề trang</p>
                    <p className="font-bold text-gray-900 text-lg">{landing.title}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm mb-1">Slug (Đường dẫn)</p>
                    <p className="font-mono text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded">/{landing.slug}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-sm mb-2">URL truy cập</p>
                <a href={liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 font-medium break-all">
                  <Globe size={18} />
                  {liveUrl}
                </a>
                {landing.customDomain && (
                    <span className="ml-6 inline-block mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        Đang dùng Custom Domain
                    </span>
                )}
              </div>

              <hr className="border-gray-100"/>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Template đang dùng</p>
                  <p className="font-semibold text-gray-800 capitalize">{landing.template}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Màu chủ đạo</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-${landing.color}-500 shadow-sm border`} />
                    <span className="font-semibold text-gray-800 capitalize">{landing.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-2">Trạng thái xuất bản</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${landing.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {landing.isPublished ? <BadgeCheck size={18} /> : null}
                  {landing.isPublished ? "Đang Online (Published)" : "Chưa xuất bản (Draft)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Meta info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin hệ thống</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-xs text-gray-400">Doanh nghiệp sở hữu</p>
                    <p className="font-semibold text-gray-800">{landing.tenantName}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Ngày cập nhật gần nhất</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-400"/>
                        {new Date(landing.updatedAt).toLocaleString("vi-VN")}
                    </p>
                </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white text-center">
            <p className="font-medium mb-4">Bạn muốn chỉnh sửa trang này?</p>
            {/* Đã cập nhật Link */}
            <Link to={`/superadmin/editor?id=${landing.id}`} 
                className="inline-block w-full bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-sm">
                Mở trong Editor
            </Link>
            <p className="text-xs text-purple-200 mt-3 opacity-80">Quyền SuperAdmin cho phép sửa trực tiếp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}