// src/pages/Landings/LandingDetailEdit.jsx
import { ArrowLeft, Loader2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function LandingDetailEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "", slug: "", template: "", color: "", isPublished: true
  });

  useEffect(() => {
    fetchLanding();
  }, [id]);

  const fetchLanding = async () => {
    try {
      // const res = await api.get(`/api/superadmin/landings/${id}`);
      // const data = res.data.data;
      
      // MOCK DATA
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData = {
        title: "Landing Page Demo Edit",
        slug: "demo-slug",
        template: "Modern",
        color: "purple",
        isPublished: true,
      };

      setFormData({
        title: mockData.title,
        slug: mockData.slug,
        template: mockData.template,
        color: mockData.color,
        isPublished: mockData.isPublished,
      });
    } catch (err) {
      toast.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // await api.put(`/api/superadmin/landings/${id}`, formData);
      
      // FAKE SAVE
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Cập nhật thành công! (Dữ liệu ảo)");
      navigate(`/superadmin/landings/${id}`);
    } catch (err) {
      toast.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/superadmin/landings/${id}`} className="p-3 bg-white rounded-xl shadow hover:shadow-md transition">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Chỉnh sửa Landing Page</h1>
            <p className="text-gray-600">ID: {id}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-green-600 text-white rounded-xl flex items-center gap-3 hover:bg-green-700 disabled:opacity-70 transition font-medium shadow-lg"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Lưu thay đổi
        </button>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl shadow-md border p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tiêu đề</label>
            <input
              type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Slug (URL)</label>
            <div className="flex gap-3">
              <span className="px-5 py-4 bg-gray-100 rounded-xl">https://domain.com/</span>
              <input
                type="text" value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 px-5 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Template</label>
              <select
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                <option>Modern</option>
                <option>Creative</option>
                <option>Minimal</option>
                <option>Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Màu chủ đạo</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox" checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-7 h-7 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-lg font-medium">
                {formData.isPublished ? <ToggleRight size={28} className="text-green-600 inline" /> 
                  : <ToggleLeft size={28} className="text-gray-400 inline" />}
                &nbsp; Đã xuất bản (hiện công khai)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}