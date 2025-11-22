// src/components/Editor/ImageUploader.jsx
import { useRef, useState } from "react";
import { uploadMedia } from "../../services/api"; // Import API upload

const ImageUploader = ({ currentImage = "", onImageChange, className = "" }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            // Gọi API upload lên server
            const imageUrl = await uploadMedia(file);
            
            // Trả về URL thay vì Base64
            onImageChange(imageUrl);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Lỗi tải ảnh lên server.");
        } finally {
            setUploading(false);
            // Reset input để cho phép chọn lại file giống cũ nếu cần
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemove = () => onImageChange("");

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {currentImage ? (
                <div className="relative group w-full h-full">
                    <img
                        src={currentImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition shadow-lg z-10"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-600 hover:text-gray-600 transition bg-gray-50"
                >
                    {uploading ? (
                        <span className="text-xs font-semibold animate-pulse">Đang tải...</span>
                    ) : (
                        <span className="text-5xl">+</span>
                    )}
                </button>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};

export default ImageUploader;