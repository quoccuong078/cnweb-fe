// src/components/Editor/ImageUploader.jsx
import { useRef } from "react";

const ImageUploader = ({ currentImage = "", onImageChange, className = "" }) => {
    const fileInputRef = useRef(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => onImageChange(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleRemove = () => onImageChange("");

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {currentImage ? (
                <div className="relative group w-full h-full">
                    <img
                        src={currentImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300" // ← THÊM object-cover
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
                    className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-600 hover:text-gray-600 transition bg-gray-50"
                >
                    <span className="text-5xl">+</span>
                </button>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
            />
            {!currentImage && <span className="text-xs text-gray-500 mt-2">Click để upload ảnh</span>}
        </div>
    );
};

export default ImageUploader;