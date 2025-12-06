import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await api.post("auth/login", { username, password });
      const token = loginRes.data.token;

      if (!token) {
        setError("⚠️ Lỗi: Không nhận được token.");
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userRes = await api.get("/users/me");
      const userRole = userRes.data.role;

      if (!userRole) {
        setError("⚠️ Lỗi: Không thể lấy role.");
        return;
      }

      login(token);

      switch (userRole) {
        case "ROLE_CUSTOMER":
          navigate("/driver/dashboard");
          break;
        case "ROLE_STAFF":
          navigate("/staff/dashboard");
          break;
        case "ROLE_ADMIN":
          navigate("/admin/dashboard");
          break;
        default:
          setError(`⚠️ Role không xác định: ${userRole}`);
          navigate("/");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("⚠️ Sai tên đăng nhập hoặc mật khẩu.");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  return (
    // CONTAINER CHÍNH: h-screen để full màn hình, không scroll
    <div className="flex h-screen w-full bg-[#0B0F19] text-white font-sans overflow-hidden">
      
      {/* --- LEFT SIDE (50%): IMAGE --- */}
      {/* w-1/2: Chiếm đúng 50% chiều rộng */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#050B14]">
        
        {/* Abstract Art / Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent z-10"></div>
        {/* Các vòng tròn trang trí */}
        <div className="absolute -bottom-1/2 -left-1/4 w-[140%] h-[140%] border-[1px] border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[120%] h-[120%] border-[1px] border-blue-500/10 rounded-full"></div>
        
        {/* Nội dung trên ảnh */}
        <div className="z-20 text-center px-12">
           {/* 

[Image of electric vehicle charging station illustration]
 */}
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Năng lượng xanh <br/> <span className="text-blue-500">Cho tương lai</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            Hệ thống quản lý và vận hành trạm sạc xe điện thông minh, tiện lợi và an toàn.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE (50%): FORM --- */}
      {/* w-full trên mobile, lg:w-1/2 trên desktop => Chia đều 50/50 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0B0F19] px-4">
        
        {/* FORM WRAPPER: Giới hạn max-width 400px để form gọn đẹp trong khung 50% */}
        <div className="w-full max-w-[400px]">
          
          {/* Logo & Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2 mb-2">
              ev_station <span className="text-white font-normal">System</span>
            </h1>
            <h2 className="text-3xl font-bold text-white">Đăng nhập</h2>
            <p className="text-gray-400 mt-2">Nhập thông tin chi tiết của bạn để vào hệ thống</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-[#161B28] p-1 rounded-xl mb-8">
            <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#1E293B] text-white shadow-md">
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1E293B]/50 transition-all"
            >
              Đăng ký
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Tên đăng nhập</label>
              <input
                type="text"
                placeholder="Ví dụ: user123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Mật khẩu</label>
                <a href="#" className="text-xs text-blue-400 hover:underline">Quên mật khẩu?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#161B28] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white placeholder-gray-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 transition-all duration-200 mt-2"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <span 
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:text-blue-400 font-medium ml-1 cursor-pointer hover:underline"
            >
              Đăng ký ngay
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;