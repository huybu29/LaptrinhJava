import React, { useState } from 'react';
import { 
  FiCheck, 
  FiCreditCard, 
  FiTruck, 
  FiCalendar, 
  FiShield, 
  FiPlus,
  FiZap, // Icon cho gói giả lập
  FiArrowLeft
} from 'react-icons/fi';

// --- 1. MOCK DATA (DỮ LIỆU GIẢ LẬP) ---

// Gói cước giả định được chọn từ trang trước
const MOCK_SELECTED_PLAN = {
  id: 2,
  name: 'Gói Tiêu Chuẩn',
  description: 'Phổ biến nhất cho nhu cầu đi làm',
  price: { monthly: 350000, yearly: 3500000 },
  icon: <FiZap className="w-8 h-8" />
};

// Danh sách xe của người dùng
const MOCK_USER_VEHICLES = [
  { id: 'v1', name: 'VinFast VF e34 - 29A-123.45', type: 'Electric SUV', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100' },
  { id: 'v2', name: 'VinFast Klara S - 29-MD1-999.99', type: 'Electric Scooter', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=100' },
];

// Phương thức thanh toán đã lưu
const MOCK_PAYMENT_METHODS = [
  { id: 'pm1', brand: 'Visa', last4: '4242', expiry: '12/25' },
  { id: 'pm2', brand: 'MasterCard', last4: '8888', expiry: '10/24' },
];

// --- COMPONENT CHÍNH ---

export default function SubscriptionCheckoutPage() {
  // State quản lý
  const [billingCycle, setBillingCycle] = useState('monthly'); // Giả lập user chọn gói tháng
  const [selectedVehicle, setSelectedVehicle] = useState(MOCK_USER_VEHICLES[0].id);
  const [paymentMethod, setPaymentMethod] = useState(MOCK_PAYMENT_METHODS[0].id);
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Tính toán giá
  const basePrice = MOCK_SELECTED_PLAN.price[billingCycle];
  const discountPercent = billingCycle === 'yearly' ? 0.15 : 0; // Giảm 15% nếu trả năm
  const discountAmount = basePrice * discountPercent;
  const priceAfterDiscount = basePrice - discountAmount;
  const vat = priceAfterDiscount * 0.08; // VAT 8%
  const finalPrice = priceAfterDiscount + vat;

  // Xử lý thanh toán
  const handlePayment = () => {
    if (!termsAccepted) {
      alert('Vui lòng đồng ý với điều khoản dịch vụ.');
      return;
    }
    
    setIsProcessing(true);
    
    // Giả lập gọi API mất 2 giây
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Thanh toán thành công!\n- Gói: ${MOCK_SELECTED_PLAN.name}\n- Xe: ${selectedVehicle}\n- Tổng tiền: ${finalPrice.toLocaleString('vi-VN')}đ`);
      // Ở đây bạn sẽ redirect user về trang quản lý hoặc trang chủ
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 p-4 md:p-12 font-sans flex justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === CỘT TRÁI: FORM THÔNG TIN === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <button className="p-2 rounded-full bg-[#161b26] border border-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
                <FiArrowLeft />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Xác nhận đăng ký</h1>
          </div>

          {/* 1. Chọn xe áp dụng */}
          <section className="bg-[#161b26] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiTruck className="text-blue-500" /> Chọn xe áp dụng
            </h2>
            <div className="space-y-3">
              {MOCK_USER_VEHICLES.map((vehicle) => (
                <label 
                  key={vehicle.id}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all group ${
                    selectedVehicle === vehicle.id 
                      ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500' 
                      : 'bg-[#0f1219] border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="vehicle" 
                      value={vehicle.id}
                      checked={selectedVehicle === vehicle.id}
                      onChange={() => setSelectedVehicle(vehicle.id)}
                      className="accent-blue-600 w-5 h-5"
                    />
                    {/* Hình ảnh xe giả lập */}
                    <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                        {/* Dùng div màu nếu ảnh lỗi */}
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-500">Img</div>
                    </div>
                    <div>
                      <p className={`font-bold transition-colors ${selectedVehicle === vehicle.id ? 'text-blue-400' : 'text-white'}`}>
                        {vehicle.name}
                      </p>
                      <p className="text-sm text-gray-400">{vehicle.type}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 2. Phương thức thanh toán */}
          <section className="bg-[#161b26] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiCreditCard className="text-blue-500" /> Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {MOCK_PAYMENT_METHODS.map((pm) => (
                <label 
                  key={pm.id}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === pm.id 
                      ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500' 
                      : 'bg-[#0f1219] border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="payment" 
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{pm.brand}</span>
                        <span className="text-gray-400 text-sm">•••• {pm.last4}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Hết hạn: {pm.expiry}</p>
                    </div>
                  </div>
                  {paymentMethod === pm.id && <FiCheck className="text-blue-500" />}
                </label>
              ))}
              
              <button className="w-full py-4 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 hover:bg-[#1f2937] transition-all flex items-center justify-center gap-2 font-medium">
                <FiPlus /> Thêm thẻ / Ví điện tử mới
              </button>
            </div>
          </section>

          {/* 3. Tùy chọn bổ sung & Điều khoản */}
          <section className="space-y-4">
             {/* Auto renewal toggle */}
             <div className="flex items-center justify-between bg-[#161b26] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                      <FiCalendar />
                   </div>
                   <div>
                      <p className="text-white font-medium">Tự động gia hạn</p>
                      <p className="text-sm text-gray-400">Gói cước sẽ tự động gia hạn vào cuối chu kỳ</p>
                   </div>
                </div>
                <div 
                    onClick={() => setAutoRenewal(!autoRenewal)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${autoRenewal ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${autoRenewal ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
             </div>

             {/* Terms Checkbox */}
             <label className="flex items-start gap-3 cursor-pointer p-2 group">
                <div className="relative flex items-center">
                    <input 
                    type="checkbox" 
                    checked={termsAccepted} 
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-600 bg-gray-700 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400" 
                    />
                    <FiCheck className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                   Tôi xác nhận thông tin là chính xác và đồng ý với <a href="#" className="text-blue-400 hover:underline">Điều khoản dịch vụ</a> cùng <a href="#" className="text-blue-400 hover:underline">Chính sách bảo mật</a> của ứng dụng.
                </span>
             </label>
          </section>
        </div>

        {/* === CỘT PHẢI: TÓM TẮT ĐƠN HÀNG === */}
        <div className="lg:col-span-1">
          <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-6 sticky top-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Tóm tắt đơn hàng</h3>
            
            {/* Plan Info */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-800">
               <div className="w-14 h-14 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center text-blue-400 shrink-0">
                  {MOCK_SELECTED_PLAN.icon}
               </div>
               <div>
                  <h4 className="font-bold text-white text-lg leading-tight">{MOCK_SELECTED_PLAN.name}</h4>
                  <select 
                    value={billingCycle} 
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="mt-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                  >
                    <option value="monthly">Theo tháng</option>
                    <option value="yearly">Theo năm (-15%)</option>
                  </select>
               </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
               <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Giá gói cước</span>
                  <span className="text-white font-medium">{basePrice.toLocaleString('vi-VN')} đ</span>
               </div>
               
               {billingCycle === 'yearly' && (
                  <div className="flex justify-between text-sm">
                     <span className="text-green-500 flex items-center gap-1"><FiShield size={12}/> Ưu đãi năm</span>
                     <span className="text-green-500">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
               )}
               
               <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Thuế VAT (8%)</span>
                  <span className="text-white">+{vat.toLocaleString('vi-VN')} đ</span>
               </div>
            </div>

            <div className="border-t border-gray-800 pt-4 mb-8">
               <div className="flex justify-between items-end">
                  <span className="text-gray-200 font-bold">Tổng thanh toán</span>
                  <div>
                    <span className="block text-2xl font-bold text-blue-500 text-right">
                        {finalPrice.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-xs text-gray-500 text-right block mt-1">
                        Gia hạn tiếp theo: {new Date(new Date().setMonth(new Date().getMonth() + (billingCycle === 'monthly' ? 1 : 12))).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
               <button 
                  onClick={handlePayment}
                  disabled={!termsAccepted || isProcessing}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                     !termsAccepted || isProcessing
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/30 hover:-translate-y-0.5'
                  }`}
               >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FiShield /> Xác nhận thanh toán
                    </>
                  )}
               </button>
               
               <p className="text-[10px] text-center text-gray-500 leading-relaxed px-4">
                   Bằng việc xác nhận, bạn đồng ý để chúng tôi tự động trừ tiền vào phương thức thanh toán đã chọn cho các kỳ hạn tiếp theo.
               </p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}