import React, { useState, useContext } from 'react'; // 1. Import useContext
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiCheckCircle, FiLock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import api from '../../services/api'; 

// 2. Import AuthContext (Hãy sửa đường dẫn đúng với project của bạn)
// Giả sử bạn có export một hook tên là useAuth, nếu không thì dùng useContext(AuthContext)
import { AuthContext } from '../../services/AuthContext';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 3. Lấy thông tin user từ Context
  // user thường là object: { id: 1, name: '...', email: '...' } hoặc null nếu chưa login
  const { user } = useContext(AuthContext);

  const { planId, planName, billingCycle, amount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [loading, setLoading] = useState(false);
  
  // Tự động điền thông tin form nếu user đã đăng nhập
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || user?.name || '', // Lấy tên từ context nếu có
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Redirect nếu không có dữ liệu gói
  if (!planId) {
    return <Navigate to="/subscription" replace />;
  }

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Validate form
    if (!userInfo.fullName || !userInfo.phone) {
        alert("Vui lòng nhập đầy đủ thông tin liên hệ");
        return;
    }

    // 4. Kiểm tra user từ Context thay vì localStorage
    if (!user || !user.id) {
        alert("Bạn cần đăng nhập để thực hiện thanh toán!");
        // Có thể navigate sang trang login và lưu lại đường dẫn hiện tại để quay lại
        // navigate('/login', { state: { from: location } });
        return;
    }

    setLoading(true);

    try {
      const payload = {
        amount: amount,
        planId: planId,
        billingCycle: billingCycle,
        method: paymentMethod.toUpperCase(), 
        status: 'COMPLETED'
      };

      console.log("Đang gửi yêu cầu thanh toán:", payload);

      // 5. Gọi API với userId lấy từ Context
      // Lưu ý: user.id hay user.userId phụ thuộc vào cách bạn lưu trong AuthContext
      const response = await api.post('/payments/subscription', payload, {
        params: { userId: user.id } 
      });

      console.log("Kết quả từ Server:", response.data);

      alert(`✅ Thanh toán thành công!\nGói cước ${planName} đã được kích hoạt ngay lập tức.`);
      navigate('/driver/dashboard'); 

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán.";
      alert(`❌ Thất bại: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft /> Quay lại chọn gói
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#161b26] p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiUser className="text-blue-500" /> Thông tin đăng ký
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Họ và tên</label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-3 text-gray-500" />
                        <input 
                            name="fullName"
                            type="text" 
                            placeholder="Nguyễn Văn A"
                            className="w-full bg-[#0f1219] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none transition-colors text-white"
                            value={userInfo.fullName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-400">Số điện thoại</label>
                    <div className="relative">
                        <FiPhone className="absolute left-3 top-3 text-gray-500" />
                        <input 
                            name="phone"
                            type="tel" 
                            placeholder="0987..."
                            className="w-full bg-[#0f1219] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none transition-colors text-white"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3 text-gray-500" />
                        <input 
                            name="email"
                            type="email" 
                            placeholder="email@example.com"
                            className="w-full bg-[#0f1219] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none transition-colors text-white"
                            value={userInfo.email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-[#161b26] p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiCreditCard className="text-blue-500" /> Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {['vnpay', 'momo'].map((method) => (
                    <label key={method} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === method 
                        ? method === 'vnpay' ? 'border-blue-500 bg-blue-900/10' : 'border-pink-500 bg-pink-900/10'
                        : 'border-gray-700 hover:border-gray-600 bg-[#0f1219]'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                            {paymentMethod === method && <div className={`w-2.5 h-2.5 rounded-full ${method === 'vnpay' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-white">Ví {method === 'vnpay' ? 'VNPAY-QR' : 'MoMo'}</span>
                            <span className="text-xs text-gray-400">Thanh toán ngay (Demo)</span>
                        </div>
                    </div>
                    <span className={`font-bold italic ${method === 'vnpay' ? 'text-blue-400' : 'text-pink-500'}`}>
                        {method.toUpperCase()}
                    </span>
                    <input type="radio" name="payment" className="hidden" onClick={() => setPaymentMethod(method)} />
                    </label>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-1">
            <div className="bg-[#161b26] p-6 rounded-2xl border border-gray-800 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gói dịch vụ</span>
                  <span className="text-white font-semibold">{planName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Chu kỳ</span>
                  <span className="text-white capitalize">{billingCycle === 'monthly' ? 'Theo tháng' : 'Theo năm'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Thành tiền</span>
                  <span className="text-2xl font-bold text-blue-400">{amount?.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'
                }`}
              >
                {loading ? 'Đang kích hoạt...' : <><FiCheckCircle /> Thanh toán ngay</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}