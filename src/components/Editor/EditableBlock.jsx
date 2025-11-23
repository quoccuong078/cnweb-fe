// src/components/Editor/EditableBlock.jsx
import { useState } from "react";
import CarouselSection from "../ViewerSections/CarouselSection"; // ← THÊM DÒNG NÀY
import ImageUploader from "./ImageUploader";
import { getColorClasses } from "./utils/getColorClasses";

const EditableBlock = ({ section, selectedColor = "blue", onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Parse JSON từ section.content (DB lưu dạng string)
  const parseContent = () => {
    try {
      return JSON.parse(section.content || "{}");
    } catch (err) {
      console.error("Invalid JSON in section.content:", section.content);
      return {};
    }
  };

  const [editedContent, setEditedContent] = useState(parseContent());

  // Màu chủ đạo
  const color = getColorClasses(selectedColor, "600");
  const colorHover = getColorClasses(selectedColor, "600").hover || "hover:bg-blue-700";
  const colorText = getColorClasses(selectedColor, "700").text || "text-blue-700";

  const save = () => {
    onUpdate(JSON.stringify(editedContent));
    setIsEditing(false);
  };

  const cancel = () => {
    setEditedContent(parseContent());
    setIsEditing(false);
  };

  const updateField = (key, value) => {
    setEditedContent((prev) => ({ ...prev, [key]: value }));
  };

  const data = isEditing ? editedContent : parseContent();

  // ===================================================================
  // RENDER THEO SECTION TYPE
  // ===================================================================
  const renderSection = () => {
    const type = section.sectionType.toLowerCase();

    switch (type) {
      /* ====================== HEADER ====================== */
      case "header":
        return isEditing ? (
          <div className="bg-white border-b border-gray-200 py-5 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center px-6 gap-4">
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <ImageUploader currentImage={data.logoImage} onImageChange={(url) => updateField("logoImage", url)} className="w-16 h-16" />
                <input
                  value={data.logoText || ""}
                  onChange={(e) => updateField("logoText", e.target.value)}
                  className={`text-2xl font-bold ${colorText} bg-transparent border-b-2 border-gray-300 focus:outline-none w-full lg:min-w-[180px] px-2 py-1`}
                  placeholder="Tên thương hiệu"
                />
              </div>
              <div className="flex flex-wrap gap-4 justify-center w-full lg:w-auto">
                {["menu1", "menu2", "menu3", "menu4"].map((m) => (
                  <input
                    key={m}
                    value={data[m] || ""}
                    onChange={(e) => updateField(m, e.target.value)}
                    className="text-gray-700 font-medium w-28 text-center bg-transparent border-b border-gray-300 focus:outline-none px-2 py-1"
                    placeholder="Menu"
                  />
                ))}
              </div>
              <input
                value={data.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className={`${color.bg} text-white px-6 py-2 rounded-lg font-semibold w-full lg:w-auto text-center`}
                placeholder="Nút CTA"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white border-b border-gray-200 py-5 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center px-6 gap-4">
              <div className="flex items-center gap-4">
                {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-12 object-contain" />}
                <h1 className={`text-2xl font-bold ${colorText}`}>{data.logoText || "Your Brand"}</h1>
              </div>
              <nav className="flex flex-wrap gap-6 justify-center">
                {["menu1", "menu2", "menu3", "menu4"].map((m) => (
                  <a key={m} href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                    {data[m] || "Menu"}
                  </a>
                ))}
              </nav>
              <button className={`${color.bg} ${colorHover} text-white px-6 py-2 rounded-lg font-semibold transition w-full lg:w-auto`}>
                {data.buttonText || "Liên hệ"}
              </button>
            </div>
          </div>
        );

      /* ====================== HERO ====================== */
      case "hero":
        return isEditing ? (
          <div className={`relative ${color.bg} text-white py-20 text-center rounded-2xl overflow-hidden`}>
            {data.backgroundImage && <img src={data.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <input
                value={data.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                className="text-4xl lg:text-5xl font-bold bg-transparent border-b-2 border-white/50 w-full mb-6 placeholder-white/70 focus:outline-none text-center px-2 py-1"
                placeholder="Tiêu đề lớn"
              />
              <textarea
                value={data.subtitle || ""}
                onChange={(e) => updateField("subtitle", e.target.value)}
                rows={2}
                className="text-lg lg:text-xl bg-transparent w-full mb-8 placeholder-white/70 focus:outline-none text-center px-2 py-1 resize-none"
                placeholder="Mô tả ngắn"
              />
              <input
                value={data.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="bg-white text-gray-800 px-8 py-3 rounded-xl font-bold text-lg w-full lg:w-auto text-center"
                placeholder="Văn bản nút"
              />
              <div className="mt-6">
                <ImageUploader currentImage={data.backgroundImage} onImageChange={(url) => updateField("backgroundImage", url)} className="w-32 h-32 mx-auto" />
              </div>
            </div>
          </div>
        ) : (
          <div className={`relative ${color.bg} text-white py-20 text-center rounded-2xl overflow-hidden`}>
            {data.backgroundImage && <img src={data.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">{data.title || "Chào mừng bạn đến với chúng tôi"}</h1>
              <p className="text-lg lg:text-xl mb-8">{data.subtitle || "Giải pháp chuyên nghiệp, hiện đại và nhanh chóng"}</p>
              <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                {data.buttonText || "Bắt đầu ngay"}
              </button>
            </div>
          </div>
        );

      /* ====================== ABOUT ====================== */
      case "about":
        return isEditing ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-6 border-b-2 border-gray-300 focus:outline-none px-2 py-1`}
              placeholder="Về chúng tôi"
            />
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
              <ImageUploader currentImage={data.aboutImage} onImageChange={(url) => updateField("aboutImage", url)} className="w-full lg:w-80 h-64 lg:h-80 flex-shrink-0" />
              <textarea
                value={data.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                rows={6}
                className="flex-1 border border-gray-300 rounded-lg p-4 focus:outline-none resize-none"
                placeholder="Nội dung giới thiệu..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-6`}>{data.title || "Về Chúng Tôi"}</h2>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
              {data.aboutImage && <img src={data.aboutImage} alt="About" className="w-full lg:w-80 h-64 lg:h-80 object-cover rounded-lg" />}
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed flex-1">{data.content || "Mô tả công ty..."}</p>
            </div>
          </div>
        );

      /* ====================== FEATURES ====================== */
      case "features":
        return isEditing ? (
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-8 border-b-2 focus:outline-none px-2 py-1`}
              placeholder="Tính năng nổi bật"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["feature1", "feature2", "feature3"].map((f) => (
                <div key={f} className="bg-white p-6 rounded-xl shadow text-center">
                  <ImageUploader currentImage={data[`${f}Icon`]} onImageChange={(url) => updateField(`${f}Icon`, url)} className="w-16 h-16 mx-auto mb-4" />
                  <input
                    value={data[f] || ""}
                    onChange={(e) => updateField(f, e.target.value)}
                    className="text-xl font-bold mb-3 w-full border-b border-gray-300 focus:outline-none text-center px-2 py-1"
                    placeholder="Tên tính năng"
                  />
                  <textarea
                    value={data[`${f}Desc`] || ""}
                    onChange={(e) => updateField(`${f}Desc`, e.target.value)}
                    rows={2}
                    className="text-gray-600 w-full border border-gray-300 rounded p-3 focus:outline-none resize-none text-sm"
                    placeholder="Mô tả"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-8`}>{data.title || "Tính Năng Nổi Bật"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["feature1", "feature2", "feature3"].map((f) => (
                <div key={f} className="bg-white p-6 rounded-xl shadow text-center">
                  {data[`${f}Icon`] && <img src={data[`${f}Icon`]} alt={data[f]} className="w-16 h-16 object-contain mx-auto mb-4" />}
                  <h3 className="text-xl font-bold mb-3">{data[f] || "Tính năng"}</h3>
                  <p className="text-gray-600 text-sm">{data[`${f}Desc`] || "Mô tả tính năng"}</p>
                </div>
              ))}
            </div>
          </div>
        );

      /* ====================== SERVICES ====================== */
      case "services":
        return isEditing ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-8 border-b-2 focus:outline-none px-2 py-1`}
              placeholder="Dịch vụ"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["service1", "service2", "service3"].map((s) => (
                <div key={s} className="text-center bg-gray-50 rounded-xl p-6">
                  <ImageUploader currentImage={data[`${s}Image`]} onImageChange={(url) => updateField(`${s}Image`, url)} className="w-20 h-20 mx-auto mb-4" />
                  <input
                    value={data[s] || ""}
                    onChange={(e) => updateField(s, e.target.value)}
                    className="text-xl font-bold mb-3 w-full border-b border-gray-300 focus:outline-none text-center px-2 py-1"
                    placeholder="Tên dịch vụ"
                  />
                  <textarea
                    value={data[`${s}Desc`] || ""}
                    onChange={(e) => updateField(`${s}Desc`, e.target.value)}
                    rows={3}
                    className="text-gray-600 w-full border border-gray-300 rounded p-3 focus:outline-none resize-none text-sm"
                    placeholder="Mô tả dịch vụ"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-8`}>{data.title || "Dịch Vụ Của Chúng Tôi"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["service1", "service2", "service3"].map((s) => (
                <div key={s} className="text-center bg-gray-50 rounded-xl p-6">
                  {data[`${s}Image`] && <img src={data[`${s}Image`]} alt={data[s]} className="w-20 h-20 object-contain mx-auto mb-4" />}
                  <h3 className="text-xl font-bold mb-3">{data[s] || "Dịch vụ"}</h3>
                  <p className="text-gray-600 text-sm">{data[`${s}Desc`] || "Mô tả dịch vụ"}</p>
                </div>
              ))}
            </div>
          </div>
        );

      /* ====================== TEAM ====================== */
      case "team":
        return isEditing ? (
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-8 border-b-2 focus:outline-none px-2 py-1`}
              placeholder="Đội ngũ"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["member1", "member2", "member3"].map((m) => (
                <div key={m} className="bg-white p-6 rounded-xl shadow text-center">
                  <ImageUploader currentImage={data[`${m}Image`]} onImageChange={(url) => updateField(`${m}Image`, url)} className="w-24 h-24 mx-auto mb-4 rounded-full" />
                  <input value={data[m] || ""} onChange={(e) => updateField(m, e.target.value)} className="text-lg font-bold mb-2 w-full border-b border-gray-300 focus:outline-none text-center px-2 py-1" placeholder="Họ tên" />
                  <input value={data[`${m}Role`] || ""} onChange={(e) => updateField(`${m}Role`, e.target.value)} className={`${colorText} mb-3 w-full border-b border-gray-300 focus:outline-none text-center px-2 py-1 text-sm`} placeholder="Chức vụ" />
                  <textarea value={data[`${m}Desc`] || ""} onChange={(e) => updateField(`${m}Desc`, e.target.value)} rows={2} className="text-gray-600 w-full border border-gray-300 rounded p-2 focus:outline-none resize-none text-xs" placeholder="Mô tả" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-8`}>{data.title || "Đội Ngũ Của Chúng Tôi"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["member1", "member2", "member3"].map((m) => (
                <div key={m} className="bg-white p-6 rounded-xl shadow text-center">
                  {data[`${m}Image`] && <img src={data[`${m}Image`]} alt={data[m]} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />}
                  <h3 className="text-lg font-bold">{data[m] || "Thành viên"}</h3>
                  <p className={`${colorText} mb-2 text-sm`}>{data[`${m}Role`] || "Chức vụ"}</p>
                  <p className="text-gray-600 text-xs">{data[`${m}Desc`] || "Mô tả thành viên"}</p>
                </div>
              ))}
            </div>
          </div>
        );

      /* ====================== TESTIMONIALS ====================== */
      case "testimonials":
        return isEditing ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-8 border-b-2 focus:outline-none px-2 py-1`}
              placeholder="Khách hàng nói gì"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["testimonial1", "testimonial2", "testimonial3"].map((t) => (
                <div key={t} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageUploader currentImage={data[`${t}Avatar`]} onImageChange={(url) => updateField(`${t}Avatar`, url)} className="w-12 h-12 rounded-full" />
                    <input value={data[`${t}Author`] || ""} onChange={(e) => updateField(`${t}Author`, e.target.value)} className="font-semibold flex-1 border-b border-gray-300 focus:outline-none text-sm" placeholder="Tên khách hàng" />
                  </div>
                  <textarea value={data[t] || ""} onChange={(e) => updateField(t, e.target.value)} rows={3} className="w-full italic text-gray-700 border border-gray-300 rounded p-2 focus:outline-none resize-none text-sm" placeholder="Lời nhận xét..." />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-8`}>{data.title || "Khách Hàng Nói Gì"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["testimonial1", "testimonial2", "testimonial3"].map((t) => (
                <div key={t} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    {data[`${t}Avatar`] && <img src={data[`${t}Avatar`]} alt={data[`${t}Author`]} className="w-12 h-12 rounded-full object-cover" />}
                    <p className="font-semibold text-sm">{data[`${t}Author`] || "Khách hàng"}</p>
                  </div>
                  <p className="italic text-gray-700 text-sm">"{data[t] || "Đánh giá tuyệt vời!"}"</p>
                </div>
              ))}
            </div>
          </div>
        );

      /* ====================== STATS ====================== */
      case "stats":
        return isEditing ? (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-3xl lg:text-4xl font-bold text-center w-full mb-10 bg-transparent border-b-2 border-white/50 focus:outline-none"
              placeholder="Thành tựu của chúng tôi"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {["stat1", "stat2", "stat3", "stat4"].map((stat, index) => (
                <div key={stat} className="text-center">
                  <input
                    value={data[`${stat}Number`] || ""}
                    onChange={(e) => updateField(`${stat}Number`, e.target.value)}
                    className="text-4xl font-bold bg-transparent border-b border-white/50 w-full text-center mb-2 focus:outline-none"
                    placeholder={["100+", "50+", "99%", "24/7"][index]}
                  />
                  <input
                    value={data[stat] || ""}
                    onChange={(e) => updateField(stat, e.target.value)}
                    className="text-lg bg-transparent border-b border-white/50 w-full text-center focus:outline-none"
                    placeholder={["Dự án hoàn thành", "Khách hàng", "Hài lòng", "Hỗ trợ"][index]}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-10">{data.title || "Thành Tựu Của Chúng Tôi"}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {["stat1", "stat2", "stat3", "stat4"].map((stat, index) => (
                <div key={stat} className="text-center">
                  <div className="text-4xl font-bold mb-2">{data[`${stat}Number`] || ["100+", "50+", "99%", "24/7"][index]}</div>
                  <div className="text-lg">{data[stat] || ["Dự án hoàn thành", "Khách hàng", "Hài lòng", "Hỗ trợ"][index]}</div>
                </div>
              ))}
            </div>
          </div>
        );

      /* ====================== PRICING ====================== */
      case "pricing":
        return isEditing ? (
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-8 border-b-2 focus:outline-none px-2 py-1`}
              placeholder="Bảng giá"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["plan1", "plan2", "plan3"].map((p) => (
                <div key={p} className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${data[`${p}Featured`] ? color.border : "border-gray-200"} relative`}>
                  {data[`${p}Featured`] && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${color.bg} text-white px-4 py-1 rounded-full text-xs font-bold`}>Phổ biến</div>
                  )}
                  <input value={data[p] || ""} onChange={(e) => updateField(p, e.target.value)} className="text-xl font-bold text-center w-full mb-3 border-b border-gray-300 focus:outline-none px-2 py-1" placeholder="Tên gói" />
                  <input value={data[`${p}Price`] || ""} onChange={(e) => updateField(`${p}Price`, e.target.value)} className={`text-3xl font-bold ${colorText} text-center w-full mb-4 border-b border-gray-300 focus:outline-none px-2 py-1`} placeholder="Giá" />
                  <textarea value={data[`${p}Features`] || ""} onChange={(e) => updateField(`${p}Features`, e.target.value)} rows={4} className="w-full border border-gray-300 rounded p-2 text-xs mb-4 focus:outline-none resize-none" placeholder="Tính năng (mỗi dòng 1 mục)" />
                  <label className="flex items-center justify-center gap-2 mb-4">
                    <input type="checkbox" checked={!!data[`${p}Featured`]} onChange={(e) => updateField(`${p}Featured`, e.target.checked)} />
                    <span className="text-sm">Nổi bật</span>
                  </label>
                  <input value={data[`${p}Button`] || ""} onChange={(e) => updateField(`${p}Button`, e.target.value)} className={`${color.bg} text-white w-full py-2 rounded-lg font-semibold text-center`} placeholder="Văn bản nút" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-8`}>{data.title || "Bảng Giá"}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {["plan1", "plan2", "plan3"].map((p) => (
                <div key={p} className={`bg-white p-6 rounded-2xl shadow-lg border-2 ${data[`${p}Featured`] ? color.border : "border-gray-200"} relative text-center`}>
                  {data[`${p}Featured`] && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${color.bg} text-white px-4 py-1 rounded-full text-xs font-bold`}>Phổ biến</div>
                  )}
                  <h3 className="text-xl font-bold mb-3">{data[p] || "Gói dịch vụ"}</h3>
                  <p className={`text-3xl font-bold ${colorText} mb-4`}>{data[`${p}Price`] || "0đ"}</p>
                  <ul className="text-left text-gray-600 mb-6 space-y-1 text-sm">
                    {(data[`${p}Features`] || "").split("\n").filter(Boolean).map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                  </ul>
                  <button className={`${color.bg} ${colorHover} text-white w-full py-2 rounded-lg font-semibold transition`}>
                    {data[`${p}Button`] || "Chọn gói"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      /* ====================== FAQ ====================== */
      case "faq":
        return isEditing ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className={`text-3xl lg:text-4xl font-bold ${colorText} text-center w-full mb-8 border-b-2 focus:outline-none px-2 py-1`}
              placeholder="Câu hỏi thường gặp"
            />
            <div className="space-y-4 max-w-4xl mx-auto">
              {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => {
                const q = data[`question${n}`];
                if (!q && !isEditing) return null;
                return (
                  <div key={n} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex gap-3 items-start">
                      <input
                        value={q || ""}
                        onChange={(e) => updateField(`question${n}`, e.target.value)}
                        className="flex-1 text-base font-semibold focus:outline-none"
                        placeholder={`Câu hỏi ${n}`}
                      />
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newData = { ...data };
                            delete newData[`question${n}`];
                            delete newData[`answer${n}`];
                            setEditedContent(newData);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    <textarea
                      value={data[`answer${n}`] || ""}
                      onChange={(e) => updateField(`answer${n}`, e.target.value)}
                      rows={2}
                      className="w-full mt-2 border border-gray-300 rounded p-2 focus:outline-none resize-none text-sm"
                      placeholder="Câu trả lời..."
                    />
                  </div>
                );
              })}
              <button
                onClick={() => {
                  const next = Object.keys(data).filter((k) => k.startsWith("question")).length + 1;
                  if (next <= 6) updateField(`question${next}`, "");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm"
              >
                + Thêm câu hỏi
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            <h2 className={`text-3xl lg:text-4xl font-bold ${colorText} text-center mb-8`}>{data.title || "Câu Hỏi Thường Gặp"}</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {Array.from({ length: 6 }, (_, i) => i + 1)
                .map((n) => data[`question${n}`] && (
                  <div key={n} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-2">{data[`question${n}`]}</h3>
                    <p className="text-gray-700 text-sm">{data[`answer${n}`] || ""}</p>
                  </div>
                ))
                .filter(Boolean)}
            </div>
          </div>
        );

      /* ====================== CONTACT ====================== */
      case "contact":
        return isEditing ? (
          <div className={`${color.bg} text-white rounded-2xl p-6 lg:p-10`}>
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-3xl lg:text-4xl font-bold text-center w-full mb-6 bg-transparent border-b-2 border-white/50 focus:outline-none px-2 py-1"
              placeholder="Liên hệ"
            />
            <div className="max-w-lg mx-auto space-y-4">
              <input value={data.namePlaceholder || ""} onChange={(e) => updateField("namePlaceholder", e.target.value)} className="w-full p-3 rounded bg-white/20 placeholder-white/70 focus:outline-none text-sm" placeholder="Placeholder tên" />
              <input value={data.emailPlaceholder || ""} onChange={(e) => updateField("emailPlaceholder", e.target.value)} className="w-full p-3 rounded bg-white/20 placeholder-white/70 focus:outline-none text-sm" placeholder="Placeholder email" />
              <textarea value={data.messagePlaceholder || ""} onChange={(e) => updateField("messagePlaceholder", e.target.value)} rows={4} className="w-full p-3 rounded bg-white/20 placeholder-white/70 focus:outline-none resize-none text-sm" placeholder="Placeholder tin nhắn" />
              <input value={data.buttonText || ""} onChange={(e) => updateField("buttonText", e.target.value)} className="bg-white text-gray-800 w-full py-3 rounded font-bold text-center" placeholder="Văn bản nút" />
            </div>
          </div>
        ) : (
          <div className={`${color.bg} text-white rounded-2xl p-6 lg:p-10`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-6">{data.title || "Liên Hệ Với Chúng Tôi"}</h2>
            <form className="max-w-lg mx-auto space-y-4">
              <input type="text" placeholder={data.namePlaceholder || "Họ tên"} className="w-full p-3 rounded bg-white/20 placeholder-white/70 text-sm" />
              <input type="email" placeholder={data.emailPlaceholder || "Email"} className="w-full p-3 rounded bg-white/20 placeholder-white/70 text-sm" />
              <textarea placeholder={data.messagePlaceholder || "Nội dung..."} rows={4} className="w-full p-3 rounded bg-white/20 placeholder-white/70 text-sm" />
              <button className="bg-white text-gray-800 w-full py-3 rounded font-bold hover:bg-gray-100 transition">
                {data.buttonText || "Gửi tin nhắn"}
              </button>
            </form>
          </div>
        );

      case "carousel":
        return isEditing ? (
          <div className="bg-gray-50 p-8 rounded-xl">
            <input
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-3xl font-bold w-full mb-6 text-center border-b-2 border-gray-300 focus:outline-none"
              placeholder="Tiêu đề carousel"
            />
            <div className="space-y-6">
              {((data.slides && Array.isArray(data.slides)) ? data.slides : [{ image: "", caption: "" }]).map((slide, i) => (
                <div key={i} className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white">
                  <p className="text-sm font-medium mb-3">Slide {i + 1}</p>
                  <ImageUploader
                    currentImage={slide.image}
                    onImageChange={(url) => {
                      const newSlides = [...(data.slides || [])];
                      if (!newSlides[i]) newSlides[i] = {};
                      newSlides[i].image = url;
                      updateField("slides", newSlides);
                    }}
                    className="w-full h-64 mb-4"
                  />
                  <input
                    value={slide.caption || ""}
                    onChange={(e) => {
                      const newSlides = [...(data.slides || [])];
                      if (!newSlides[i]) newSlides[i] = { image: slide.image || "" };
                      newSlides[i].caption = e.target.value;
                      updateField("slides", newSlides);
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                    placeholder="Chú thích ảnh"
                  />
                  {data.slides && data.slides.length > 1 && (
                    <button
                      onClick={() => {
                        const newSlides = data.slides.filter((_, idx) => idx !== i);
                        updateField("slides", newSlides);
                      }}
                      className="mt-3 text-red-600 text-sm hover:underline"
                    >
                      Xóa slide
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  const newSlides = [...(data.slides || []), { image: "", caption: "" }];
                  updateField("slides", newSlides);
                }}
                className="w-full py-3 border-2 border-dashed border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                + Thêm slide mới
              </button>
            </div>
          </div>
        ) : (
          <CarouselSection data={data} color={selectedColor} />
        );

      /* ====================== FOOTER ====================== */
      case "footer":
        return isEditing ? (
          <div className="bg-gray-900 text-white py-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ImageUploader currentImage={data.logoImage} onImageChange={(url) => updateField("logoImage", url)} className="w-12 h-12" />
                  <input value={data.logoText || ""} onChange={(e) => updateField("logoText", e.target.value)} className="text-xl font-bold bg-transparent border-b border-gray-600 focus:outline-none w-full" placeholder="Tên công ty" />
                </div>
                <textarea value={data.description || ""} onChange={(e) => updateField("description", e.target.value)} rows={3} className="w-full bg-transparent border border-gray-600 rounded p-2 focus:outline-none text-xs" placeholder="Mô tả công ty" />
              </div>
              {["links1", "links2", "links3"].map((col) => (
                <div key={col}>
                  <input value={data[`${col}Title`] || ""} onChange={(e) => updateField(`${col}Title`, e.target.value)} className="font-bold mb-3 bg-transparent border-b border-gray-600 w-full focus:outline-none text-sm" placeholder="Tiêu đề" />
                  {[1, 2, 3].map((i) => (
                    <input
                      key={i}
                      value={data[`${col}Item${i}`] || ""}
                      onChange={(e) => updateField(`${col}Item${i}`, e.target.value)}
                      className="block w-full mb-1 bg-transparent border-b border-gray-600 focus:outline-none text-xs"
                      placeholder={`Mục ${i}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-6 pt-4 text-center">
              <input value={data.copyright || ""} onChange={(e) => updateField("copyright", e.target.value)} className="bg-transparent border-b border-gray-600 focus:outline-none text-xs w-full md:w-auto text-center" placeholder="© 2025 Công ty" />
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 text-white py-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-10" />}
                  <h3 className="text-xl font-bold">{data.logoText || "Your Brand"}</h3>
                </div>
                <p className="text-xs text-gray-400">{data.description || "Mô tả công ty"}</p>
              </div>
              {["links1", "links2", "links3"].map((col) => (
                <div key={col}>
                  <h4 className="font-bold mb-3 text-sm">{data[`${col}Title`] || "Liên kết"}</h4>
                  <div className="space-y-1 text-xs text-gray-400">
                    {[1, 2, 3].map((i) => data[`${col}Item${i}`] && <a key={i} href="#" className="block hover:text-white transition">{data[`${col}Item${i}`]}</a>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
              {data.copyright || "© 2025 Your Company. All rights reserved."}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-6 text-center text-amber-800 font-medium">
            Chưa hỗ trợ loại block: <strong>{section.sectionType}</strong>
          </div>
        );
    }
  };

  return (
    <div className="relative group mb-8">
      {renderSection()}

      {/* Nút điều khiển */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
        {isEditing ? (
          <>
            <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto hover:bg-green-700 font-medium text-sm">
              Lưu
            </button>
            <button onClick={cancel} className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto hover:bg-gray-700 font-medium text-sm">
              Hủy
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto hover:bg-blue-700 font-medium text-sm">
            Sửa
          </button>
        )}
        <button onClick={onRemove} className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-auto hover:bg-red-700 font-medium text-sm">
          Xóa
        </button>
      </div>
    </div>
  );
};

export default EditableBlock;