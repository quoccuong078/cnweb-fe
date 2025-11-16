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

const availableBlocks = [
  {
    id: "header",
    name: "Header",
    preview: "Đầu trang với menu và logo",
    data: {
      logoText: "YourLogo",
      menu1: "Trang chủ",
      menu2: "Giới thiệu",
      menu3: "Dịch vụ",
      menu4: "Liên hệ",
      buttonText: "Liên hệ",
    },
  },
  {
    id: "hero",
    name: "Hero Section",
    preview: "Phần mở đầu với tiêu đề và nút CTA",
    data: {
      title: "Chào mừng đến với Landing Page",
      subtitle: "Giải pháp thiết kế web hiện đại, chuyên nghiệp và nhanh chóng",
      buttonText: "Bắt đầu ngay",
    },
  },
  {
    id: "about",
    name: "About Section",
    preview: "Giới thiệu doanh nghiệp / sản phẩm",
    data: {
      title: "Về Chúng Tôi",
      desc: "Chúng tôi là đội ngũ chuyên phát triển các giải pháp số toàn diện, giúp doanh nghiệp tăng tốc trong thời đại công nghệ 4.0.",
    },
  },
  {
    id: "features",
    name: "Features Section",
    preview: "Liệt kê các tính năng nổi bật",
    data: {
      title: "Tính Năng Nổi Bật",
      feature1: "Hiệu suất cao",
      feature2: "Thiết kế đẹp",
      feature3: "Bảo mật cao",
    },
  },
  {
    id: "services",
    name: "Services Section",
    preview: "Các dịch vụ cung cấp",
    data: {
      title: "Dịch Vụ Của Chúng Tôi",
      service1: "Thiết kế Web",
      service2: "Marketing Online",
      service3: "Tư vấn giải pháp",
    },
  },
  {
    id: "team",
    name: "Team Section",
    preview: "Giới thiệu đội ngũ",
    data: {
      title: "Đội Ngũ Của Chúng Tôi",
      member1: "Nguyễn Văn A",
      member2: "Trần Thị B",
      member3: "Lê Văn C",
    },
  },
  {
    id: "testimonials",
    name: "Testimonials Section",
    preview: "Phản hồi khách hàng",
    data: {
      title: "Khách Hàng Nói Gì",
      customer1: "Dịch vụ tuyệt vời! Trang web hoạt động nhanh và chuyên nghiệp.",
      customer2: "Hỗ trợ rất tốt, thiết kế đẹp mắt.",
      customer3: "Chất lượng vượt mong đợi!",
    },
  },
  {
    id: "pricing",
    name: "Pricing Section",
    preview: "Bảng giá gói dịch vụ",
    data: {
      title: "Bảng Giá",
      plan1: "Cơ bản - 499k",
      plan2: "Nâng cao - 999k",
      plan3: "Doanh nghiệp - 1.999k",
    },
  },
  {
    id: "faq",
    name: "FAQ Section",
    preview: "Các câu hỏi thường gặp",
    data: {
      title: "Câu Hỏi Thường Gặp",
      question1: "Làm sao để bắt đầu?",
      answer1: "Chọn template và chỉnh sửa theo ý muốn.",
      question2: "Có thể dùng thử miễn phí không?",
      answer2: "Có, bạn được dùng thử 7 ngày miễn phí.",
      question3: "Tôi có thể nâng cấp gói dịch vụ không?",
      answer3: "Hoàn toàn có thể, liên hệ hỗ trợ.",
    },
  },
  {
    id: "contact",
    name: "Contact Section",
    preview: "Liên hệ với chúng tôi",
    data: {
      title: "Liên Hệ",
      namePlaceholder: "Họ và tên",
      emailPlaceholder: "Email",
      messagePlaceholder: "Nội dung...",
      button: "Gửi Liên Hệ",
    },
  },
  {
    id: "footer",
    name: "Footer",
    preview: "Chân trang với thông tin và liên kết",
    data: {
      logoText: "YourLogo",
      description: "Mô tả ngắn về công ty và các dịch vụ cung cấp.",
      links1Title: "Liên kết nhanh",
      links1Item1: "Trang chủ",
      links1Item2: "Giới thiệu",
      links1Item3: "Dịch vụ",
      links2Title: "Hỗ trợ",
      links2Item1: "FAQ",
      links2Item2: "Liên hệ",
      links2Item3: "Hỗ trợ",
      links3Title: "Pháp lý",
      links3Item1: "Điều khoản",
      links3Item2: "Bảo mật",
      links3Item3: "Cookie",
      copyright: "© 2024 Your Company. All rights reserved."
    },
  },
];

const colorThemes = [
  { name: "Xanh dương", value: "blue", class: "bg-blue-500" },
  { name: "Xanh lá", value: "green", class: "bg-green-500" },
  { name: "Đỏ", value: "red", class: "bg-red-500" },
  { name: "Tím", value: "purple", class: "bg-purple-500" },
  { name: "Cam", value: "orange", class: "bg-orange-500" },
  { name: "Hồng", value: "pink", class: "bg-pink-500" },
  { name: "Xám", value: "gray", class: "bg-gray-500" },
  { name: "Xanh ngọc", value: "teal", class: "bg-teal-500" },
];

const EditorPage = () => {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [selectedColor, setSelectedColor] = useState("blue");

  // Debug selectedColor
  useEffect(() => {
    console.log("Selected color changed to:", selectedColor);
  }, [selectedColor]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addBlock = (block) => {
    console.log("Adding block:", block.id);
    setCanvasBlocks([...canvasBlocks, {
      ...block,
      uid: Date.now().toString(),
      type: block.id,
    }]);
  };

  const removeBlock = (uid) => {
    console.log("Removing block with uid:", uid);
    setCanvasBlocks(canvasBlocks.filter((b) => b.uid !== uid));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      console.log(`Dragging block from ${active.id} to ${over.id}`);
      const oldIndex = canvasBlocks.findIndex((b) => b.uid === active.id);
      const newIndex = canvasBlocks.findIndex((b) => b.uid === over.id);
      setCanvasBlocks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleColorChange = (colorValue) => {
    console.log("Changing color to:", colorValue);
    setSelectedColor(colorValue);
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="col-span-1 bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Khối có sẵn</h2>
        <div className="space-y-3">
          {availableBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => addBlock(block)}
              className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-800">{block.name}</span>
              <div className="text-xs text-gray-500">{block.preview}</div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Màu sắc chủ đạo</h2>
          <div className="grid grid-cols-4 gap-2">
            {colorThemes.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full ${color.class} border-2 ${selectedColor === color.value ? 'border-gray-800' : 'border-transparent'} hover:scale-110 transition-transform`}
                title={color.name}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Đang chọn: {colorThemes.find(c => c.value === selectedColor)?.name || "Chưa chọn"}
          </p>
        </div>
      </div>

      <div className="col-span-3 bg-gray-50 rounded-xl shadow-inner p-6 border border-dashed border-gray-200 min-h-[70vh]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Khu vực thiết kế (Drag & Drop)</h2>
        {canvasBlocks.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có khối nào. Hãy chọn khối bên trái để thêm vào trang.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={canvasBlocks.map((b) => b.uid)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {canvasBlocks.map((block) => (
                  <SortableItem key={block.uid} id={block.uid}>
                    <EditableBlock
                      block={block}
                      selectedColor={selectedColor}
                      onUpdate={(uid, newData) => {
                        console.log(`Updating block ${uid} with data:`, newData);
                        setCanvasBlocks(blocks => 
                          blocks.map(b => b.uid === uid ? {...b, data: newData} : b)
                        );
                      }}
                      onRemove={() => removeBlock(block.uid)}
                    />
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <div className="mt-6 text-right">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => alert("Chưa có chức năng lưu")}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;