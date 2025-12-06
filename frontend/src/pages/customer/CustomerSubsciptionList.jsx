import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiZap, FiBatteryCharging, FiClock, FiShield, FiAlertCircle } from 'react-icons/fi';
// import api from '../../services/api'; // Mở lại dòng này khi có Backend thực tế

// --- MOCK API (Dùng để test giao diện khi chưa bật Backend) ---
// Bạn có thể xóa đoạn này khi đã kết nối API thật
const mockApi = {
  get: () => new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, name: 'Eco Saver', description: 'Dành cho người đi ít, tiết kiệm tối đa.', priceMonthly: 199000, priceYearly: 1990000, swapLimit: 10 },
          { id: 2, name: 'Pro Rider', description: 'Thoải mái di chuyển hàng ngày.', priceMonthly: 399000, priceYearly: 3990000, swapLimit: null }, // null = unlimited
          { id: 3, name: 'Business', description: 'Dành cho shipper và doanh nghiệp.', priceMonthly: 599000, priceYearly: 5990000, swapLimit: null },
        ]
      });
    }, 800);
  })
};
const api = mockApi; // Đổi thành 'import api...' khi chạy thật
// -------------------------------------------------------------

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: Chọn icon
  const getPlanIcon = (id) => {
    switch (id) {
      case 1: return <FiBatteryCharging className="w-6 h-6" />;
      case 2: return <FiZap className="w-6 h-6" />;
      case 3: return <FiShield className="w-6 h-6" />;
      default: return <FiZap className="w-6 h-6" />;
    }
  };

  // Helper: Tạo danh sách tính năng
  const generateFeatures = (plan) => {
    const features = [];
    
    // Feature 1: Giới hạn
    if (plan.swapLimit === null) {
      features.push('Đổi pin KHÔNG GIỚI HẠN');
    } else {
      features.push(`${plan.swapLimit} lần đổi pin / tháng`);
    }

    // Feature 2: Hardcode tính năng cơ bản
    features.push('Tra cứu trạm sạc trên app');
    features.push('Hỗ trợ cứu hộ 24/7');
    
    // Feature 3: Logic nâng cao dựa trên giá
    if (plan.priceMonthly >= 350000) {
      features.push('Ưu tiên đặt lịch đổi pin (Fast Track)');
      features.push('Miễn phí bảo dưỡng pin định kỳ');
    }
    
    return features;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách gói cước
        const response = await api.get('/subscription-plans');
        const data = response.data;

        // Map dữ liệu API sang UI format
        const formattedPlans = data.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: {
            monthly: plan.priceMonthly,
            yearly: plan.priceYearly
          },
          features: generateFeatures(plan),
          recommended: plan.id === 2, // Logic giả định gói ID 2 là Best Seller
          icon: getPlanIcon(plan.id),
          originalData: plan 
        }));

        setPlans(formattedPlans);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải danh sách gói cước. Vui lòng kiểm tra kết nối.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // --- LOGIC XỬ LÝ ĐĂNG KÝ (QUAN TRỌNG) ---
  const handleSubscribe = (plan) => {
    // 1. Kiểm tra đăng nhập (Ví dụ: check token trong localStorage)
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // Nếu chưa đăng nhập, lưu lại ý định mua gói để redirect lại sau khi login
        sessionStorage.setItem('pendingPlan', JSON.stringify({ planId: plan.id, cycle: billingCycle }));
        // navigate('/login'); 
        // return; 
        // (Tạm thời comment để test luồng checkout luôn)
    }

    // 2. Tính toán số tiền dựa trên chu kỳ đã chọn
    const finalPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;

    // 3. Chuyển hướng sang trang thanh toán kèm dữ liệu
    navigate('/driver/checkout', { 
      state: {
        planId: plan.id,
        planName: plan.name,
        billingCycle: billingCycle, // 'monthly' hoặc 'yearly'
        amount: finalPrice,
        description: plan.description
      }
    });
  };

  // --- Render Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1219] flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="animate-pulse">Đang tải gói cước...</span>
        </div>
      </div>
    );
  }

  // --- Render Error ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1219] flex items-center justify-center text-red-400">
        <div className="flex flex-col items-center gap-4 p-6 border border-red-900/50 bg-red-900/10 rounded-xl">
          <FiAlertCircle size={40} />
          <div className="text-center">
            <h3 className="text-lg font-bold text-red-300">Đã xảy ra lỗi</h3>
            <p className="text-sm text-red-400/80 mt-1">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-6 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 rounded-lg transition-colors border border-red-500/30"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // --- Render Main UI ---
  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header & Toggle */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Chọn gói đổi pin phù hợp
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Tiết kiệm chi phí nhiên liệu và bảo vệ môi trường. 
            Linh hoạt nâng cấp hoặc hủy gói bất cứ lúc nào.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-[#161b26] p-1.5 rounded-xl border border-gray-800 flex items-center relative">
              {/* Animation Background cho Toggle (Optional enhancement) */}
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  billingCycle === 'monthly' 
                    ? 'bg-[#2d3342] text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Theo tháng
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  billingCycle === 'yearly' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Theo năm
                <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold ml-1">
                  -15%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col bg-[#161b26] rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.recommended 
                  ? 'border-blue-500 shadow-blue-900/20 z-10 scale-105 md:-mt-4' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Badge for Recommended Plan */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap tracking-wider uppercase">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.recommended 
                      ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 ring-1 ring-blue-500/30' 
                      : 'bg-gray-800 text-gray-400'
                }`}>
                    {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400 mt-3 min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-gray-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {plan.price[billingCycle]?.toLocaleString('vi-VN') ?? 0}
                  </span>
                  <span className="text-lg text-gray-400 font-medium">đ</span>
                  <span className="text-gray-500 ml-1">
                    / {billingCycle === 'monthly' ? 'tháng' : 'năm'}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 space-y-5 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className={`mt-0.5 p-0.5 rounded-full ${
                        plan.recommended ? 'bg-blue-500/10' : 'bg-gray-800'
                    }`}>
                        <FiCheck className={`w-4 h-4 ${plan.recommended ? 'text-blue-500' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-200 transform active:scale-[0.98] ${
                  plan.recommended
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-500/20'
                    : 'bg-[#262c3a] hover:bg-[#323a4b] text-white border border-gray-700 hover:border-gray-600'
                }`}
              >
                Chọn gói này
              </button>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-800/60 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { icon: <FiClock />, title: "Nhanh chóng", desc: "Đổi pin chỉ trong 2 phút tại trạm." },
                { icon: <FiShield />, title: "An toàn", desc: "Pin đạt chuẩn IP67 chống nước." },
                { icon: <FiZap />, title: "Tiết kiệm", desc: "Rẻ hơn 40% so với xe xăng." }
             ].map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center md:items-start gap-3">
                    <div className="p-3 bg-gray-800/30 rounded-full text-gray-400 border border-gray-700/50">
                        {React.cloneElement(item.icon, { className: "w-6 h-6" })}
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                 </div>
             ))}
        </div>

      </div>
    </div>
  );
}