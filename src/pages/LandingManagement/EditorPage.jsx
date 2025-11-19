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
import EditableBlock from "../../components/Editor/EditableBlock";
import { SortableItem } from "../../components/Editor/SortableItem";

// Danh sách template section mặc định (sau này có thể lấy từ DB Template)
const sectionTemplates = {
  header: { SectionType: "header", Content: JSON.stringify({ logoText: "YourLogo", menu1: "Trang chủ", menu2: "Giới thiệu", menu3: "Dịch vụ", menu4: "Liên hệ", buttonText: "Liên hệ" }) },
  hero: { SectionType: "hero", Content: JSON.stringify({ title: "Chào mừng đến với chúng tôi", subtitle: "Giải pháp toàn diện cho doanh nghiệp của bạn", buttonText: "Bắt đầu ngay" }) },
  about: { SectionType: "about", Content: JSON.stringify({ title: "Về Chúng Tôi", content: "Chúng tôi là đội ngũ chuyên nghiệp..." }) },
  features: { SectionType: "features", Content: JSON.stringify({ title: "Tính Năng Nổi Bật", feature1: "Tốc độ cao", feature2: "Bảo mật", feature3: "Dễ sử dụng" }) },
  services: { SectionType: "services", Content: JSON.stringify({ title: "Dịch Vụ", service1: "Thiết kế web", service2: "Marketing", service3: "Tư vấn" }) },
  stats: { SectionType: "stats", Content: JSON.stringify({ title: "Thành Tựu Của Chúng Tôi", stat1Number: "100+", stat1: "Dự án hoàn thành", stat2Number: "50+", stat2: "Khách hàng", stat3Number: "99%", stat3: "Hài lòng", stat4Number: "24/7", stat4: "Hỗ trợ" }) },
  team: { SectionType: "team", Content: JSON.stringify({ title: "Đội Ngũ", member1: "Nguyễn Văn A", member1Role: "CEO", member2: "Trần Thị B", member2Role: "CTO", member3: "Lê Văn C", member3Role: "Designer" }) },
  testimonials: { SectionType: "testimonials", Content: JSON.stringify({ title: "Khách Hàng Nói Gì", testimonial1: "Dịch vụ tuyệt vời!", testimonial1Author: "Khách hàng A", testimonial2: "Rất chuyên nghiệp", testimonial2Author: "Khách hàng B" }) },
  pricing: { SectionType: "pricing", Content: JSON.stringify({ 
    title: "Bảng Giá", 
    plan1: "Cơ bản", plan1Price: "499k", plan1Features: "Feature 1\nFeature 2", plan1Featured: false,
    plan2: "Pro", plan2Price: "999k", plan2Features: "All Basic +\nSupport 24/7", plan2Featured: true,
    plan3: "Enterprise", plan3Price: "1.999k", plan3Features: "Tất cả + Custom", plan3Featured: false,
    plan1Button: "Chọn gói", plan2Button: "Chọn gói", plan3Button: "Liên hệ"
  })},
  faq: { SectionType: "faq", Content: JSON.stringify({ title: "Câu Hỏi Thường Gặp", question1: "Làm sao để bắt đầu?", answer1: "Đăng ký và chọn template..." }) },
  contact: { SectionType: "contact", Content: JSON.stringify({ title: "Liên Hệ", namePlaceholder: "Họ tên", emailPlaceholder: "Email", messagePlaceholder: "Nội dung", buttonText: "Gửi tin nhắn" }) },
  footer: { SectionType: "footer", Content: JSON.stringify({ logoText: "YourLogo", description: "© 2025 Công ty của bạn. All rights reserved." }) },
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

const EditorPage = () => {
  // Giả lập dữ liệu trang (sẽ được load từ API sau)
  const [page, setPage] = useState({
    id: null,
    title: "Trang mới",
    slug: "trang-moi",
    pageSections: [],
    pageConfiguration: { customColors: "blue", templateId: 1 }
  });

  const [sections, setSections] = useState(page.pageSections);
  const [selectedColor, setSelectedColor] = useState(page.pageConfiguration?.customColors || "blue");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Đồng bộ màu khi thay đổi
  useEffect(() => {
    setPage(prev => ({
      ...prev,
      pageConfiguration: { ...prev.pageConfiguration, customColors: selectedColor }
    }));
  }, [selectedColor]);

  const addSection = (type) => {
    const template = sectionTemplates[type];
    const newSection = {
      id: Date.now(), // tạm, backend sẽ sinh Id thật
      sectionType: template.SectionType,
      content: template.Content,
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id, newContentString) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: newContentString } : s));
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = sections.findIndex(s => s.id === active.id);
    const newIdx = sections.findIndex(s => s.id === over.id);
    const reordered = arrayMove(sections, oldIdx, newIdx);
    reordered.forEach((s, idx) => s.order = idx);
    setSections(reordered);
  };

  const handleSave = () => {
    const dataToSave = {
      ...page,
      pageSections: sections.map(s => ({ ...s, id: undefined })), // bỏ id tạm
      pageConfiguration: { ...page.pageConfiguration, customColors: selectedColor }
    };
    console.log("DỮ LIỆU SẼ GỬI LÊN SERVER (phù hợp 100% với CSDL):", dataToSave);
    alert("Đã lưu thành công! Xem console để thấy dữ liệu đúng cấu trúc DB.");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar - Fixed on scroll */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto py-6 px-4 lg:px-6">
          <div className="space-y-6">
            {/* Thêm khối nội dung - 2 cột */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-bold mb-4">Thêm khối nội dung</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(sectionTemplates).map(key => (
                  <button
                    key={key}
                    onClick={() => addSection(key)}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left text-sm capitalize font-medium transition-colors hover:border-blue-300 hover:shadow-sm"
                  >
                    {sectionTemplates[key].SectionType}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu chủ đạo */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-bold mb-4">Màu chủ đạo</h2>
              <div className="grid grid-cols-4 gap-3">
                {colorThemes.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-12 h-12 rounded-full bg-${c.value}-500 border-4 transition-all transform hover:scale-110 ${
                      selectedColor === c.value ? 'border-black scale-110 shadow-lg' : 'border-gray-300'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas - Scrollable content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8 m-6">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 lg:mb-8 border-b pb-4 gap-4">
            <input
              type="text"
              value={page.title}
              onChange={e => setPage({ ...page, title: e.target.value })}
              className="text-2xl lg:text-3xl font-bold border-none outline-none w-full text-center lg:text-left bg-transparent"
              placeholder="Tiêu đề trang"
            />
            <button 
              onClick={handleSave} 
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap text-sm lg:text-base"
            >
              Lưu Trang
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-16 lg:py-20 text-gray-400">
              <p className="text-lg lg:text-xl mb-2">Chưa có khối nào</p>
              <p className="text-sm lg:text-base">Chọn khối từ bên trái để thêm</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-6 lg:space-y-10">
                  {sections.map(section => (
                    <SortableItem key={section.id} id={section.id}>
                      <EditableBlock
                        section={section}
                        selectedColor={selectedColor}
                        onUpdate={newContent => updateSection(section.id, newContent)}
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
  );
};

export default EditorPage;