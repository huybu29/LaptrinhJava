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
    try {
      // 1. Gọi API Login để lấy Token
      const loginRes = await api.post("auth/login", { username, password });
      const token = loginRes.data.token;

      if (!token) {
        setError("⚠️ Lỗi: Không nhận được token từ server.");
        return;
      }

      // 2. Cấu hình instance 'api' để dùng token này cho lệnh gọi tiếp theo
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 3. Gọi API /users/me để lấy Role
      // (Giả sử AuthProvider gọi http://localhost:8067/api/users/me, 
      //  nhưng nếu api service của bạn có baseURL khác, hãy chỉ định URL đầy đủ)
      const userRes = await api.get("/users/me"); 
      const userRole = userRes.data.role;

      if (!userRole) {
        setError("⚠️ Lỗi: Không thể lấy được thông tin Role.");
        return;
      }

      // 4. Kích hoạt AuthContext
      login(token);

      // 5. Điều hướng dựa trên role
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
      setError("⚠️ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      
      // Xóa token (nếu có) khỏi header nếu lỗi
      delete api.defaults.headers.common["Authorization"];
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
        {/* 

[Image of an electric vehicle charging]
 */}
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Hệ thống EVM
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                } bg-gray-700 text-white placeholder-gray-400`}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                } bg-gray-700 text-white placeholder-gray-400`}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-center bg-red-900/20 py-2 rounded-md text-sm">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition duration-200"
            >
              Đăng nhập
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-blue-400 font-medium hover:underline"
            >
              Đăng ký ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;