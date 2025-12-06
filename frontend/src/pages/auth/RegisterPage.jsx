import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      await api.post("auth/register", form);
      setMessage("✅ Đăng ký thành công! Đang chuyển hướng...");
      // Delay nhẹ để người dùng đọc thông báo thành công
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      // Lấy message lỗi từ backend nếu có
      const errorMsg = err.response?.data?.message || err.response?.data || "⚠️ Đăng ký thất bại.";
      setMessage(typeof errorMsg === 'string' ? errorMsg : "⚠️ Có lỗi xảy ra.");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] text-white font-sans overflow-hidden">
      
      {/* --- LEFT SIDE: IMAGE (Giống trang Login) --- */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#050B14]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent z-10"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[140%] h-[140%] border-[1px] border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[120%] h-[120%] border-[1px] border-blue-500/10 rounded-full"></div>
        
        <div className="z-20 text-center px-12">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Tham gia cùng <br/> <span className="text-blue-500">EV Station</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            Kiến tạo mạng lưới giao thông xanh và bền vững ngay hôm nay.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: REGISTER FORM --- */}
      {/* Thêm 'overflow-y-auto' để scroll được nếu form dài quá màn hình */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0B0F19] px-4 overflow-y-auto">
        
        <div className="w-full max-w-[400px] py-10">
          
          {/* Logo & Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2 mb-2">
              ev_station <span className="text-white font-normal">System</span>
            </h1>
            <h2 className="text-3xl font-bold text-white">Tạo tài khoản</h2>
            <p className="text-gray-400 mt-2">Điền thông tin để tham gia hệ thống</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-[#161B28] p-1 rounded-xl mb-6">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1E293B]/50 transition-all"
            >
              Đăng nhập
            </button>
            <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#1E293B] text-white shadow-md">
              Đăng ký
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                placeholder="Ví dụ: user123"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                placeholder="0912xxxxxx"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
              />
            </div>

            {/* Message Notification */}
            {message && (
              <div
                className={`text-sm text-center py-3 rounded-lg border ${
                  message.includes("✅")
                    ? "bg-green-500/10 border-green-500/50 text-green-400"
                    : "bg-red-500/10 border-red-500/50 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 transition-all duration-200 mt-2"
            >
              ĐĂNG KÝ
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <span 
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-400 font-medium ml-1 cursor-pointer hover:underline"
            >
              Đăng nhập ngay
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;