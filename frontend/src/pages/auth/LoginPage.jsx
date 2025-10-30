// src/pages/LoginPage.jsx
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
      const res = await api.post("auth/login", { username, password });
      const token = res.data.token;
      login(token);
      navigate("/driver");
    } catch (err) {
      console.error("Login failed", err);
      setError("⚠️ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-tight">
          Đăng nhập hệ thống
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-semibold tracking-wide hover:bg-gray-700 transition"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-gray-900 font-medium hover:underline"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
