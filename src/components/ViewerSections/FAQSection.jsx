// src/components/ViewerSections/FAQSection.jsx
export default function FAQSection({ data, color = "blue" }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className={`text-4xl font-bold text-center mb-12 text-${color}-700`}>
          {data.title || "Câu Hỏi Thường Gặp"}
        </h2>
        <div className="space-y-6">
          {/* Bạn có thể mở rộng thành accordion nếu muốn */}
          <div className="border-b pb-4">
            <h3 className="font-bold text-lg">Câu hỏi 1?</h3>
            <p className="text-gray-700 mt-2">Trả lời chi tiết...</p>
          </div>
          {/* Thêm nhiều hơn nếu cần */}
        </div>
      </div>
    </section>
  );
}