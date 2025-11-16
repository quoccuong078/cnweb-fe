// src/components/Editor/EditableBlock.jsx
import { useEffect, useRef, useState } from "react";

// Hàm utility để lấy class màu dựa trên màu chủ đạo
// Hàm utility để lấy class màu dựa trên màu chủ đạo - FIXED VERSION
const getColorClasses = (baseColor, colorVariant = '600') => {
  const validColors = ['blue', 'green', 'red', 'purple', 'orange', 'pink', 'gray', 'teal'];
  if (!validColors.includes(baseColor)) {
    console.warn(`Invalid color "${baseColor}", falling back to blue`);
    baseColor = 'blue';
  }

  // Map các variant thành các class cụ thể đã được safelist
  const colorMap = {
    blue: {
      '100': { bg: 'bg-blue-100', text: 'text-blue-100', border: 'border-blue-100', hover: 'hover:bg-blue-200' },
      '200': { bg: 'bg-blue-200', text: 'text-blue-200', border: 'border-blue-200', hover: 'hover:bg-blue-300' },
      '300': { bg: 'bg-blue-300', text: 'text-blue-300', border: 'border-blue-300', hover: 'hover:bg-blue-400' },
      '400': { bg: 'bg-blue-400', text: 'text-blue-400', border: 'border-blue-400', hover: 'hover:bg-blue-500' },
      '500': { 
        bg: 'bg-blue-500', 
        text: 'text-blue-500', 
        border: 'border-blue-500', 
        gradient: 'from-blue-500 to-blue-400',
        hover: 'hover:bg-blue-600',
        light: 'bg-blue-300'
      },
      '600': { 
        bg: 'bg-blue-600', 
        text: 'text-blue-600', 
        border: 'border-blue-600', 
        gradient: 'from-blue-600 to-blue-500',
        hover: 'hover:bg-blue-700',
        light: 'bg-blue-400'
      },
      '700': { 
        bg: 'bg-blue-700', 
        text: 'text-blue-700', 
        border: 'border-blue-700', 
        gradient: 'from-blue-700 to-blue-600',
        hover: 'hover:bg-blue-800',
        light: 'bg-blue-500'
      },
      '800': { bg: 'bg-blue-800', text: 'text-blue-800', border: 'border-blue-800', hover: 'hover:bg-blue-900' },
      '900': { bg: 'bg-blue-900', text: 'text-blue-900', border: 'border-blue-900', hover: 'hover:bg-blue-900' }
    },
    green: {
      '100': { bg: 'bg-green-100', text: 'text-green-100', border: 'border-green-100', hover: 'hover:bg-green-200' },
      '200': { bg: 'bg-green-200', text: 'text-green-200', border: 'border-green-200', hover: 'hover:bg-green-300' },
      '300': { bg: 'bg-green-300', text: 'text-green-300', border: 'border-green-300', hover: 'hover:bg-green-400' },
      '400': { bg: 'bg-green-400', text: 'text-green-400', border: 'border-green-400', hover: 'hover:bg-green-500' },
      '500': { 
        bg: 'bg-green-500', 
        text: 'text-green-500', 
        border: 'border-green-500', 
        gradient: 'from-green-500 to-green-400',
        hover: 'hover:bg-green-600',
        light: 'bg-green-300'
      },
      '600': { 
        bg: 'bg-green-600', 
        text: 'text-green-600', 
        border: 'border-green-600', 
        gradient: 'from-green-600 to-green-500',
        hover: 'hover:bg-green-700',
        light: 'bg-green-400'
      },
      '700': { 
        bg: 'bg-green-700', 
        text: 'text-green-700', 
        border: 'border-green-700', 
        gradient: 'from-green-700 to-green-600',
        hover: 'hover:bg-green-800',
        light: 'bg-green-500'
      },
      '800': { bg: 'bg-green-800', text: 'text-green-800', border: 'border-green-800', hover: 'hover:bg-green-900' },
      '900': { bg: 'bg-green-900', text: 'text-green-900', border: 'border-green-900', hover: 'hover:bg-green-900' }
    },
    red: {
      '100': { bg: 'bg-red-100', text: 'text-red-100', border: 'border-red-100', hover: 'hover:bg-red-200' },
      '200': { bg: 'bg-red-200', text: 'text-red-200', border: 'border-red-200', hover: 'hover:bg-red-300' },
      '300': { bg: 'bg-red-300', text: 'text-red-300', border: 'border-red-300', hover: 'hover:bg-red-400' },
      '400': { bg: 'bg-red-400', text: 'text-red-400', border: 'border-red-400', hover: 'hover:bg-red-500' },
      '500': { 
        bg: 'bg-red-500', 
        text: 'text-red-500', 
        border: 'border-red-500', 
        gradient: 'from-red-500 to-red-400',
        hover: 'hover:bg-red-600',
        light: 'bg-red-300'
      },
      '600': { 
        bg: 'bg-red-600', 
        text: 'text-red-600', 
        border: 'border-red-600', 
        gradient: 'from-red-600 to-red-500',
        hover: 'hover:bg-red-700',
        light: 'bg-red-400'
      },
      '700': { 
        bg: 'bg-red-700', 
        text: 'text-red-700', 
        border: 'border-red-700', 
        gradient: 'from-red-700 to-red-600',
        hover: 'hover:bg-red-800',
        light: 'bg-red-500'
      },
      '800': { bg: 'bg-red-800', text: 'text-red-800', border: 'border-red-800', hover: 'hover:bg-red-900' },
      '900': { bg: 'bg-red-900', text: 'text-red-900', border: 'border-red-900', hover: 'hover:bg-red-900' }
    },
    purple: {
      '100': { bg: 'bg-purple-100', text: 'text-purple-100', border: 'border-purple-100', hover: 'hover:bg-purple-200' },
      '200': { bg: 'bg-purple-200', text: 'text-purple-200', border: 'border-purple-200', hover: 'hover:bg-purple-300' },
      '300': { bg: 'bg-purple-300', text: 'text-purple-300', border: 'border-purple-300', hover: 'hover:bg-purple-400' },
      '400': { bg: 'bg-purple-400', text: 'text-purple-400', border: 'border-purple-400', hover: 'hover:bg-purple-500' },
      '500': { 
        bg: 'bg-purple-500', 
        text: 'text-purple-500', 
        border: 'border-purple-500', 
        gradient: 'from-purple-500 to-purple-400',
        hover: 'hover:bg-purple-600',
        light: 'bg-purple-300'
      },
      '600': { 
        bg: 'bg-purple-600', 
        text: 'text-purple-600', 
        border: 'border-purple-600', 
        gradient: 'from-purple-600 to-purple-500',
        hover: 'hover:bg-purple-700',
        light: 'bg-purple-400'
      },
      '700': { 
        bg: 'bg-purple-700', 
        text: 'text-purple-700', 
        border: 'border-purple-700', 
        gradient: 'from-purple-700 to-purple-600',
        hover: 'hover:bg-purple-800',
        light: 'bg-purple-500'
      },
      '800': { bg: 'bg-purple-800', text: 'text-purple-800', border: 'border-purple-800', hover: 'hover:bg-purple-900' },
      '900': { bg: 'bg-purple-900', text: 'text-purple-900', border: 'border-purple-900', hover: 'hover:bg-purple-900' }
    },
    orange: {
      '100': { bg: 'bg-orange-100', text: 'text-orange-100', border: 'border-orange-100', hover: 'hover:bg-orange-200' },
      '200': { bg: 'bg-orange-200', text: 'text-orange-200', border: 'border-orange-200', hover: 'hover:bg-orange-300' },
      '300': { bg: 'bg-orange-300', text: 'text-orange-300', border: 'border-orange-300', hover: 'hover:bg-orange-400' },
      '400': { bg: 'bg-orange-400', text: 'text-orange-400', border: 'border-orange-400', hover: 'hover:bg-orange-500' },
      '500': { 
        bg: 'bg-orange-500', 
        text: 'text-orange-500', 
        border: 'border-orange-500', 
        gradient: 'from-orange-500 to-orange-400',
        hover: 'hover:bg-orange-600',
        light: 'bg-orange-300'
      },
      '600': { 
        bg: 'bg-orange-600', 
        text: 'text-orange-600', 
        border: 'border-orange-600', 
        gradient: 'from-orange-600 to-orange-500',
        hover: 'hover:bg-orange-700',
        light: 'bg-orange-400'
      },
      '700': { 
        bg: 'bg-orange-700', 
        text: 'text-orange-700', 
        border: 'border-orange-700', 
        gradient: 'from-orange-700 to-orange-600',
        hover: 'hover:bg-orange-800',
        light: 'bg-orange-500'
      },
      '800': { bg: 'bg-orange-800', text: 'text-orange-800', border: 'border-orange-800', hover: 'hover:bg-orange-900' },
      '900': { bg: 'bg-orange-900', text: 'text-orange-900', border: 'border-orange-900', hover: 'hover:bg-orange-900' }
    },
    pink: {
      '100': { bg: 'bg-pink-100', text: 'text-pink-100', border: 'border-pink-100', hover: 'hover:bg-pink-200' },
      '200': { bg: 'bg-pink-200', text: 'text-pink-200', border: 'border-pink-200', hover: 'hover:bg-pink-300' },
      '300': { bg: 'bg-pink-300', text: 'text-pink-300', border: 'border-pink-300', hover: 'hover:bg-pink-400' },
      '400': { bg: 'bg-pink-400', text: 'text-pink-400', border: 'border-pink-400', hover: 'hover:bg-pink-500' },
      '500': { 
        bg: 'bg-pink-500', 
        text: 'text-pink-500', 
        border: 'border-pink-500', 
        gradient: 'from-pink-500 to-pink-400',
        hover: 'hover:bg-pink-600',
        light: 'bg-pink-300'
      },
      '600': { 
        bg: 'bg-pink-600', 
        text: 'text-pink-600', 
        border: 'border-pink-600', 
        gradient: 'from-pink-600 to-pink-500',
        hover: 'hover:bg-pink-700',
        light: 'bg-pink-400'
      },
      '700': { 
        bg: 'bg-pink-700', 
        text: 'text-pink-700', 
        border: 'border-pink-700', 
        gradient: 'from-pink-700 to-pink-600',
        hover: 'hover:bg-pink-800',
        light: 'bg-pink-500'
      },
      '800': { bg: 'bg-pink-800', text: 'text-pink-800', border: 'border-pink-800', hover: 'hover:bg-pink-900' },
      '900': { bg: 'bg-pink-900', text: 'text-pink-900', border: 'border-pink-900', hover: 'hover:bg-pink-900' }
    },
    gray: {
      '100': { bg: 'bg-gray-100', text: 'text-gray-100', border: 'border-gray-100', hover: 'hover:bg-gray-200' },
      '200': { bg: 'bg-gray-200', text: 'text-gray-200', border: 'border-gray-200', hover: 'hover:bg-gray-300' },
      '300': { bg: 'bg-gray-300', text: 'text-gray-300', border: 'border-gray-300', hover: 'hover:bg-gray-400' },
      '400': { bg: 'bg-gray-400', text: 'text-gray-400', border: 'border-gray-400', hover: 'hover:bg-gray-500' },
      '500': { 
        bg: 'bg-gray-500', 
        text: 'text-gray-500', 
        border: 'border-gray-500', 
        gradient: 'from-gray-500 to-gray-400',
        hover: 'hover:bg-gray-600',
        light: 'bg-gray-300'
      },
      '600': { 
        bg: 'bg-gray-600', 
        text: 'text-gray-600', 
        border: 'border-gray-600', 
        gradient: 'from-gray-600 to-gray-500',
        hover: 'hover:bg-gray-700',
        light: 'bg-gray-400'
      },
      '700': { 
        bg: 'bg-gray-700', 
        text: 'text-gray-700', 
        border: 'border-gray-700', 
        gradient: 'from-gray-700 to-gray-600',
        hover: 'hover:bg-gray-800',
        light: 'bg-gray-500'
      },
      '800': { bg: 'bg-gray-800', text: 'text-gray-800', border: 'border-gray-800', hover: 'hover:bg-gray-900' },
      '900': { bg: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-900', hover: 'hover:bg-gray-900' }
    },
    teal: {
      '100': { bg: 'bg-teal-100', text: 'text-teal-100', border: 'border-teal-100', hover: 'hover:bg-teal-200' },
      '200': { bg: 'bg-teal-200', text: 'text-teal-200', border: 'border-teal-200', hover: 'hover:bg-teal-300' },
      '300': { bg: 'bg-teal-300', text: 'text-teal-300', border: 'border-teal-300', hover: 'hover:bg-teal-400' },
      '400': { bg: 'bg-teal-400', text: 'text-teal-400', border: 'border-teal-400', hover: 'hover:bg-teal-500' },
      '500': { 
        bg: 'bg-teal-500', 
        text: 'text-teal-500', 
        border: 'border-teal-500', 
        gradient: 'from-teal-500 to-teal-400',
        hover: 'hover:bg-teal-600',
        light: 'bg-teal-300'
      },
      '600': { 
        bg: 'bg-teal-600', 
        text: 'text-teal-600', 
        border: 'border-teal-600', 
        gradient: 'from-teal-600 to-teal-500',
        hover: 'hover:bg-teal-700',
        light: 'bg-teal-400'
      },
      '700': { 
        bg: 'bg-teal-700', 
        text: 'text-teal-700', 
        border: 'border-teal-700', 
        gradient: 'from-teal-700 to-teal-600',
        hover: 'hover:bg-teal-800',
        light: 'bg-teal-500'
      },
      '800': { bg: 'bg-teal-800', text: 'text-teal-800', border: 'border-teal-800', hover: 'hover:bg-teal-900' },
      '900': { bg: 'bg-teal-900', text: 'text-teal-900', border: 'border-teal-900', hover: 'hover:bg-teal-900' }
    },
  };

  // Lấy class cho màu và variant cụ thể
  const colorClasses = colorMap[baseColor]?.[colorVariant] || colorMap.blue[colorVariant];
  
  console.log(`Color classes for ${baseColor}-${colorVariant}:`, colorClasses);
  return colorClasses;
};

// Component ImageUploader (giữ nguyên)
const ImageUploader = ({ currentImage, onImageChange, className = "" }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Image selected:", file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("Image loaded:", e.target.result);
        onImageChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    console.log("Removing image");
    onImageChange("");
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {currentImage ? (
        <div className="relative group">
          <img 
            src={currentImage} 
            alt="Uploaded" 
            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-40"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            console.log("Opening file input");
            fileInputRef.current?.click();
          }}
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 transition"
        >
          <span className="text-2xl">+</span>
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <span className="text-xs text-gray-500 mt-1">Click để upload</span>
    </div>
  );
};

const EditableBlock = ({ block, onUpdate, onRemove, selectedColor = "blue" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(block.data || {});
  const blockType = block.type || block.id;

  // Debug trạng thái
  useEffect(() => {
    console.log(`Block ${blockType} isEditing changed to:`, isEditing);
  }, [isEditing, blockType]);

  useEffect(() => {
    console.log(`Block ${blockType} editedContent changed to:`, editedContent);
  }, [editedContent, blockType]);

  // SỬ DỤNG HÀM getColorClasses MỚI - GIỮ NGUYÊN
  const color = getColorClasses(selectedColor, '600');
  const colorLight = getColorClasses(selectedColor, '500');
  const colorText = getColorClasses(selectedColor, '700');

  const handleSave = (e) => {
    e.stopPropagation();
    console.log("Saving content:", editedContent);
    onUpdate(block.uid, editedContent);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    console.log("Cancelling edit, reverting to:", block.data);
    setEditedContent(block.data || {});
    setIsEditing(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    console.log("Edit button clicked, current isEditing:", isEditing);
    setIsEditing(true);
  };

  const handleImageChange = (fieldName, imageUrl) => {
    console.log(`Updating image for ${fieldName}:`, imageUrl);
    setEditedContent(prev => ({
      ...prev,
      [fieldName]: imageUrl,
    }));
  };

  const renderContent = () => {
    console.log(`Rendering ${blockType}, isEditing: ${isEditing}, selectedColor: ${selectedColor}`);
    switch (blockType) {
      case "header":
        return isEditing ? (
          <div className="bg-white shadow-md border-b border-gray-200 py-4 px-6 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ImageUploader
                  currentImage={editedContent.logoImage}
                  onImageChange={(url) => handleImageChange('logoImage', url)}
                />
                <input
                  value={editedContent.logoText || ""}
                  onChange={(e) => {
                    console.log("Updating logoText:", e.target.value);
                    setEditedContent({...editedContent, logoText: e.target.value});
                  }}
                  className={`text-2xl font-bold ${colorText.text} bg-transparent border-b border-gray-300 focus:outline-none z-20 pointer-events-auto`}
                  placeholder="Tên công ty..."
                />
              </div>
              <div className="flex gap-4">
                {['menu1', 'menu2', 'menu3', 'menu4'].map((menu, index) => (
                  <input
                    key={menu}
                    value={editedContent[menu] || ""}
                    onChange={(e) => {
                      console.log(`Updating ${menu}:`, e.target.value);
                      setEditedContent({...editedContent, [menu]: e.target.value});
                    }}
                    className={`text-gray-700 ${colorText.text} font-medium bg-transparent border-b border-gray-300 w-24 text-center focus:outline-none z-20 pointer-events-auto`}
                    placeholder={`Menu ${index + 1}`}
                  />
                ))}
              </div>
              <input
                value={editedContent.buttonText || ""}
                onChange={(e) => {
                  console.log("Updating buttonText:", e.target.value);
                  setEditedContent({...editedContent, buttonText: e.target.value});
                }}
                className={`text-white px-4 py-2 rounded-lg font-medium ${color.bg} focus:outline-none z-20 pointer-events-auto`}
                placeholder="Văn bản nút"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md border-b border-gray-200 py-4 px-6 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {block.data?.logoImage && (
                  <img 
                    src={block.data.logoImage} 
                    alt="Logo" 
                    className="w-10 h-10 object-contain"
                  />
                )}
                <h1 className={`text-2xl font-bold ${colorText.text}`}>
                  {block.data?.logoText || "YourLogo"}
                </h1>
              </div>
              <div className="flex gap-4">
                {['menu1', 'menu2', 'menu3', 'menu4'].map((menu) => (
                  <a key={menu} href="#" className={`text-gray-700 hover:${colorText.text} font-medium`}>
                    {block.data?.[menu] || `Menu ${menu.slice(-1)}`}
                  </a>
                ))}
              </div>
              <button className={`text-white px-4 py-2 rounded-lg font-medium transition ${color.bg} ${color.hover}`}>
                {block.data?.buttonText || "Liên hệ"}
              </button>
            </div>
          </div>
        );

      case "hero":
        return isEditing ? (
          <div className={`bg-gradient-to-r ${color.gradient} text-white text-center py-20 rounded-xl shadow p-6 relative`}>
            {editedContent.backgroundImage && (
              <img 
                src={editedContent.backgroundImage} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-20"
              />
            )}
            <div className="relative z-10">
              <input
                value={editedContent.title || ""}
                onChange={(e) => {
                  console.log("Updating title:", e.target.value);
                  setEditedContent({...editedContent, title: e.target.value});
                }}
                className="text-5xl font-bold mb-3 bg-transparent border-b border-white text-center w-full placeholder-white placeholder-opacity-70 focus:outline-none"
                placeholder="Nhập tiêu đề..."
              />
              <textarea
                value={editedContent.subtitle || ""}
                onChange={(e) => {
                  console.log("Updating subtitle:", e.target.value);
                  setEditedContent({...editedContent, subtitle: e.target.value});
                }}
                className="text-lg text-white mb-6 bg-transparent border-b border-white text-center w-full placeholder-white placeholder-opacity-70 focus:outline-none"
                placeholder="Nhập mô tả..."
                rows="2"
              />
              <div className="flex justify-center gap-4 items-center">
                <input
                  value={editedContent.buttonText || ""}
                  onChange={(e) => {
                    console.log("Updating buttonText:", e.target.value);
                    setEditedContent({...editedContent, buttonText: e.target.value});
                  }}
                  className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold text-center w-48 focus:outline-none"
                  placeholder="Văn bản nút"
                />
                <ImageUploader
                  currentImage={editedContent.backgroundImage}
                  onImageChange={(url) => handleImageChange('backgroundImage', url)}
                  className="!w-16 !h-16"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-r ${color.gradient} text-white text-center py-20 rounded-xl shadow relative`}>
            {block.data?.backgroundImage && (
              <img 
                src={block.data.backgroundImage} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-20"
              />
            )}
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-3">{block.data?.title || "Chào mừng đến với Landing Page"}</h1>
              <p className="text-lg text-white mb-6">
                {block.data?.subtitle || "Giải pháp thiết kế web hiện đại, chuyên nghiệp và nhanh chóng"}
              </p>
              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                {block.data?.buttonText || "Bắt đầu ngay"}
              </button>
            </div>
          </div>
        );

      case "about":
        return isEditing ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-4 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề về chúng tôi..."
            />
            <div className="flex gap-6 items-start">
              <ImageUploader
                currentImage={editedContent.aboutImage}
                onImageChange={(url) => handleImageChange('aboutImage', url)}
                className="!w-40 !h-40"
              />
              <textarea
                value={editedContent.content || ""}
                onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
                className="text-gray-600 flex-1 border border-gray-300 rounded p-2 min-h-[160px] focus:outline-none"
                placeholder="Nội dung giới thiệu..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-4 text-center`}>
              {block.data?.title || "Về Chúng Tôi"}
            </h2>
            <div className="flex gap-6 items-center">
              {block.data?.aboutImage && (
                <img 
                  src={block.data.aboutImage} 
                  alt="About us" 
                  className="w-40 h-40 object-cover rounded-lg"
                />
              )}
              <p className="text-gray-600 flex-1">
                {block.data?.content || "Chúng tôi là đội ngũ chuyên phát triển các giải pháp số toàn diện, giúp doanh nghiệp tăng tốc trong thời đại công nghệ 4.0."}
              </p>
            </div>
          </div>
        );

      case "team":
        return isEditing ? (
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-8 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề đội ngũ..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['member1', 'member2', 'member3'].map((member, index) => (
                <div key={member} className="bg-white p-6 rounded-lg text-center shadow-sm">
                  <ImageUploader
                    currentImage={editedContent[`${member}Image`]}
                    onImageChange={(url) => handleImageChange(`${member}Image`, url)}
                    className="!w-24 !h-24 mx-auto mb-4"
                  />
                  <input
                    value={editedContent[member] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [member]: e.target.value})}
                    className="text-xl font-semibold text-gray-800 mb-2 w-full border-b border-gray-300 text-center focus:outline-none"
                    placeholder={`Thành viên ${index + 1}...`}
                  />
                  <input
                    value={editedContent[`${member}Role`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${member}Role`]: e.target.value})}
                    className={`${colorText.text} mb-2 w-full border-b border-gray-300 text-center focus:outline-none`}
                    placeholder="Vị trí..."
                  />
                  <textarea
                    value={editedContent[`${member}Desc`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${member}Desc`]: e.target.value})}
                    className="text-gray-600 text-sm w-full border border-gray-300 rounded p-2 focus:outline-none"
                    placeholder="Mô tả..."
                    rows="2"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-8 text-center`}>
              {block.data?.title || "Đội Ngũ Của Chúng Tôi"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['member1', 'member2', 'member3'].map((member, index) => (
                <div key={member} className="bg-white p-6 rounded-lg text-center shadow-sm">
                  {block.data?.[`${member}Image`] && (
                    <img 
                      src={block.data[`${member}Image`]} 
                      alt={block.data?.[member] || `Thành viên ${index + 1}`}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {block.data?.[member] || `Thành viên ${index + 1}`}
                  </h3>
                  <p className={`${colorText.text} mb-2`}>{block.data?.[`${member}Role`] || "Vị trí"}</p>
                  <p className="text-gray-600 text-sm">
                    {block.data?.[`${member}Desc`] || `Mô tả về thành viên ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "services":
        return isEditing ? (
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-8 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề dịch vụ..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['service1', 'service2', 'service3'].map((service, index) => (
                <div key={service} className="text-center p-4">
                  <ImageUploader
                    currentImage={editedContent[`${service}Image`]}
                    onImageChange={(url) => handleImageChange(`${service}Image`, url)}
                    className="!w-16 !h-16 mx-auto mb-4"
                  />
                  <input
                    value={editedContent[service] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [service]: e.target.value})}
                    className="text-lg font-semibold text-gray-800 mb-2 w-full border-b border-gray-300 text-center focus:outline-none"
                    placeholder={`Dịch vụ ${index + 1}...`}
                  />
                  <textarea
                    value={editedContent[`${service}Desc`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${service}Desc`]: e.target.value})}
                    className="text-gray-600 w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                    placeholder="Mô tả dịch vụ..."
                    rows="3"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-8 text-center`}>
              {block.data?.title || "Dịch Vụ Của Chúng Tôi"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['service1', 'service2', 'service3'].map((service, index) => (
                <div key={service} className="text-center p-4">
                  {block.data?.[`${service}Image`] && (
                    <img 
                      src={block.data[`${service}Image`]} 
                      alt={block.data?.[service] || `Dịch vụ ${index + 1}`}
                      className="w-16 h-16 object-contain mx-auto mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {block.data?.[service] || `Dịch vụ ${index + 1}`}
                  </h3>
                  <p className="text-gray-600">
                    {block.data?.[`${service}Desc`] || `Mô tả chi tiết cho dịch vụ ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "testimonials":
        return isEditing ? (
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-8 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề đánh giá..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['testimonial1', 'testimonial2', 'testimonial3'].map((testimonial, index) => (
                <div key={testimonial} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageUploader
                      currentImage={editedContent[`${testimonial}Avatar`]}
                      onImageChange={(url) => handleImageChange(`${testimonial}Avatar`, url)}
                      className="!w-12 !h-12"
                    />
                    <input
                      value={editedContent[`${testimonial}Author`] || ""}
                      onChange={(e) => setEditedContent({...editedContent, [`${testimonial}Author`]: e.target.value})}
                      className="text-gray-900 font-semibold flex-1 border-b border-gray-300 focus:outline-none"
                      placeholder="Tên tác giả..."
                    />
                  </div>
                  <textarea
                    value={editedContent[testimonial] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [testimonial]: e.target.value})}
                    className="text-gray-700 italic mb-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    placeholder={`Đánh giá ${index + 1}...`}
                    rows="3"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-8 text-center`}>
              {block.data?.title || "Khách Hàng Nói Gì"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['testimonial1', 'testimonial2', 'testimonial3'].map((testimonial, index) => (
                <div key={testimonial} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    {block.data?.[`${testimonial}Avatar`] && (
                      <img 
                        src={block.data[`${testimonial}Avatar`]} 
                        alt={block.data?.[`${testimonial}Author`] || `Khách hàng ${index + 1}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <p className="text-gray-900 font-semibold">
                      {block.data?.[`${testimonial}Author`] || `Khách hàng ${index + 1}`}
                    </p>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "{block.data?.[testimonial] || `Đánh giá mẫu ${index + 1} từ khách hàng hài lòng.`}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return isEditing ? (
          <div className={`${color.bg} text-white p-8 rounded-xl shadow`}>
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className="text-3xl font-bold mb-6 text-center w-full bg-transparent border-b border-gray-300 focus:outline-none"
              placeholder="Tiêu đề liên hệ..."
            />
            <div className="max-w-md mx-auto space-y-4">
              <input
                value={editedContent.namePlaceholder || ""}
                onChange={(e) => setEditedContent({...editedContent, namePlaceholder: e.target.value})}
                className="w-full p-3 rounded text-gray-800 border border-gray-300 focus:outline-none"
                placeholder="Placeholder tên..."
              />
              <input
                value={editedContent.emailPlaceholder || ""}
                onChange={(e) => setEditedContent({...editedContent, emailPlaceholder: e.target.value})}
                className="w-full p-3 rounded text-gray-800 border border-gray-300 focus:outline-none"
                placeholder="Placeholder email..."
              />
              <textarea
                value={editedContent.messagePlaceholder || ""}
                onChange={(e) => setEditedContent({...editedContent, messagePlaceholder: e.target.value})}
                className="w-full p-3 rounded text-gray-800 border border-gray-300 h-32 focus:outline-none"
                placeholder="Placeholder tin nhắn..."
              />
              <input
                value={editedContent.buttonText || ""}
                onChange={(e) => setEditedContent({...editedContent, buttonText: e.target.value})}
                className="bg-white text-gray-800 px-6 py-3 rounded font-semibold w-full focus:outline-none"
                placeholder="Văn bản nút..."
              />
            </div>
          </div>
        ) : (
          <div className={`${color.bg} text-white p-8 rounded-xl shadow`}>
            <h2 className="text-3xl font-bold mb-6 text-center">
              {block.data?.title || "Liên Hệ Với Chúng Tôi"}
            </h2>
            <form className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                placeholder={block.data?.namePlaceholder || "Họ và tên"}
                className="w-full p-3 rounded text-gray-800"
              />
              <input
                type="email"
                placeholder={block.data?.emailPlaceholder || "Email"}
                className="w-full p-3 rounded text-gray-800"
              />
              <textarea
                placeholder={block.data?.messagePlaceholder || "Nội dung tin nhắn..."}
                className="w-full p-3 rounded text-gray-800 h-32"
              />
              <button className={`bg-white ${colorText.text} px-6 py-3 rounded font-semibold w-full hover:bg-gray-100 transition`}>
                {block.data?.buttonText || "Gửi tin nhắn"}
              </button>
            </form>
          </div>
        );

      case "footer":
        return isEditing ? (
          <div className="bg-gray-800 text-white p-8 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ImageUploader
                    currentImage={editedContent.logoImage}
                    onImageChange={(url) => handleImageChange('logoImage', url)}
                    className="!w-12 !h-12"
                  />
                  <input
                    value={editedContent.logoText || ""}
                    onChange={(e) => setEditedContent({...editedContent, logoText: e.target.value})}
                    className="text-2xl font-bold mb-4 bg-transparent border-b border-gray-600 w-full focus:outline-none"
                    placeholder="Tên công ty..."
                  />
                </div>
                <textarea
                  value={editedContent.description || ""}
                  onChange={(e) => setEditedContent({...editedContent, description: e.target.value})}
                  className="text-gray-300 text-sm bg-transparent border border-gray-600 rounded p-2 w-full focus:outline-none"
                  placeholder="Mô tả công ty..."
                  rows="3"
                />
              </div>
              {['links1', 'links2', 'links3'].map((links, index) => (
                <div key={links}>
                  <input
                    value={editedContent[`${links}Title`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${links}Title`]: e.target.value})}
                    className="font-semibold mb-3 bg-transparent border-b border-gray-600 w-full focus:outline-none"
                    placeholder={`Tiêu đề ${index + 1}...`}
                  />
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <input
                        key={item}
                        value={editedContent[`${links}Item${item}`] || ""}
                        onChange={(e) => setEditedContent({...editedContent, [`${links}Item${item}`]: e.target.value})}
                        className="text-gray-300 text-sm block bg-transparent border-b border-gray-600 w-full focus:outline-none"
                        placeholder={`Mục ${item}...`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-6 pt-6 text-center">
              <input
                value={editedContent.copyright || ""}
                onChange={(e) => setEditedContent({...editedContent, copyright: e.target.value})}
                className="text-gray-400 text-sm bg-transparent border-b border-gray-600 w-full text-center focus:outline-none"
                placeholder="Bản quyền..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 text-white p-8 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {block.data?.logoImage && (
                    <img 
                      src={block.data.logoImage} 
                      alt="Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <h3 className="text-2xl font-bold">
                    {block.data?.logoText || "YourLogo"}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {block.data?.description || "Mô tả ngắn về công ty và các dịch vụ cung cấp."}
                </p>
              </div>
              {['links1', 'links2', 'links3'].map((links, index) => (
                <div key={links}>
                  <h4 className="font-semibold mb-3">
                    {block.data?.[`${links}Title`] || `Liên kết ${index + 1}`}
                  </h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <a key={item} href="#" className="text-gray-300 text-sm block hover:text-white transition">
                        {block.data?.[`${links}Item${item}`] || `Mục ${item}`}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-6 pt-6 text-center">
              <p className="text-gray-400 text-sm">
                {block.data?.copyright || "© 2024 Your Company. All rights reserved."}
              </p>
            </div>
          </div>
        );

      case "features":
        return isEditing ? (
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-8 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề tính năng..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['feature1', 'feature2', 'feature3'].map((feature, index) => (
                <div key={feature} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageUploader
                      currentImage={editedContent[`${feature}Icon`]}
                      onImageChange={(url) => handleImageChange(`${feature}Icon`, url)}
                      className="!w-12 !h-12"
                    />
                    <input
                      value={editedContent[feature] || ""}
                      onChange={(e) => setEditedContent({...editedContent, [feature]: e.target.value})}
                      className="text-xl font-semibold text-gray-800 mb-2 flex-1 border-b border-gray-300 focus:outline-none"
                      placeholder={`Tính năng ${index + 1}...`}
                    />
                  </div>
                  <textarea
                    value={editedContent[`${feature}Desc`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${feature}Desc`]: e.target.value})}
                    className="text-gray-600 w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                    placeholder="Mô tả tính năng..."
                    rows="3"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-8 text-center`}>
              {block.data?.title || "Tính Năng Nổi Bật"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['feature1', 'feature2', 'feature3'].map((feature, index) => (
                <div key={feature} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  {block.data?.[`${feature}Icon`] && (
                    <img 
                      src={block.data[`${feature}Icon`]} 
                      alt={block.data?.[feature] || `Tính năng ${index + 1}`}
                      className="w-12 h-12 object-contain mx-auto mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {block.data?.[feature] || `Tính năng ${index + 1}`}
                  </h3>
                  <p className="text-gray-600">
                    {block.data?.[`${feature}Desc`] || `Mô tả chi tiết cho tính năng ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "pricing":
        return isEditing ? (
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-8 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề bảng giá..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['plan1', 'plan2', 'plan3'].map((plan, index) => (
                <div key={plan} className={`bg-white p-6 rounded-lg shadow-sm border-2 ${editedContent[`${plan}Featured`] ? color.border : 'border-gray-200'} text-center relative`}>
                  {editedContent[`${plan}Featured`] && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${color.bg} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      Phổ biến
                    </div>
                  )}
                  <input
                    value={editedContent[plan] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [plan]: e.target.value})}
                    className="text-xl font-semibold text-gray-800 mb-2 w-full border-b border-gray-300 text-center focus:outline-none"
                    placeholder={`Gói ${index + 1}...`}
                  />
                  <input
                    value={editedContent[`${plan}Price`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${plan}Price`]: e.target.value})}
                    className={`text-2xl font-bold ${colorText.text} mb-4 w-full border-b border-gray-300 text-center focus:outline-none`}
                    placeholder="Giá..."
                  />
                  <textarea
                    value={editedContent[`${plan}Features`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${plan}Features`]: e.target.value})}
                    className="text-gray-600 w-full border border-gray-300 rounded p-2 text-sm mb-4 focus:outline-none"
                    placeholder="Tính năng (mỗi dòng 1 tính năng)..."
                    rows="4"
                  />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={!!editedContent[`${plan}Featured`]}
                      onChange={(e) => setEditedContent({...editedContent, [`${plan}Featured`]: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Nổi bật</span>
                  </div>
                  <input
                    value={editedContent[`${plan}Button`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`${plan}Button`]: e.target.value})}
                    className={`${color.bg} text-white px-4 py-2 rounded w-full border border-gray-300 text-center focus:outline-none`}
                    placeholder="Văn bản nút..."
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-8 text-center`}>
              {block.data?.title || "Bảng Giá"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['plan1', 'plan2', 'plan3'].map((plan, index) => (
                <div key={plan} className={`bg-white p-6 rounded-lg shadow-sm border-2 ${block.data?.[`${plan}Featured`] ? color.border : 'border-gray-200'} text-center relative`}>
                  {block.data?.[`${plan}Featured`] && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${color.bg} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      Phổ biến
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {block.data?.[plan] || `Gói ${index + 1}`}
                  </h3>
                  <p className={`text-2xl font-bold ${colorText.text} mb-4`}>
                    {block.data?.[`${plan}Price`] || `${(index + 1) * 499}k`}
                  </p>
                  <div className="text-gray-600 mb-4 text-sm">
                    {(block.data?.[`${plan}Features`] || `Tính năng 1\nTính năng 2\nTính năng 3`).split('\n').map((feature, i) => (
                      <p key={i} className="mb-1">✓ {feature}</p>
                    ))}
                  </div>
                  <button className={`${color.bg} text-white px-4 py-2 rounded w-full ${color.hover} transition`}>
                    {block.data?.[`${plan}Button`] || "Đăng ký ngay"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return isEditing ? (
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <input
              value={editedContent.title || ""}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
              className={`text-3xl font-semibold ${colorText.text} mb-8 text-center w-full border-b border-gray-300 focus:outline-none`}
              placeholder="Tiêu đề FAQ..."
            />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      value={editedContent[`question${num}`] || ""}
                      onChange={(e) => setEditedContent({...editedContent, [`question${num}`]: e.target.value})}
                      className="text-lg font-semibold text-gray-800 mb-2 flex-1 border-b border-gray-300 focus:outline-none"
                      placeholder={`Câu hỏi ${num}...`}
                    />
                    <button
                      onClick={() => {
                        const newContent = {...editedContent};
                        delete newContent[`question${num}`];
                        delete newContent[`answer${num}`];
                        setEditedContent(newContent);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                    >
                      Xóa
                    </button>
                  </div>
                  <textarea
                    value={editedContent[`answer${num}`] || ""}
                    onChange={(e) => setEditedContent({...editedContent, [`answer${num}`]: e.target.value})}
                    className="text-gray-600 w-full border border-gray-300 rounded p-2 mt-2 focus:outline-none"
                    placeholder={`Câu trả lời ${num}...`}
                    rows="3"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const currentCount = Object.keys(editedContent).filter(key => key.startsWith('question')).length;
                  if (currentCount < 10) {
                    const newNum = currentCount + 1;
                    setEditedContent({
                      ...editedContent,
                      [`question${newNum}`]: "",
                      [`answer${newNum}`]: ""
                    });
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + Thêm câu hỏi
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
            <h2 className={`text-3xl font-semibold ${colorText.text} mb-8 text-center`}>
              {block.data?.title || "Câu Hỏi Thường Gặp"}
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5].map((num) => {
                const question = block.data?.[`question${num}`];
                const answer = block.data?.[`answer${num}`];
                
                if (!question && !answer) return null;
                
                return (
                  <div key={num} className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {question || `Câu hỏi mẫu ${num}?`}
                    </h3>
                    <p className="text-gray-600">
                      {answer || `Câu trả lời mẫu cho câu hỏi ${num}.`}
                    </p>
                  </div>
                );
              }).filter(Boolean)}
              
              {!Object.keys(block.data || {}).some(key => key.startsWith('question')) && (
                <>
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {`Câu hỏi mẫu ${num}?`}
                      </h3>
                      <p className="text-gray-600">
                        {`Câu trả lời mẫu cho câu hỏi ${num}.`}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );

      default:
        return <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">Khối không xác định: {blockType}</div>;
    }
  };

return (
    <div className="relative group w-full min-h-[100px] bg-gray-50 z-30">
      {renderContent()}
      
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition z-40 pointer-events-none">
        {!isEditing ? (
          <>
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 z-40 pointer-events-auto"
            >
              ✏️ Sửa
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 z-40 pointer-events-auto"
            >
              🗑️ Xóa
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 z-40 pointer-events-auto"
            >
              💾 Lưu
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white text-xs px-2 py-1 rounded hover:bg-gray-600 z-40 pointer-events-auto"
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