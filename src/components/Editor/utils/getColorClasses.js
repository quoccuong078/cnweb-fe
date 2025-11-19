// src/components/Editor/utils/getColorClasses.js

/**
 * Trả về các class Tailwind tương ứng với màu chủ đạo và độ đậm
 * Đã được safelist đầy đủ trong tailwind.config.js
 */
export const getColorClasses = (baseColor, variant = "600") => {
    const validColors = ["blue", "green", "red", "purple", "orange", "pink", "gray", "teal"];
    const color = validColors.includes(baseColor) ? baseColor : "blue";

    const colorMap = {
        blue: {
        500: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", hover: "hover:bg-blue-600", light: "bg-blue-300" },
        600: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600", hover: "hover:bg-blue-700", light: "bg-blue-400" },
        700: { bg: "bg-blue-700", text: "text-blue-700", border: "border-blue-700", hover: "hover:bg-blue-800" },
        },
        green: {
        500: { bg: "bg-green-500", text: "text-green-500", border: "border-green-500", hover: "hover:bg-green-600", light: "bg-green-300" },
        600: { bg: "bg-green-600", text: "text-green-600", border: "border-green-600", hover: "hover:bg-green-700", light: "bg-green-400" },
        700: { bg: "bg-green-700", text: "text-green-700", border: "border-green-700", hover: "hover:bg-green-800" },
        },
        red: {
        500: { bg: "bg-red-500", text: "text-red-500", border: "border-red-500", hover: "hover:bg-red-600", light: "bg-red-300" },
        600: { bg: "bg-red-600", text: "text-red-600", border: "border-red-600", hover: "hover:bg-red-700", light: "bg-red-400" },
        700: { bg: "bg-red-700", text: "text-red-700", border: "border-red-700", hover: "hover:bg-red-800" },
        },
        purple: {
        500: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", hover: "hover:bg-purple-600", light: "bg-purple-300" },
        600: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-600", hover: "hover:bg-purple-700", light: "bg-purple-400" },
        700: { bg: "bg-purple-700", text: "text-purple-700", border: "border-purple-700", hover: "hover:bg-purple-800" },
        },
        orange: {
        500: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", hover: "hover:bg-orange-600", light: "bg-orange-300" },
        600: { bg: "bg-orange-600", text: "text-orange-600", border: "border-orange-600", hover: "hover:bg-orange-700", light: "bg-orange-400" },
        700: { bg: "bg-orange-700", text: "text-orange-700", border: "border-orange-700", hover: "hover:bg-orange-800" },
        },
        pink: {
        500: { bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-500", hover: "hover:bg-pink-600", light: "bg-pink-300" },
        600: { bg: "bg-pink-600", text: "text-pink-600", border: "border-pink-600", hover: "hover:bg-pink-700", light: "bg-pink-400" },
        700: { bg: "bg-pink-700", text: "text-pink-700", border: "border-pink-700", hover: "hover:bg-pink-800" },
        },
        gray: {
        500: { bg: "bg-gray-500", text: "text-gray-500", border: "border-gray-500", hover: "hover:bg-gray-600", light: "bg-gray-300" },
        600: { bg: "bg-gray-600", text: "text-gray-600", border: "border-gray-600", hover: "hover:bg-gray-700", light: "bg-gray-400" },
        700: { bg: "bg-gray-700", text: "text-gray-700", border: "border-gray-700", hover: "hover:bg-gray-800" },
        },
        teal: {
        500: { bg: "bg-teal-500", text: "text-teal-500", border: "border-teal-500", hover: "hover:bg-teal-600", light: "bg-teal-300" },
        600: { bg: "bg-teal-600", text: "text-teal-600", border: "border-teal-600", hover: "hover:bg-teal-700", light: "bg-teal-400" },
        700: { bg: "bg-teal-700", text: "text-teal-700", border: "border-teal-700", hover: "hover:bg-teal-800" },
        },
    };

    return colorMap[color][variant] || colorMap.blue["600"];
};