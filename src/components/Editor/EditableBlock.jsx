// components/Editor/EditableBlock.jsx
import React, { useState } from "react";

const EditableBlock = ({ block, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(block.data || {});

  const handleSave = () => {
    onUpdate(block.uid, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(block.data || {});
    setIsEditing(false);
  };

  // Render content based on block type
  const renderContent = () => {
    switch (block.type) {
      case "hero":
        return isEditing ? (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-20 rounded-xl shadow p-6">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className="text-5xl font-bold mb-3 bg-transparent border-b border-white text-center w-full"
              placeholder="Nhập tiêu đề..."
            />
            <textarea
              value={editedContent.subtitle || ""}
              onChange={(e) => setEditedContent({...editedContent, subtitle: e.target.value})}
              className="text-lg text-blue-100 mb-6 bg-transparent border-b border-blue-300 text-center w-full"
              placeholder="Nhập mô tả..."
              rows="2"
            />
            <input
              value={editedContent.buttonText || ""}
              onChange={(e) => setEditedContent({...editedContent, buttonText: e.target.value})}
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold text-center w-48"
              placeholder="Văn bản nút"
            />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-20 rounded-xl shadow">
            <h1 className="text-5xl font-bold mb-3">{block.data?.title || "Chào mừng đến với Landing Page"}</h1>
            <p className="text-lg text-blue-100 mb-6">
              {block.data?.subtitle || "Giải pháp thiết kế web hiện đại, chuyên nghiệp và nhanh chóng"}
            </p>
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              {block.data?.buttonText || "Bắt đầu ngay"}
            </button>
          </div>
        );

      case "about":
        return isEditing ? (
          <div className="bg-white border border-blue-100 rounded-xl p-8 shadow">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className="text-3xl font-semibold text-blue-700 mb-4 text-center w-full border-b border-gray-300"
              placeholder="Tiêu đề về chúng tôi..."
            />
            <textarea
              value={editedContent.content || ""}
              onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
              className="text-gray-600 text-center max-w-3xl mx-auto w-full border border-gray-300 rounded p-2"
              placeholder="Nội dung giới thiệu..."
              rows="4"
            />
          </div>
        ) : (
          <div className="bg-white border border-blue-100 rounded-xl p-8 shadow">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4 text-center">
              {block.data?.title || "Về Chúng Tôi"}
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              {block.data?.content || "Chúng tôi là đội ngũ chuyên phát triển các giải pháp số toàn diện, giúp doanh nghiệp tăng tốc trong thời đại công nghệ 4.0."}
            </p>
          </div>
        );

      // Thêm các case khác tương tự...
      
      default:
        return <div>{block.content}</div>;
    }
  };

  return (
    <div className="relative group">
      {renderContent()}
      
      {/* Control buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
            >
              ✏️ Sửa
            </button>
            <button
              onClick={onRemove}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
            >
              🗑️ Xóa
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
            >
              💾 Lưu
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600"
            >
              ❌ Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableBlock;