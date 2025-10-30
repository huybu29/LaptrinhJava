// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-extrabold tracking-wide">
        <Link to="/driver" className="hover:text-white transition duration-200">
          ⚡ EV Service Center
        </Link>
      </div>

      {/* Menu links */}
      <div className="hidden md:flex space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-white transition duration-200">
          Trang chủ
        </Link>
        <a href="#features" className="hover:text-white transition duration-200">
          Tính năng
        </a>
        <a href="#pricing" className="hover:text-white transition duration-200">
          Gói dịch vụ
        </a>
        <a href="#contact" className="hover:text-white transition duration-200">
          Liên hệ
        </a>
      </div>

      {/* User / Auth Buttons */}
      <div className="flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-gray-300">
              👋 Xin chào,{" "}
              <span className="font-semibold text-white">
                {user?.username || "Người dùng"}
              </span>
            </span>

            {user?.role === "ROLE_ADMIN" && (
              <Link to="/admin">
                <button className="border border-gray-500 text-gray-100 hover:bg-gray-800 px-3 py-2 rounded-lg text-sm transition">
                  ⚙️ Quản trị
                </button>
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="border border-gray-400 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm">
                Đăng nhập
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">
                Đăng ký
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
