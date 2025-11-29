// src/pages/LandingViewer/LandingViewerPage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

// Import tất cả Viewer Sections
import AboutSection from "../../components/ViewerSections/AboutSection";
import CarouselSection from "../../components/ViewerSections/CarouselSection";
import ContactSection from "../../components/ViewerSections/ContactSection";
import FAQSection from "../../components/ViewerSections/FAQSection";
import FeaturesSection from "../../components/ViewerSections/FeaturesSection";
import FooterSection from "../../components/ViewerSections/FooterSection";
import HeaderSection from "../../components/ViewerSections/HeaderSection";
import HeroSection from "../../components/ViewerSections/HeroSection";
import PricingSection from "../../components/ViewerSections/PricingSection";
import ServicesSection from "../../components/ViewerSections/ServicesSection";
import StatsSection from "../../components/ViewerSections/StatsSection";
import TeamSection from "../../components/ViewerSections/TeamSection";
import TestimonialsSection from "../../components/ViewerSections/TestimonialsSection";

const sectionMap = {
    header: HeaderSection,
    hero: HeroSection,
    about: AboutSection,
    features: FeaturesSection,
    services: ServicesSection,
    stats: StatsSection,
    team: TeamSection,
    testimonials: TestimonialsSection,
    pricing: PricingSection,
    faq: FAQSection,
    contact: ContactSection,
    carousel: CarouselSection,
    footer: FooterSection,
};

export default function LandingViewerPage() {
    const { subdomain, slug } = useParams();
    
    // [SỬA ĐỔI 1]: Xóa bỏ dòng effectiveSlug cũ ép cứng "trang-chu"
    // Chúng ta sẽ dùng trực tiếp biến `slug` (có thể là undefined)

    const [sections, setSections] = useState([]);
    const [config, setConfig] = useState({ customColors: "blue" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Biến ref để tránh gọi API 2 lần (React.StrictMode)
    const hasFetched = useRef("");

    useEffect(() => {
        // [SỬA ĐỔI 2]: Tạo key định danh bao gồm trường hợp không có slug
        const currentRequestKey = `${subdomain}-${slug || "root"}`;

        // Nếu đã fetch đúng key này rồi thì bỏ qua
        if (hasFetched.current === currentRequestKey) return;
        
        const fetchData = async () => {
            try {
                hasFetched.current = currentRequestKey;
                setLoading(true);

                // 1. Logic xác định Unique Visitor
                const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
                const visitKey = `visited_${subdomain}_${today}`;
                const hasVisitedToday = localStorage.getItem(visitKey);
                
                const isUnique = !hasVisitedToday;

                if (isUnique) {
                    localStorage.setItem(visitKey, "true");
                }

                // [SỬA ĐỔI 3]: Xây dựng URL API linh động
                // Nếu có slug -> /landing/subdomain/slug
                // Nếu KHÔNG có slug -> /landing/subdomain (Backend tự tìm trang chủ)
                let apiUrl = `/landing/${subdomain}`;
                if (slug) {
                    apiUrl += `/${slug}`;
                }

                // Gọi API
                const res = await api.get(apiUrl, {
                    headers: {
                        "X-Is-Unique": isUnique ? "true" : "false",
                        "X-Source": document.referrer || "Direct"
                    }
                });

                const data = res.data;
                console.log("Backend trả về:", data);

                let pageSections = [];
                let pageConfig = { customColors: "blue" };

                // Hỗ trợ map dữ liệu từ Backend
                if (data.pageSections) {
                    pageSections = data.pageSections;
                    pageConfig = data.pageConfiguration || data.pageConfig || pageConfig;
                }
                else if (data.sections) {
                    pageSections = data.sections;
                    pageConfig = data.configuration || pageConfig;
                }
                // Fallback dữ liệu mẫu nếu backend trả về thiếu
                else if (data.customColors) {
                    pageConfig.customColors = data.customColors;
                    pageSections = [
                        { id: 1, sectionType: "hero", content: JSON.stringify({ title: "Website đang xây dựng", subtitle: "Vui lòng quay lại sau", buttonText: "Liên hệ" }), order: 0 },
                        { id: 99, sectionType: "footer", content: JSON.stringify({ logoText: subdomain, description: "Powered by SaaS Platform", copyright: "© 2025" }), order: 99 }
                    ];
                }

                setSections(pageSections.sort((a, b) => a.order - b.order));
                setConfig(pageConfig);
                setError(null); // Reset lỗi nếu thành công

            } catch (err) {
                console.error(err);
                // Hiển thị lỗi thân thiện hơn
                if (err.response && err.response.status === 404) {
                    setError("Trang này không tồn tại hoặc chưa được xuất bản.");
                } else {
                    setError("Đã xảy ra lỗi khi tải trang.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (subdomain) {
            fetchData();
        }

    }, [subdomain, slug]); // [SỬA ĐỔI 4]: Dependency chỉ phụ thuộc vào subdomain và slug gốc

    if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-500">Đang tải nội dung...</div>;
    
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">{error}</p>
            <a href="/" className="text-blue-600 hover:underline">Quay về trang chủ hệ thống</a>
        </div>
    );

    const color = config.customColors || "blue";

    return (
        <div className="min-h-screen bg-gray-50">
            {sections.map(sec => {
                // Parse nội dung JSON an toàn
                let parsed = {};
                try {
                    parsed = sec.content ? JSON.parse(sec.content) : {};
                } catch (e) {
                    console.error("Lỗi parse JSON section:", sec.id);
                }

                const Component = sectionMap[sec.sectionType.toLowerCase()];
                if (!Component) return null;
                
                return <Component key={sec.id} data={parsed} color={color} />;
            })}
        </div>
    );
}