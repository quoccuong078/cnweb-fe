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
import { FiArrowLeft, FiGlobe, FiSave } from "react-icons/fi"; // Thêm icon ArrowLeft
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import EditableBlock from "../../components/Editor/EditableBlock";
import { SortableItem } from "../../components/Editor/SortableItem";
import { createLanding, getCurrentUser, getLandingForEdit, getLandingForEditForSuperAdmin, updateLanding, updateLandingForSuperAdmin } from "../../services/api";

// ... (Giữ nguyên phần sectionTemplates và colorThemes như cũ)
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
  carousel: { sectionType: "carousel", content: JSON.stringify({
      title: "Dự án nổi bật",
      slides: [
        { image: "", caption: "Dự án 1 - Khách hàng lớn" },
        { image: "", caption: "Dự án 2 - Giải thưởng 2025" },
        { image: "", caption: "Dự án 3 - Hợp tác quốc tế" }
      ]
    })
  },
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
  const location = useLocation();
  const pageId = searchParams.get("id");
  const newPageData = location.state?.newPageData;

  const isSuperAdmin = location.pathname.includes("/superadmin");
  const [page, setPage] = useState({ 
      id: null, 
      title: "Trang mới", 
      slug: "trang-moi",
      templateId: 1,
      subdomain: "",
      status: "Draft" 
  });
  const [sections, setSections] = useState([]);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Load dữ liệu (Giữ nguyên logic)
  useEffect(() => {
    const loadPage = async () => {
      if (pageId) {
        try {
          // 2. CHỌN API LOAD DỮ LIỆU TÙY THEO QUYỀN
          let data;
          if (isSuperAdmin) {
             data = await getLandingForEditForSuperAdmin(pageId);
          } else {
             data = await getLandingForEdit(pageId);
          }
          
          let currentSubdomain = data.pageConfiguration?.subdomain;
          
          // Logic lấy fallback subdomain chỉ cần thiết cho Admin thường
          if (!currentSubdomain && !isSuperAdmin) {
             try {
                const user = await getCurrentUser();
                currentSubdomain = user.subdomain || user.tenantSubdomain || "";
             } catch(e) { console.warn("Lỗi lấy subdomain"); }
          }

          setPage({ 
            id: data.id, 
            title: data.title, 
            slug: data.slug,
            templateId: data.pageConfiguration?.templateId || 1,
            subdomain: currentSubdomain,
            status: data.status || "Draft"
          });

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
        return;
      }

      if (newPageData) {
        setPage({ 
            id: null, 
            title: newPageData.title, 
            slug: newPageData.slug,
            templateId: newPageData.pageConfiguration?.templateId || 1,
            subdomain: newPageData.pageConfiguration?.subdomain || "",
            status: "Draft"
        });
        
        setSelectedColor(newPageData.pageConfiguration.customColors);
        const defaultSections = newPageData.pageSections.map((s, index) => {
            const template = sectionTemplates[s.sectionType.toLowerCase()];
            return {
                id: Date.now() + Math.random() + index, 
                sectionType: s.sectionType,
                content: template ? template.content : JSON.stringify({}), 
                order: index
            };
        });
        setSections(defaultSections);
      }
      setLoading(false);
    };
    loadPage();
  }, [pageId, navigate, location.state, isSuperAdmin]);

  // Các hàm xử lý section (Giữ nguyên)
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
       // ... (Giữ nguyên payload cũ) ...
       title: page.title,
       slug: page.slug,
       status: page.status,
       customColors: selectedColor,
       templateId: page.templateId, 
       subdomain: page.subdomain,   
       pageSections: sections.map((s, idx) => ({
         id: (s.id > 2000000000) ? null : s.id, 
         sectionType: s.sectionType,
         content: typeof s.content === 'string' ? s.content : JSON.stringify(s.content), 
         order: idx
       }))
    };

    try {
      if (pageId) {
        // 3. CHỌN API UPDATE TÙY THEO QUYỀN
        if (isSuperAdmin) {
            await updateLandingForSuperAdmin(pageId, payload);
            alert("SuperAdmin: Cập nhật trang thành công!");
        } else {
            await updateLanding(pageId, payload);
            alert("Cập nhật trang thành công!");
        }
      } else {
        // Create thì thường chỉ Admin làm, nhưng nếu SuperAdmin create thì cần logic riêng (ít gặp)
        const res = await createLanding(payload);
        alert("Tạo trang mới thành công!");
        navigate(`/admin/editor?id=${res.id}`, { replace: true });
        setPage(prev => ({ ...prev, id: res.id }));
      }
    } catch (err) {
      console.error("Lỗi lưu trang:", err);
      alert("Lưu thất bại: " + (err.response?.data?.message || err.message));
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
    // SỬ DỤNG FLEX ROW CHO TOÀN TRANG, H-SCREEN ĐỂ KHÔNG BỊ SCROLL BODY
    <div className="flex flex-row h-screen bg-gray-100 overflow-hidden">
      
      {/* === 1. SIDEBAR (CỐ ĐỊNH, KHÔNG SCROLL THEO TRANG) === */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-30 shadow-xl">
        {/* Nút quay lại nằm ngay đầu Sidebar */}
        <div className="p-4 border-b border-gray-100">
            <button
                onClick={() => navigate(isSuperAdmin ? "/superadmin/landings" : "/admin/landing-management")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-full font-medium"
            >
                <FiArrowLeft className="w-5 h-5" />
                {isSuperAdmin ? "Về danh sách (SuperAdmin)" : "Quay lại quản lý"}
            </button>
        </div>

        {/* Phần nội dung cuộn được bên trong Sidebar */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Chọn Template */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Thêm thành phần</h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.keys(sectionTemplates).map(key => (
                    <button
                        key={key}
                        onClick={() => addSection(key)}
                        className="px-3 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:shadow-md hover:text-blue-700 text-left text-sm font-medium capitalize transition-all duration-200 bg-white"
                    >
                        {sectionTemplates[key].sectionType}
                    </button>
                    ))}
                </div>
            </div>

            {/* Chọn Màu */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Màu chủ đạo</h3>
                <div className="grid grid-cols-4 gap-3">
                    {colorThemes.map(c => (
                    <button
                        key={c.value}
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-12 h-12 rounded-full bg-${c.value}-500 border-2 transition-all ${
                        selectedColor === c.value 
                            ? "border-gray-800 ring-2 ring-offset-2 ring-gray-300 scale-110" 
                            : "border-transparent hover:scale-105"
                        }`}
                        title={c.name}
                    />
                    ))}
                </div>
            </div>
        </div>
      </aside>

      {/* === 2. MAIN AREA (HEADER + CANVAS) === */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        
        {/* HEADER CẢI TIẾN: Gọn gàng hơn, tách biệt Input và Action */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-20 shrink-0 h-24">
            
            {/* Cụm Thông tin trang (Title + Slug) - Xếp dọc */}
            <div className="flex flex-col justify-center flex-1 max-w-2xl mr-8">
                {/* Input Title: To, đậm, không viền (nhìn giống text thường) */}
                <input
                    type="text"
                    value={page.title}
                    onChange={e => setPage(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold text-gray-800 placeholder-gray-300 bg-transparent outline-none border-none p-0 focus:ring-0 w-full mb-1 hover:bg-gray-50 rounded px-1 -ml-1 transition-colors"
                    placeholder="Nhập tiêu đề trang..."
                />
                
                {/* Input Slug: Nhỏ, màu xám */}
                <div className="flex items-center text-sm text-gray-500 group">
                    <FiGlobe className="mr-1.5 text-gray-400 group-hover:text-blue-500" />
                    <span className="select-none text-gray-400">{page.subdomain}/</span>
                    <input
                        type="text"
                        value={page.slug}
                        onChange={e => setPage(prev => ({ ...prev, slug: e.target.value }))}
                        className="bg-transparent outline-none text-gray-600 font-medium hover:text-blue-600 focus:text-blue-600 min-w-[50px] ml-0.5 border-b border-transparent hover:border-gray-300 focus:border-blue-500 transition-all px-1"
                        placeholder="duong-dan-url"
                    />
                </div>
            </div>

            {/* Cụm Action (Status + Save) */}
            <div className="flex items-center gap-4">
                {/* Switch Trạng thái */}
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                     <button
                        onClick={() => setPage(prev => ({ ...prev, status: "Draft" }))}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            page.status === "Draft" 
                                ? "bg-white text-gray-800 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Nháp
                    </button>
                    <button
                        onClick={() => setPage(prev => ({ ...prev, status: "Published" }))}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            page.status === "Published" 
                                ? "bg-green-500 text-white shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Public
                    </button>
                </div>

                <div className="h-8 w-px bg-gray-200"></div>

                {/* Nút Lưu */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    {saving ? (
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <FiSave className="text-xl" />
                            <span>Lưu thay đổi</span>
                        </>
                    )}
                </button>
            </div>
        </header>

        {/* CANVAS EDITOR (SCROLLABLE AREA) */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto min-h-[800px] mb-20"> {/* Margin bottom để không bị sát đáy khi cuộn hết */}
                {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-xl border-2 border-dashed border-gray-300 text-gray-400">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                    </div>
                    <p className="text-xl font-medium mb-2">Trang chưa có nội dung</p>
                    <p className="text-sm">Chọn các thành phần từ cột bên trái để bắt đầu thiết kế</p>
                </div>
                ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-black/5">
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