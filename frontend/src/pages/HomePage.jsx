// src/pages/ServicePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiZap, 
  FiRefreshCw, 
  FiShield, 
  FiMapPin, 
  FiSmartphone, 
  FiCheckCircle,
  FiArrowRight
} from "react-icons/fi";

const ServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans overflow-x-hidden">
      
      {/* === NAVBAR (Đơn giản) === */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-[#0B0F19]/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-800">
        <div className="text-2xl font-bold text-blue-500 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          ev_station <span className="text-white font-normal">Services</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-blue-400 transition">Tính năng</a>
          <a href="#process" className="hover:text-blue-400 transition">Quy trình</a>
          <a href="#pricing" className="hover:text-blue-400 transition">Bảng giá</a>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg shadow-blue-600/20"
          >
            Đăng ký ngay
          </button>
        </div>
      </nav>

      {/* === HERO SECTION === */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col md:flex-row items-center">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="w-full md:w-1/2 z-10 space-y-6">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
            🚀 Công nghệ pin thế hệ mới
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Năng lượng xanh <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Không giới hạn
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
            Hệ thống trạm đổi pin và sạc nhanh thông minh phủ sóng toàn quốc. 
            Tiết kiệm thời gian, tối ưu chi phí và bảo vệ môi trường.
          </p>
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              Bắt đầu ngay <FiArrowRight />
            </button>
            <button className="px-8 py-3.5 bg-[#161B28] hover:bg-[#1f2636] border border-gray-700 rounded-xl font-medium text-white transition">
              Tìm trạm gần nhất
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-12 md:mt-0 relative z-10 flex justify-center">
             {/* 

[Image of electric car at charging station illustration]
 */}
             {/* Placeholder Image */}
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                <img 
                  src="https://vinfastauto.com/themes/vinfast/images/vf8-360/vf8-lux/36.png" 
                  alt="EV Car" 
                  className="relative z-10 w-full max-w-lg drop-shadow-2xl animate-float"
                />
             </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section id="features" className="py-20 bg-[#050B14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tại sao chọn EV Station?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chúng tôi mang đến giải pháp toàn diện giúp việc vận hành xe điện trở nên dễ dàng hơn bao giờ hết.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#161B28] p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition">
                <FiRefreshCw size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Đổi pin siêu tốc</h3>
              <p className="text-gray-400 leading-relaxed">
                Chỉ mất chưa đầy 3 phút để thay thế pin đã cạn bằng pin đầy. Không còn nỗi lo chờ sạc hàng giờ đồng hồ.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#161B28] p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6 group-hover:bg-green-500 group-hover:text-white transition">
                <FiZap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sạc nhanh thông minh</h3>
              <p className="text-gray-400 leading-relaxed">
                Công nghệ sạc SuperCharge tự động điều chỉnh dòng điện, bảo vệ tuổi thọ pin và tối ưu thời gian sạc.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#161B28] p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6 group-hover:bg-purple-500 group-hover:text-white transition">
                <FiSmartphone size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quản lý qua App</h3>
              <p className="text-gray-400 leading-relaxed">
                Tìm trạm, đặt lịch, thanh toán và theo dõi sức khỏe pin ngay trên điện thoại của bạn mọi lúc mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="process" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
               <div className="relative bg-[#161B28] rounded-3xl p-8 border border-gray-800 shadow-2xl">
                  {/* Mockup UI App đơn giản */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-[#0B0F19] rounded-xl border border-gray-700">
                      <div className="p-3 bg-blue-600 rounded-full text-white"><FiMapPin /></div>
                      <div>
                        <div className="text-sm text-gray-400">Bước 1</div>
                        <div className="font-bold">Tìm trạm gần nhất</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-[#0B0F19] rounded-xl border border-gray-700 opacity-75">
                      <div className="p-3 bg-gray-700 rounded-full text-white"><FiRefreshCw /></div>
                      <div>
                        <div className="text-sm text-gray-400">Bước 2</div>
                        <div className="font-bold">Đến trạm & Đổi pin</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-[#0B0F19] rounded-xl border border-gray-700 opacity-50">
                      <div className="p-3 bg-gray-700 rounded-full text-white"><FiCheckCircle /></div>
                      <div>
                        <div className="text-sm text-gray-400">Bước 3</div>
                        <div className="font-bold">Thanh toán tự động</div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Trải nghiệm liền mạch chỉ trong vài thao tác</h2>
              <div className="space-y-6">
                {[
                  "Mở ứng dụng EV Station và tìm trạm đổi pin gần nhất.",
                  "Đặt lịch hẹn trước để không phải chờ đợi.",
                  "Lái xe vào khoang đổi pin tự động (hoặc nhờ nhân viên hỗ trợ).",
                  "Tiếp tục hành trình chỉ sau 3-5 phút."
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-lg">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === PRICING SECTION === */}
      <section id="pricing" className="py-20 bg-[#050B14]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Gói cước linh hoạt</h2>
            <p className="text-gray-400">Chọn gói phù hợp với nhu cầu di chuyển của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Basic Plan */}
            <div className="bg-[#161B28] p-8 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-gray-300 mb-2">Cơ bản</h3>
              <div className="text-3xl font-bold mb-6">300k <span className="text-sm text-gray-500 font-normal">/tháng</span></div>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> 5 lượt đổi pin</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Sạc thường miễn phí</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Hỗ trợ 24/7</li>
              </ul>
              <button className="w-full py-3 border border-gray-600 rounded-xl hover:bg-gray-800 transition">Đăng ký</button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-[#1E293B] p-8 rounded-2xl border-2 border-blue-500 transform scale-105 shadow-2xl relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Phổ biến nhất
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cao cấp</h3>
              <div className="text-4xl font-bold text-blue-400 mb-6">900k <span className="text-sm text-gray-500 font-normal">/tháng</span></div>
              <ul className="space-y-4 mb-8 text-gray-300">
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> 20 lượt đổi pin</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Sạc nhanh miễn phí</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Ưu tiên đặt lịch</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Báo cáo pin chi tiết</li>
              </ul>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">Đăng ký ngay</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#161B28] p-8 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-gray-300 mb-2">Doanh nghiệp</h3>
              <div className="text-3xl font-bold mb-6">Liên hệ</div>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Không giới hạn đổi pin</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> Quản lý đội xe</li>
                <li className="flex gap-2"><FiCheckCircle className="text-blue-500"/> API tích hợp riêng</li>
              </ul>
              <button className="w-full py-3 border border-gray-600 rounded-xl hover:bg-gray-800 transition">Liên hệ sale</button>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#02060C] py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-blue-500 mb-4">ev_station</h2>
            <p className="text-gray-500 max-w-sm">
              Đồng hành cùng bạn trên mọi nẻo đường xanh. Hệ thống năng lượng thông minh cho tương lai bền vững.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white">Thuê pin</a></li>
              <li><a href="#" className="hover:text-white">Trạm sạc</a></li>
              <li><a href="#" className="hover:text-white">Cứu hộ pin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>Hotline: 1900 1234</li>
              <li>Email: support@evstation.com</li>
              <li>Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 text-sm mt-12">
          © 2024 EV Station. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default ServicePage;