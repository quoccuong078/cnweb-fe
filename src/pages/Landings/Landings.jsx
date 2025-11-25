// src/pages/Landings/Landings.jsx
import {
  AlertCircle,
  Building,
  CalendarDays,
  ChevronDown,
  Edit,
  Eye,
  Filter,
  Globe,
  Palette,
  Search
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLandingsForSuperAdmin } from "../../services/api";

export default function Landings() {
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States bộ lọc
  const [search, setSearch] = useState("");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLandings = async () => {
      try {
        setLoading(true);
        const data = await getAllLandingsForSuperAdmin();
        setLandings(data);
      } catch (err) {
        console.error("Lỗi tải danh sách landing:", err);
        setError("Không thể tải dữ liệu hệ thống.");
      } finally {
        setLoading(false);
      }
    };
    fetchLandings();
  }, []);

  const filteredLandings = useMemo(() => {
    return landings.filter(item => {
      const searchLower = search.toLowerCase();
      const matchSearch = !search || 
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        (item.subdomain && item.subdomain.toLowerCase().includes(searchLower)) ||
        (item.customDomain && item.customDomain.toLowerCase().includes(searchLower)) ||
        (item.slug && item.slug.toLowerCase().includes(searchLower)) ||
        (item.tenantName && item.tenantName.toLowerCase().includes(searchLower));

      const matchTemplate = filterTemplate === "all" || item.template === filterTemplate;
      const matchColor = filterColor === "all" || item.color === filterColor;
      const matchStatus = filterStatus === "all" || 
        (filterStatus === "published" && item.status === "Published") ||
        (filterStatus === "draft" && item.status !== "Published");

      return matchSearch && matchTemplate && matchColor && matchStatus;
    });
  }, [landings, search, filterTemplate, filterColor, filterStatus]);

  const templates = [...new Set(landings.map(l => l.template).filter(Boolean))];
  const colors = [...new Set(landings.map(l => l.color).filter(Boolean))];

  const getColorClass = (color) => {
    const map = {
      blue: "bg-blue-100 text-blue-700 ring-blue-500",
      purple: "bg-purple-100 text-purple-700 ring-purple-500",
      green: "bg-green-100 text-green-700 ring-green-500",
      orange: "bg-orange-100 text-orange-700 ring-orange-500",
      red: "bg-red-100 text-red-700 ring-red-500",
    };
    return map[color] || "bg-gray-100 text-gray-700 ring-gray-500";
  };

  const getDisplayUrl = (item) => {
    const identifier = item.subdomain || `${item.customDomain}.saas-platform.com`;
    return `${identifier}/${item.slug}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quản lý Landing Page</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Khu vực SuperAdmin: Tổng hợp <span className="font-bold text-purple-600">{filteredLandings.length}</span> trang từ tất cả doanh nghiệp
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm trang, tenant, domain..."
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition font-medium shadow-sm ${showFilters ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
            >
              <Filter size={20} />
              Bộ lọc
              <ChevronDown size={18} className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giao diện (Template)</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" value={filterTemplate} onChange={(e) => setFilterTemplate(e.target.value)}>
                  <option value="all">Tất cả template</option>
                  {templates.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
                  <option value="all">Tất cả màu</option>
                  {colors.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-6 text-gray-500 font-medium">Đang tải dữ liệu từ server...</p>
          </div>
        )}

        {/* Grid Card */}
        {!loading && filteredLandings.length > 0 && (
          // Đã thay đổi: xl:grid-cols-4 thành xl:grid-cols-3 để thẻ to hơn
          // Tăng gap-6 lên gap-8 để thoáng hơn
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLandings.map((landing) => (
              <div key={landing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden">
                
                {/* Card Header & Body */}
                <div className="p-7 flex-1">
                  
                  {/* Dòng 1: Tenant Info & Status (Tách biệt khỏi Title) */}
                  <div className="flex justify-between items-start mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-semibold text-gray-600 border border-gray-100">
                          <Building size={14} className="text-gray-400" /> 
                          <span className="truncate max-w-[120px]">{landing.tenantName}</span>
                      </div>
                      
                      {landing.status === "Published" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
                           Published
                          </span>
                      ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                           Draft
                          </span>
                      )}
                  </div>

                  {/* Dòng 2: Title (Lớn hơn, rõ ràng hơn) */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3.5rem]" title={landing.title}>
                      {landing.title || "Chưa đặt tiêu đề"}
                  </h3>

                  {/* URL Box */}
                  <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-md shadow-sm">
                      <Globe size={16} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-mono text-gray-600 truncate">{getDisplayUrl(landing)}</span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <Palette size={16} className="text-gray-400" />
                      <div className="flex items-center gap-2">
                         <span className="capitalize font-medium text-gray-700">{landing.template}</span>
                         <span className={`w-3 h-3 rounded-full ring-2 ring-offset-1 ${getColorClass(landing.color)}`}></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5" title="Ngày cập nhật">
                      <CalendarDays size={16} className="text-gray-400" />
                      <span>{new Date(landing.updatedAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-7 py-5 bg-gray-50 border-t border-gray-100 flex gap-4">
                  <Link to={`/superadmin/landings/${landing.id}`}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm text-sm">
                    <Eye size={18} /> Chi tiết
                  </Link>
                  <Link to={`/superadmin/editor?id=${landing.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition shadow text-sm">
                    <Edit size={18} /> Sửa
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && landings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <Globe size={48} className="text-gray-300"/>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hệ thống chưa có trang nào</h3>
              <p className="text-gray-500 max-w-md">Hiện tại chưa có doanh nghiệp nào tạo Landing Page trên hệ thống.</p>
            </div>
        )}
      </div>
    </div>
  );
}