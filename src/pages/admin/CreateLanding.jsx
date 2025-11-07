import React, { useState } from "react";

const CreateLanding = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("");

  const templates = [
    {
      id: 1,
      name: "Classic",
      description: "Giao diện cổ điển, phù hợp giới thiệu doanh nghiệp truyền thống.",
      preview: "https://via.placeholder.com/300x150/1d4ed8/ffffff?text=Classic",
    },
    {
      id: 2,
      name: "Modern",
      description: "Phong cách hiện đại, tối giản, hình ảnh lớn bắt mắt.",
      preview: "https://via.placeholder.com/300x150/2563eb/ffffff?text=Modern",
    },
    {
      id: 3,
      name: "Creative",
      description: "Thiết kế sáng tạo, hiệu ứng động, phù hợp startup công nghệ.",
      preview: "https://via.placeholder.com/300x150/3b82f6/ffffff?text=Creative",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !slug || !template) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    alert(`Đã tạo landing page: ${title} (${slug}) với mẫu ${template}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Tạo Trang Landing Mới
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề trang
          </label>
          <input
            type="text"
            placeholder="Nhập tiêu đề..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            placeholder="ví dụ: cong-ty-abc"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chọn giao diện (Template)
          </label>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {templates.map((item) => (
              <div
                key={item.id}
                onClick={() => setTemplate(item.name)}
                className={`border rounded-lg overflow-hidden cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg ${
                  template === item.name
                    ? "border-blue-500 ring-2 ring-blue-400"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-blue-700 font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-medium transition"
          >
            Tạo Trang
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLanding;