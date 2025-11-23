import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getPublicPlans } from "../../services/api"; // Import API mới

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPublicPlans();
        setPlans(data);
      } catch (error) {
        console.error("Lỗi tải bảng giá:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bảng giá linh hoạt</h1>
        <p className="text-gray-500 mb-16 text-lg">Chọn gói phù hợp với quy mô doanh nghiệp của bạn.</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-3xl p-8 border-2 transition-transform hover:-translate-y-2 flex flex-col
                ${plan.popular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-lg'}
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                  Phổ biến nhất
                </div>
              )}

              <h3 className={`text-xl font-bold mb-2 text-${plan.color === 'purple' ? 'purple-600' : plan.popular ? 'blue-600' : 'gray-800'}`}>
                {plan.name}
              </h3>
              <p className="text-gray-500 text-sm mb-6 h-10">{plan.desc}</p>
              
              <div className="flex items-baseline justify-center mb-8">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-xl font-medium ml-1">{plan.currency}</span>
                <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 text-left flex-grow">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FiCheck className="text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/auth"
                className={`block w-full py-3 rounded-xl font-bold transition text-center mt-auto
                  ${plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : plan.color === 'purple' 
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
                `}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}