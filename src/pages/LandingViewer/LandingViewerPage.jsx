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
    const effectiveSlug = slug || "trang-chu";

    const [sections, setSections] = useState([]);
    const [config, setConfig] = useState({ customColors: "blue" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Tạo biến ref để đánh dấu
    const hasFetched = useRef(false);

    useEffect(() => {
    // 2. Nếu đã fetch rồi thì dừng lại ngay, không chạy code bên dưới nữa
    // Lưu ý: Reset hasFetched khi subdomain hoặc slug thay đổi để nó load trang mới
    if (hasFetched.current === `${subdomain}-${slug}`) return;
    
    const fetchData = async () => {
        try {
        // Đánh dấu là đã đang chạy cho trang này
        hasFetched.current = `${subdomain}-${slug}`;
            // 1. Logic xác định Unique Visitor (Sử dụng localStorage)
            // Key lưu trữ: "visited_{subdomain}_{date}"
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const visitKey = `visited_${subdomain}_${today}`;
            const hasVisitedToday = localStorage.getItem(visitKey);
            
            // Nếu chưa có key -> Là khách unique
            const isUnique = !hasVisitedToday;

            // Lưu lại trạng thái đã visit
            if (isUnique) {
            localStorage.setItem(visitKey, "true");
        }

        // 2. Gọi API kèm theo Header xác định Unique và Nguồn truy cập (Referer)
        const res = await api.get(`/landing/${subdomain}/${effectiveSlug}`, {
                    headers: {
                        "X-Is-Unique": isUnique ? "true" : "false",
                        "X-Source": document.referrer || "Direct"
                    }
                });

        const data = res.data;

            console.log("Backend trả về:", data);

            let pageSections = [];
            let pageConfig = { customColors: "blue" };

            // Hỗ trợ nhiều kiểu trả về từ backend
            if (data.pageSections) {
            pageSections = data.pageSections;
            pageConfig = data.pageConfiguration || data.pageConfig || pageConfig;
            }
            else if (data.sections) {
            pageSections = data.sections;
            pageConfig = data.configuration || pageConfig;
            }
            // Nếu backend trả kiểu cũ (chỉ config), tạm thời dùng section mặc định từ seed
            else if (data.customColors) {
            pageConfig.customColors = data.customColors;
            // Dùng dữ liệu từ seed (tạm thời)
            pageSections = [
                { id: 1, sectionType: "hero", content: JSON.stringify({ title: "Chào mừng đến với TNDT Việt Nam", subtitle: "Giải pháp công nghệ toàn diện", buttonText: "Liên hệ ngay" }), order: 0 },
                { id: 5, sectionType: "footer", content: JSON.stringify({ logoText: "TNDT Việt Nam", description: "Giải pháp công nghệ hàng đầu Việt Nam.", copyright: "© 2025 TNDT Việt Nam" }), order: 99 }
            ];
            }

            setSections(pageSections.sort((a, b) => a.order - b.order));
            setConfig(pageConfig);
        } catch (err) {
            console.error(err);
            setError("Không tải được trang. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
        };

        if (subdomain) fetchData();
    }, [subdomain, effectiveSlug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Đang tải...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error}</div>;

    const color = config.customColors || "blue";

    return (
        <div className="min-h-screen bg-gray-50">
        {sections.map(sec => {
            const parsed = JSON.parse(sec.content || "{}");
            const Component = sectionMap[sec.sectionType.toLowerCase()];
            if (!Component) return null;
            return <Component key={sec.id} data={parsed} color={color} />;
        })}
        </div>
    );
}