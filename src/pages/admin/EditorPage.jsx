import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
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
import { SortableItem } from "../../components/Editor/SortableItem.jsx";

const availableBlocks = [
  {
    id: "hero",
    name: "Hero Section",
    preview: "Phần mở đầu với tiêu đề và nút CTA",
    data: {
      title: "Chào mừng đến với Landing Page",
      desc: "Giải pháp thiết kế web hiện đại, chuyên nghiệp và nhanh chóng",
      button: "Bắt đầu ngay",
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
];

const EditorPage = () => {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addBlock = (block) => {
    setCanvasBlocks([...canvasBlocks, { ...block, uid: Date.now().toString() }]);
  };

  const removeBlock = (uid) => {
    setCanvasBlocks(canvasBlocks.filter((b) => b.uid !== uid));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = canvasBlocks.findIndex((b) => b.uid === active.id);
      const newIndex = canvasBlocks.findIndex((b) => b.uid === over.id);
      setCanvasBlocks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const updateBlockText = (uid, field, value) => {
    setCanvasBlocks((blocks) =>
      blocks.map((b) =>
        b.uid === uid ? { ...b, data: { ...b.data, [field]: value } } : b
      )
    );
  };

  const renderBlock = (block) => {
    switch (block.id) {
      case "hero":
        return (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-28 px-6 rounded-3xl shadow-lg relative overflow-hidden">
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateBlockText(block.uid, "title", e.target.textContent)}
              className="text-6xl font-extrabold mb-4 editable outline-none"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {block.data.title}
            </h1>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateBlockText(block.uid, "desc", e.target.textContent)}
              className="text-xl text-indigo-100 mb-8 editable outline-none"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {block.data.desc}
            </p>
            <button
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateBlockText(block.uid, "button", e.target.textContent)}
              className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition editable outline-none"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {block.data.button}
            </button>
          </div>
        );

      case "about":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-200">
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateBlockText(block.uid, "title", e.target.textContent)}
              className="text-4xl font-bold text-indigo-700 mb-4 editable outline-none"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {block.data.title}
            </h2>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateBlockText(block.uid, "desc", e.target.textContent)}
              className="text-gray-600 text-lg editable outline-none"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {block.data.desc}
            </p>
          </div>
        );

      case "features":
        return (
            <div className="bg-gray-50 p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateBlockText(block.uid, "title", e.target.textContent)}
                className="text-4xl font-bold text-indigo-700 mb-8 text-center editable outline-none"
                onPointerDown={(e) => e.stopPropagation()}
            >
                {block.data.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {["feature1", "feature2", "feature3"].map((f, i) => (
                <div
                    key={i}
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 text-center"
                >
                    <div className="text-5xl mb-4">✨</div>
                    <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockText(block.uid, f, e.target.textContent)}
                    className="font-semibold text-indigo-700 text-xl editable outline-none"
                    onPointerDown={(e) => e.stopPropagation()}
                    >
                    {block.data[f]}
                    </p>
                </div>
                ))}
            </div>
            </div>
        );

        // SERVICES
        case "services":
        return (
            <div className="bg-gray-50 p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateBlockText(block.uid, "title", e.target.textContent)}
                className="text-4xl font-bold text-purple-700 mb-8 text-center editable outline-none"
                onPointerDown={(e) => e.stopPropagation()}
            >
                {block.data.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {["service1", "service2", "service3"].map((s, i) => (
                <div
                    key={i}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 text-center"
                >
                    <div className="text-5xl mb-4">💼</div>
                    <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockText(block.uid, s, e.target.textContent)}
                    className="font-semibold text-purple-700 text-xl editable outline-none"
                    onPointerDown={(e) => e.stopPropagation()}
                    >
                    {block.data[s]}
                    </p>
                </div>
                ))}
            </div>
            </div>
        );

        // TEAM
        case "team":
        return (
            <div className="bg-gray-50 p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateBlockText(block.uid, "title", e.target.textContent)}
                className="text-4xl font-bold text-indigo-700 mb-8 text-center editable outline-none"
                onPointerDown={(e) => e.stopPropagation()}
            >
                {block.data.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {["member1", "member2", "member3"].map((m, i) => (
                <div
                    key={i}
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-200 flex items-center justify-center text-3xl">
                    👤
                    </div>
                    <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockText(block.uid, m, e.target.textContent)}
                    className="font-semibold text-indigo-700 text-xl editable outline-none"
                    onPointerDown={(e) => e.stopPropagation()}
                    >
                    {block.data[m]}
                    </p>
                </div>
                ))}
            </div>
            </div>
        );

      case "testimonials":
        return (
          <div className="bg-purple-50 p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e)=>updateBlockText(block.uid,"title",e.target.textContent)}
              className="text-3xl font-bold text-purple-700 mb-6 text-center editable outline-none"
              onPointerDown={(e)=>e.stopPropagation()}
            >
              {block.data.title}
            </h2>
            {["customer1","customer2","customer3"].map((c,i)=>(
              <blockquote
                key={i}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e)=>updateBlockText(block.uid,c,e.target.textContent)}
                className="italic text-gray-700 mb-4 border-l-4 border-purple-300 pl-4 editable outline-none"
                onPointerDown={(e)=>e.stopPropagation()}
              >
                {block.data[c]}
              </blockquote>
            ))}
          </div>
        );

      case "pricing":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e)=>updateBlockText(block.uid,"title",e.target.textContent)}
              className="text-3xl font-bold text-indigo-700 mb-6 text-center editable outline-none"
              onPointerDown={(e)=>e.stopPropagation()}
            >
              {block.data.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["plan1","plan2","plan3"].map((p,i)=>(
                <div key={i} className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e)=>updateBlockText(block.uid,p,e.target.textContent)}
                    className="font-semibold text-indigo-700 editable outline-none"
                    onPointerDown={(e)=>e.stopPropagation()}
                  >
                    {block.data[p]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e)=>updateBlockText(block.uid,"title",e.target.textContent)}
              className="text-3xl font-bold text-indigo-700 mb-6 text-center editable outline-none"
              onPointerDown={(e)=>e.stopPropagation()}
            >
              {block.data.title}
            </h2>
            {["question1","answer1","question2","answer2","question3","answer3"].map((q,i)=>(
              <p
                key={i}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e)=>updateBlockText(block.uid,q,e.target.textContent)}
                className={`mb-2 ${i%2===0?"font-semibold text-indigo-700":"text-gray-700"} editable outline-none`}
                onPointerDown={(e)=>e.stopPropagation()}
              >
                {block.data[q]}
              </p>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="bg-indigo-600 text-white rounded-2xl p-10 shadow-lg">
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e)=>updateBlockText(block.uid,"title",e.target.textContent)}
              className="text-3xl font-bold mb-6 text-center editable outline-none"
              onPointerDown={(e)=>e.stopPropagation()}
            >
              {block.data.title}
            </h2>
            <form className="max-w-xl mx-auto space-y-4">
              {["namePlaceholder","emailPlaceholder","messagePlaceholder"].map((f,i)=>(
                f==="messagePlaceholder" ?
                <textarea
                  key={i}
                  placeholder={block.data[f]}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e)=>updateBlockText(block.uid,f,e.target.value)}
                  className="w-full rounded-xl p-4 text-black h-32 outline-none editable"
                  onPointerDown={(e)=>e.stopPropagation()}
                /> :
                <input
                  key={i}
                  type={f.includes("email")?"email":"text"}
                  placeholder={block.data[f]}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e)=>updateBlockText(block.uid,f,e.target.value)}
                  className="w-full rounded-xl p-4 text-black outline-none editable"
                  onPointerDown={(e)=>e.stopPropagation()}
                />
              ))}
              <button
                contentEditable
                suppressContentEditableWarning
                onBlur={(e)=>updateBlockText(block.uid,"button",e.target.textContent)}
                className="w-full bg-white text-indigo-700 py-3 rounded-full font-semibold hover:shadow-lg transition editable outline-none"
                onPointerDown={(e)=>e.stopPropagation()}
              >
                {block.data.button}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 bg-white rounded-xl shadow-md p-4 border border-blue-100">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Khối có sẵn</h2>
        <div className="space-y-3">
          {availableBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => addBlock(block)}
              className="w-full text-left px-3 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              <span className="font-medium text-blue-700">{block.name}</span>
              <div className="text-xs text-gray-500">{block.preview}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-3 bg-gray-50 rounded-xl shadow-inner p-6 border border-dashed border-blue-200 min-h-[70vh]">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">Khu vực thiết kế (Drag & Drop)</h2>
        {canvasBlocks.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có khối nào. Hãy chọn khối bên trái để thêm vào trang.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            cancel=".editable"
          >
            <SortableContext
              items={canvasBlocks.map((b) => b.uid)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {canvasBlocks.map((block) => (
                  <SortableItem key={block.uid} id={block.uid}>
                    <div className="relative group">
                      {renderBlock(block)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block.uid);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        Xóa
                      </button>
                    </div>
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