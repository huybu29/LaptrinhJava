// src/pages/RegisterPage.jsx
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
    try {
      await api.post("auth/register", form);
      setMessage("✅ Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || "⚠️ Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Register Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Tạo tài khoản mới
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                name="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Message */}
            {message && (
              <p
                className={`text-sm text-center py-2 rounded ${
                  message.includes("✅")
                    ? "text-green-400 bg-green-900/20"
                    : "text-red-400 bg-red-900/20"
                }`}
              >
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition duration-200"
            >
              Đăng ký
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-blue-400 font-medium hover:underline"
            >
              Đăng nhập ngay
            </a>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
        
      </div>
    </div>
  );
};

export default RegisterPage;
