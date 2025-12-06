import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Axios instance (đã cấu hình interceptor)
import { AuthContext } from "../../services/AuthContext";
import { 
  FiTruck, 
  FiHash, 
  FiBatteryCharging, 
  FiArrowLeft, 
  FiCheckCircle,
  FiInfo 
} from "react-icons/fi";

const RegisterVehicle = () => {
  const navigate = useNavigate();
  // Chúng ta không cần lấy userId từ AuthContext để gửi thủ công nữa
  // vì Interceptor sẽ lấy từ storage và gắn vào header X-User-Id

  const [formData, setFormData] = useState({
    vin: "",
    model: "",
    battery_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Chuẩn bị dữ liệu khớp với VehicleDTO của Java
      const payload = {
        vin: formData.vin,
        model: formData.model,
        batteryType: formData.battery_type, // Chuyển sang camelCase để khớp DTO
        // ownerId: Không cần gửi, Backend tự lấy từ header X-User-Id
      };

      // GỌI API: Không truyền header ở đây (Interceptor tự lo)
      // Đường dẫn giả định baseURL chưa có /api, nếu có rồi thì sửa thành "/vehicles"
      await api.post("/vehicles", payload);
      
      // Thành công
      navigate("/driver/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      
      // Xử lý thông báo lỗi từ Backend (ResponseStatusException)
      const errorMessage = err.response?.data?.message || err.response?.data || "Lỗi đăng ký xe.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-6 font-sans">
      
      {/* === CONTAINER RỘNG (Max-width 5XL) === */}
      <div className="max-w-5xl w-full bg-[#161B28] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* === CỘT TRÁI: INFO / DECORATION === */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-900/40 to-[#0B0F19] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại Dashboard
            </button>
            
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              Kết nối phương tiện
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Đăng ký xe vào hệ thống để mở khóa các tính năng thông minh: theo dõi pin thời gian thực và đặt lịch trạm sạc.
            </p>
          </div>

          <div className="relative z-10 mt-10 flex justify-center">
             <div className="w-full h-40 bg-blue-500/10 rounded-2xl border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                <FiTruck size={64} className="text-blue-400" />
             </div>
          </div>
        </div>

        {/* === CỘT PHẢI: FORM === */}
        <div className="w-full md:w-3/5 p-8 md:p-12 bg-[#161B28]">
          <h2 className="text-2xl font-bold mb-6">Thông tin xe</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-3 text-sm">
              <FiInfo size={24} className="shrink-0" />
              <span>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input: VIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Số VIN (Số khung)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <FiHash size={20} />
                </div>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số khung..."
                  className="w-full bg-[#0B0F19] border border-gray-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 font-mono"
                />
              </div>
            </div>

            {/* Grid 2 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Input: Model */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Dòng xe</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <FiTruck size={20} />
                  </div>
                  <select 
                     name="model"
                     value={formData.model}
                     onChange={handleChange}
                     required
                     className="w-full bg-[#0B0F19] border border-gray-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                  >
                      <option value="" disabled>Chọn dòng xe</option>
                      <option value="VF e34">VinFast VF e34</option>
                      <option value="VF 8">VinFast VF 8</option>
                      <option value="VF 9">VinFast VF 9</option>
                      <option value="VF 5">VinFast VF 5 Plus</option>
                  </select>
                </div>
              </div>

              {/* Input: Battery Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Loại Pin</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <FiBatteryCharging size={20} />
                  </div>
                  <input
                    type="text"
                    name="battery_type"
                    value={formData.battery_type}
                    onChange={handleChange}
                    required
                    placeholder="VD: LFP 60kWh"
                    className="w-full bg-[#0B0F19] border border-gray-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-800 flex flex-col-reverse md:flex-row gap-4 items-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full md:w-auto px-8 py-3.5 text-gray-400 font-medium hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02]
                  ${loading 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-900/30"
                  }`}
              >
                {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
                {!loading && <FiCheckCircle size={20} />}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterVehicle;