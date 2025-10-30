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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-tight">
          Tạo tài khoản mới
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập..."
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Nhập họ và tên..."
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email..."
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Nhập số điện thoại..."
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition"
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center py-2 rounded ${
                message.includes("✅")
                  ? "text-green-600 bg-green-50"
                  : "text-red-500 bg-red-50"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-semibold tracking-wide hover:bg-gray-700 transition"
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-gray-900 font-medium hover:underline"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
