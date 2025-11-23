// src/pages/Landings/LandingDetailView.jsx
import { ArrowLeft, BadgeCheck, CalendarDays, ExternalLink, Eye, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function LandingDetailView() {
  const { id } = useParams();
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        // --- TẠM THỜI TẮT API ---
        // const res = await api.get(`/api/superadmin/landings/${id}`);
        // setLanding(res.data.data);

        // --- MOCK DATA ---
        await new Promise(resolve => setTimeout(resolve, 500));
        setLanding({
          id: id,
          title: "Landing Page Giới Thiệu Sản Phẩm (Demo)",
          domain: "sanpham.vn",
          slug: "gioi-thieu",
          template: "Modern",
          color: "blue",
          isPublished: true,
          updatedAt: new Date().toISOString()
        });
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLanding();
  }, [id]);

  if (loading) return <div className="p-20 text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div></div>;
  if (!landing) return <div className="p-10 text-center text-gray-500">Không tìm thấy landing page</div>;

  const fullUrl = `https://${landing.domain}/${landing.slug}`;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/superadmin/landings" className="p-3 bg-white rounded-xl shadow hover:shadow-md transition">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-purple-700">{landing.title}</h1>
            <p className="text-gray-600">ID: {id} • Xem chi tiết</p>
          </div>
        </div>

        <div className="flex gap-3">
          <a href={fullUrl} target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 transition font-medium">
            <ExternalLink size={18} />
            Xem trang Live
          </a>
          <Link to={`/superadmin/landings/${id}/edit`}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition font-medium">
            <Eye size={18} />
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin chi tiết</h2>
            <div className="space-y-8 text-lg">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tiêu đề</p>
                <p className="font-bold text-gray-800">{landing.title}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">URL</p>
                <a href={fullUrl} target="_blank" className="text-purple-600 hover:underline flex items-center gap-2 font-medium">
                  <Globe size={20} />
                  {fullUrl}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Template</p>
                  <p className="font-semibold capitalize">{landing.template}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Màu chủ đạo</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-${landing.color}-500 border-4 border-${landing.color}-300`} />
                    <span className="font-semibold capitalize">{landing.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Trạng thái</p>
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold ${landing.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {landing.isPublished ? <BadgeCheck size={20} /> : null}
                  {landing.isPublished ? "Đã xuất bản" : "Bản nháp"}
                </span>
              </div>

              <div className="pt-6 border-t">
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <CalendarDays size={18} />
                  Cập nhật: {new Date(landing.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md border p-6 text-center">
            <div className="w-32 h-32 mx-auto bg-gray-200 border-2 border-dashed rounded-xl mb-4" />
            <p className="text-gray-500">Preview thumbnail<br/>(sắp có)</p>
          </div>
        </div>
      </div>
    </div>
  );
}