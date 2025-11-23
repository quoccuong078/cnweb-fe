// src/pages/Landings/Landings.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, Eye, Edit, Globe, Palette, CalendarDays,
  BadgeCheck, X, ChevronDown, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Landings() {
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLandings = async () => {
      try {
        setLoading(true);
        setError(null);

        // LẤY DỮ LIỆU THẬT 100% TỪ BACKEND
        const res = await api.get("/api/superadmin/landings");
        const data = res.data.data || [];

        setLandings(data);
      } catch (err) {
        console.error("Lỗi tải danh sách landing:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLandings([]); // Không còn dữ liệu ảo nữa
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
        (item.domain && item.domain.toLowerCase().includes(searchLower)) ||
        (item.slug && item.slug.toLowerCase().includes(searchLower));

      const matchTemplate = filterTemplate === "all" || item.template === filterTemplate;
      const matchColor = filterColor === "all" || item.color === filterColor;
      const matchStatus = filterStatus === "all" || 
        (filterStatus === "published" && item.isPublished) ||
        (filterStatus === "draft" && !item.isPublished);

      return matchSearch && matchTemplate && matchColor && matchStatus;
    });
  }, [landings, search, filterTemplate, filterColor, filterStatus]);

  const templates = [...new Set(landings.map(l => l.template).filter(Boolean))];
  const colors = [...new Set(landings.map(l => l.color).filter(Boolean))];

  const getColorClass = (color) => {
    const map = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      green: "bg-green-100 text-green-700 border-green-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
      red: "bg-red-100 text-red-700 border-red-200",
    };
    return map[color] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Quản lý Landing Page</h1>
          <p className="text-gray-600 mt-1">
            {filteredLandings.length} / {landings.length} landing page
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm tên, domain, slug..."
              className="pl-12 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-5 py-3 bg-white border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <Filter size={20} />
            Bộ lọc
            <ChevronDown size={18} className={`transition ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Lỗi */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl flex items-center gap-3 text-red-800">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Bộ lọc */}
      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-md border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" value={filterTemplate} onChange={(e) => setFilterTemplate(e.target.value)}>
              <option value="all">Tất cả template</option>
              {templates.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
              <option value="all">Tất cả màu</option>
              {colors.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
            <select className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
          {(filterTemplate !== "all" || filterColor !== "all" || filterStatus !== "all") && (
            <button onClick={() => { setFilterTemplate("all"); setFilterColor("all"); setFilterStatus("all"); }}
              className="mt-4 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2">
              <X size={18} /> Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </div>
              <div className="p-5 bg-gray-50 flex gap-3">
                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
                <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Danh sách thật */}
      {!loading && filteredLandings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLandings.map((landing) => (
            <div key={landing.id} className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition-all group">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-purple-700 transition">
                    {landing.title || "Không có tiêu đề"}
                  </h3>
                  {landing.isPublished ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <BadgeCheck size={14} /> Đã xuất bản
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">Bản nháp</span>
                  )}
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-400" />
                    <span className="font-medium truncate">{landing.domain}/{landing.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette size={16} className="text-gray-400" />
                    Template: <strong className="capitalize">{landing.template || "N/A"}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${getColorClass(landing.color).split(' ')[0].replace('bg-', 'border-').replace('100', '300')}`} />
                    <span className="capitalize">{landing.color || "default"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={14} />
                    {landing.updatedAt ? new Date(landing.updatedAt).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 flex gap-3">
                <a href={`https://${landing.domain}/${landing.slug}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-white border border-green-300 text-green-700 px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-50 transition">
                  <Eye size={18} /> Xem
                </a>
                <Link to={`/superadmin/landings/${landing.id}/edit`}
                  className="flex-1 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow">
                  <Edit size={18} /> Sửa
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Không có dữ liệu */}
      {!loading && landings.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Chưa có landing page nào</p>
          <p className="text-gray-500 mt-2">Dữ liệu sẽ xuất hiện khi backend hoạt động</p>
        </div>
      )}
    </div>
  );
}