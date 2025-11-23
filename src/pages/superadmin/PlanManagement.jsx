// src/pages/superadmin/PlanManagement.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { createPlan, deletePlan, getPublicPlans, updatePlan } from "../../services/api";

// Cấu hình Select cố định để tránh lỗi UI
const COLORS = [
  { value: "blue", label: "Xanh Dương (Blue)" },
  { value: "purple", label: "Tím (Purple)" },
  { value: "green", label: "Xanh Lá (Green)" },
  { value: "orange", label: "Cam (Orange)" },
  { value: "gray", label: "Xám (Gray)" },
];

const STORAGES = [
  { value: 100, label: "100 MB (Gói Free)" },
  { value: 1024, label: "1 GB" },
  { value: 5120, label: "5 GB" },
  { value: 10240, label: "10 GB" },
  { value: 51200, label: "50 GB" },
  { value: -1, label: "Không giới hạn (Unlimited)" },
];

export default function PlanManagement() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "", price: 0, description: "", color: "blue",
    maxStorageMB: 100, maxLandingPages: 1, customDomainAllowed: false,
    isPopular: false, buttonText: "Đăng ký ngay",
    featuresRaw: "" // Dùng textarea nhập từng dòng
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getPublicPlans();
      setPlans(data);
    } catch (error) { console.error(error); }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        description: plan.description,
        color: plan.color,
        maxStorageMB: plan.maxStorageMB,
        maxLandingPages: plan.maxLandingPages,
        customDomainAllowed: plan.customDomainAllowed,
        isPopular: plan.isPopular,
        buttonText: plan.buttonText,
        // Chuyển mảng features thành chuỗi xuống dòng
        featuresRaw: Array.isArray(plan.features) ? plan.features.join("\n") : ""
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "", price: 0, description: "", color: "blue",
        maxStorageMB: 100, maxLandingPages: 1, customDomainAllowed: false,
        isPopular: false, buttonText: "Đăng ký ngay", featuresRaw: ""
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert featuresRaw thành JSON String
    const featuresArray = formData.featuresRaw.split("\n").filter(line => line.trim() !== "");
    const payload = {
        ...formData,
        Id: editingPlan ? editingPlan.id : 0,
        Features: JSON.stringify(featuresArray) // Backend lưu chuỗi JSON
    };

    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, payload);
        toast.success("Cập nhật gói thành công!");
      } else {
        await createPlan(payload);
        toast.success("Thêm gói mới thành công!");
      }
      setShowModal(false);
      loadPlans();
    } catch (error) {
      toast.error(error.response?.data?.Message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa gói này?")) return;
    try {
      await deletePlan(id);
      toast.success("Đã xóa gói.");
      loadPlans();
    } catch (error) {
      toast.error(error.response?.data?.Message || "Không thể xóa (có thể đang có người dùng).");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Gói Cước (Plans)</h1>
        <button onClick={() => openModal()} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
          <FiPlus /> Thêm gói mới
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`border-2 rounded-xl p-5 bg-white relative ${plan.isPopular ? 'border-purple-500' : 'border-gray-100'}`}>
             <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg rounded-tr-lg bg-${plan.color}-500`}>
                {plan.color.toUpperCase()}
             </div>
             
             <h3 className="text-xl font-bold">{plan.name}</h3>
             <p className="text-2xl font-extrabold text-gray-800 mt-2">{plan.price.toLocaleString()} ₫</p>
             <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
             
             <div className="text-sm space-y-1 mb-4 bg-gray-50 p-3 rounded">
                <p>💾 Dung lượng: <strong>{plan.maxStorageMB === -1 ? "Unlimited" : `${plan.maxStorageMB} MB`}</strong></p>
                <p>📄 Số trang: <strong>{plan.maxLandingPages === -1 ? "Unlimited" : plan.maxLandingPages}</strong></p>
                <p>🌐 Domain riêng: <strong>{plan.customDomainAllowed ? "Có" : "Không"}</strong></p>
             </div>

             <div className="flex gap-2 mt-4">
                <button onClick={() => openModal(plan)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 flex justify-center items-center gap-1"><FiEdit /> Sửa</button>
                <button onClick={() => handleDelete(plan.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 flex justify-center items-center gap-1"><FiTrash2 /> Xóa</button>
             </div>
          </div>
        ))}
      </div>

      {/* MODAL CREATE/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-xl font-bold">{editingPlan ? "Chỉnh sửa gói" : "Thêm gói mới"}</h2>
              <button onClick={() => setShowModal(false)}><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tên gói</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Giá (VND)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full border rounded p-2" />
                </div>
              </div>

              <div>
                    <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                    <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2" />
              </div>

              {/* SELECT COLOR & STORAGE */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Màu sắc (Hiển thị Frontend)</label>
                    <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full border rounded p-2 bg-white">
                        {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Dung lượng lưu trữ</label>
                    <select value={formData.maxStorageMB} onChange={e => setFormData({...formData, maxStorageMB: parseInt(e.target.value)})} className="w-full border rounded p-2 bg-white">
                        {STORAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Số trang tối đa (-1 là vô hạn)</label>
                    <input type="number" value={formData.maxLandingPages} onChange={e => setFormData({...formData, maxLandingPages: parseInt(e.target.value)})} className="w-full border rounded p-2" />
                </div>
                 <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.customDomainAllowed} onChange={e => setFormData({...formData, customDomainAllowed: e.target.checked})} /> Cho phép Domain riêng
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} /> Đánh dấu Popular
                    </label>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Danh sách tính năng (Mỗi dòng 1 tính năng)</label>
                <textarea 
                    rows={5}
                    value={formData.featuresRaw} 
                    onChange={e => setFormData({...formData, featuresRaw: e.target.value})} 
                    className="w-full border rounded p-2 font-mono text-sm"
                    placeholder="1 Landing Page&#10;Miễn phí tên miền..."
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700">
                {editingPlan ? "Lưu thay đổi" : "Tạo gói mới"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}