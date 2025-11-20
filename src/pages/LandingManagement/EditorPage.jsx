// src/pages/LandingManagement/EditorPage.jsx
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EditableBlock from "../../components/Editor/EditableBlock";
import { SortableItem } from "../../components/Editor/SortableItem";
import api, { getLandingForEdit } from "../../services/api"; // Đảm bảo có getLandingForEdit

// Template mặc định khi thêm section mới
const sectionTemplates = {
  header: { sectionType: "header", content: JSON.stringify({ logoText: "Your Brand", menu1: "Trang chủ", menu2: "Giới thiệu", menu3: "Dịch vụ", menu4: "Liên hệ", buttonText: "Liên hệ" }) },
  hero: { sectionType: "hero", content: JSON.stringify({ title: "Chào mừng đến với chúng tôi", subtitle: "Giải pháp toàn diện cho doanh nghiệp", buttonText: "Bắt đầu ngay" }) },
  about: { sectionType: "about", content: JSON.stringify({ title: "Về Chúng Tôi", content: "Chúng tôi là đội ngũ chuyên nghiệp..." }) },
  features: { sectionType: "features", content: JSON.stringify({ title: "Tính Năng Nổi Bật", feature1: "Tốc độ cao", feature2: "Bảo mật", feature3: "Dễ sử dụng" }) },
  services: { sectionType: "services", content: JSON.stringify({ title: "Dịch Vụ", service1: "Thiết kế web", service2: "Marketing", service3: "Tư vấn" }) },
  stats: { sectionType: "stats", content: JSON.stringify({ title: "Thành Tựu", stat1Number: "100+", stat1: "Dự án", stat2Number: "50+", stat2: "Khách hàng" }) },
  team: { sectionType: "team", content: JSON.stringify({ title: "Đội Ngũ", member1: "Nguyễn Văn A", member1Role: "CEO" }) },
  testimonials: { sectionType: "testimonials", content: JSON.stringify({ title: "Khách Hàng Nói Gì", testimonial1: "Tuyệt vời!", testimonial1Author: "Khách A" }) },
  pricing: { sectionType: "pricing", content: JSON.stringify({ title: "Bảng Giá", plan1: "Cơ bản", plan1Price: "499k", plan1Features: "5 trang\n100GB", plan2: "Pro", plan2Price: "999k", plan2Features: "Không giới hạn", plan2Featured: true }) },
  contact: { sectionType: "contact", content: JSON.stringify({ title: "Liên Hệ", buttonText: "Gửi tin nhắn" }) },
  footer: { sectionType: "footer", content: JSON.stringify({ logoText: "Your Brand", description: "© 2025 Công ty của bạn" }) },
};

const colorThemes = [
  { name: "Xanh dương", value: "blue" },
  { name: "Xanh lá", value: "green" },
  { name: "Đỏ", value: "red" },
  { name: "Tím", value: "purple" },
  { name: "Cam", value: "orange" },
  { name: "Hồng", value: "pink" },
  { name: "Xám", value: "gray" },
  { name: "Xanh ngọc", value: "teal" },
];

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageId = searchParams.get("id");

  const [page, setPage] = useState({ id: null, title: "Trang mới", slug: "trang-moi" });
  const [sections, setSections] = useState([]);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Load dữ liệu khi có id
  useEffect(() => {
    const loadPage = async () => {
      if (!pageId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getLandingForEdit(pageId);
        setPage({ id: data.id, title: data.title || "Trang mới", slug: data.slug || "trang-moi" });
        setSections(data.sections.map(s => ({
          id: s.id || Date.now(),
          sectionType: s.sectionType,
          content: s.content,
          order: s.order
        })).sort((a, b) => a.order - b.order));
        setSelectedColor(data.customColors || "blue");
      } catch (err) {
        alert("Không tải được trang. Vui lòng thử lại.");
        navigate("/admin/landing-management");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [pageId, navigate]);

  const addSection = (type) => {
    const template = sectionTemplates[type];
    if (!template) return;

    const newSection = {
      id: Date.now() + Math.random(),
      sectionType: template.sectionType,
      content: template.content,
      order: sections.length,
    };
    setSections(prev => [...prev, newSection]);
  };

  const updateSection = (id, newContent) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections(prev => {
      const oldIdx = prev.findIndex(s => s.id === active.id);
      const newIdx = prev.findIndex(s => s.id === over.id);
      const reordered = arrayMove(prev, oldIdx, newIdx);
      return reordered.map((s, idx) => ({ ...s, order: idx }));
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: page.title,
      slug: page.slug,
      customColors: selectedColor,
      pageSections: sections.map((s, idx) => ({
        id: Number.isInteger(s.id) ? s.id : undefined,
        sectionType: s.sectionType,
        content: s.content,
        order: idx
      }))
    };

    try {
      if (pageId) {
        await api.put(`/api/tenant/landings/${pageId}`, payload);
      } else {
        const res = await api.post(`/api/tenant/landings`, payload);
        navigate(`/admin/editor?id=${res.data.id}`);
      }
      alert("Lưu trang thành công!");
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl text-gray-600">
        Đang tải trang...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="lg:w-80 bg-white shadow-lg">
        <div className="sticky top-0 h-screen overflow-y-auto p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-lg font-bold mb-4">Thêm khối nội dung</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(sectionTemplates).map(key => (
                <button
                  key={key}
                  onClick={() => addSection(key)}
                  className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-400 text-left text-sm font-medium capitalize transition"
                >
                  {sectionTemplates[key].sectionType}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="text-lg font-bold mb-4">Màu chủ đạo</h2>
            <div className="grid grid-cols-4 gap-4">
              {colorThemes.map(c => (
                <button
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-14 h-14 rounded-full bg-${c.value}-500 border-4 transition-all hover:scale-110 ${
                    selectedColor === c.value ? "border-black shadow-xl scale-110" : "border-gray-300"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b flex justify-between items-center">
            <input
              type="text"
              value={page.title}
              onChange={e => setPage(prev => ({ ...prev, title: e.target.value }))}
              className="text-3xl font-bold outline-none"
              placeholder="Tiêu đề trang"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              {saving ? "Đang lưu..." : "Lưu Trang"}
            </button>
          </div>

          <div className="p-8">
            {sections.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <p className="text-2xl mb-4">Chưa có nội dung</p>
                <p>Chọn một khối từ bên trái để bắt đầu</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-8">
                    {sections.map(section => (
                      <SortableItem key={section.id} id={section.id}>
                        <EditableBlock
                          section={section}
                          selectedColor={selectedColor}
                          onUpdate={(content) => updateSection(section.id, content)}
                          onRemove={() => removeSection(section.id)}
                        />
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}