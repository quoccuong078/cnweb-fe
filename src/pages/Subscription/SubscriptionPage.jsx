import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiPackage, FiTrendingUp } from "react-icons/fi";
import { changePlan, getCurrentSubscription, getPublicPlans } from "../../services/api";

export default function SubscriptionPage() {
  const [currentSub, setCurrentSub] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subData, plansData] = await Promise.all([
        getCurrentSubscription(),
        getPublicPlans()
      ]);
      setCurrentSub(subData);
      setPlans(plansData);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải thông tin gói cước");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId, planName) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển sang gói ${planName}?`)) return;
    
    setProcessing(true);
    try {
      await changePlan(planId);
      toast.success(`Đã chuyển sang gói ${planName} thành công!`);
      fetchData(); // Reload lại dữ liệu
      
      // Reload trang để cập nhật Plan Name trên Sidebar (AdminLayout)
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error("Nâng cấp thất bại. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Gói cước</h1>
        <p className="text-gray-500">Xem thông tin gói hiện tại và nâng cấp dịch vụ.</p>
      </div>

      {/* Thông tin gói hiện tại */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-blue-100 font-medium mb-1">Gói hiện tại của bạn</p>
          <h2 className="text-4xl font-bold flex items-center gap-3">
            {currentSub?.planName}
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full border border-white/30 uppercase tracking-wider">
              {currentSub?.status}
            </span>
          </h2>
          <p className="mt-4 text-blue-100">
            Hết hạn: <strong>{currentSub?.endDate ? new Date(currentSub.endDate).toLocaleDateString('vi-VN') : "Vĩnh viễn"}</strong>
          </p>
          <div className="mt-2 text-sm opacity-80">
            Dung lượng: {currentSub?.storageLimit} MB
          </div>
        </div>
        <div className="p-4 bg-white/10 rounded-full">
          <FiPackage className="text-6xl text-blue-200" />
        </div>
      </div>

      {/* Danh sách các gói */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiTrendingUp /> Nâng cấp gói dịch vụ
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentSub?.planId === plan.id;
            const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;

            return (
              <div 
                key={plan.id} 
                className={`relative bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-xl flex flex-col
                  ${isCurrent ? "border-blue-500 ring-4 ring-blue-50" : "border-gray-100 hover:border-blue-200"}
                `}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Đang sử dụng
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-800">{plan.name}</h4>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">₫{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 min-h-[40px]">{plan.description}</p>
                </div>

                <hr className="my-4 border-gray-100"/>

                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && handleUpgrade(plan.id, plan.name)}
                  disabled={isCurrent || processing}
                  className={`w-full py-2.5 rounded-lg font-bold transition
                    ${isCurrent 
                      ? "bg-gray-100 text-gray-400 cursor-default" 
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    }
                  `}
                >
                  {isCurrent ? "Đang sử dụng" : "Nâng cấp ngay"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}