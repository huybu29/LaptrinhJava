import React, { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBatteryFull,
  FaExchangeAlt,
  FaSignOutAlt,
  FaCalendarAlt // 1. Import icon đăng xuất
} from "react-icons/fa";
import { AuthContext } from "../../services/AuthContext"; // 2. Import AuthContext

// Component Link cho Sidebar (để xử lý active link)
const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

// 3. Component Button mới cho Đăng xuất
const SidebarButton = ({ icon, label, onClick, danger }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors w-full ${
        danger
          ? "text-red-400 hover:bg-red-900/50" // Thêm style 'danger'
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

const StaffLayout = () => {
  // 4. Lấy hàm logout và navigate
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Chuyển về trang đăng nhập
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* Sidebar */}
      {/* 5. Thêm 'justify-between' để đẩy nút Đăng xuất xuống dưới */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col shadow-lg justify-between">
        {/* 6. Bọc phần logo và nav vào 1 div */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
           BSS Staff
          </h2>

          <nav className="flex flex-col gap-3">
            <SidebarLink
              to="/staff/dashboard"
              icon={<FaTachometerAlt />}
              label="Tổng quan"
            />
            <SidebarLink
              to="/staff/inventory"
              icon={<FaBatteryFull />}
              label="Quản lý Tồn kho"
            />
            <SidebarLink 
            to="/staff/bookings"
            icon={<FaCalendarAlt />}
            label="Quản lý Đặt lịch"
            />
            
          </nav>
        </div>

        {/* 7. Thêm nút Đăng xuất */}
        <div>
          <SidebarButton
            icon={<FaSignOutAlt />}
            label="Đăng xuất"
            danger
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content (Giữ nguyên) */}
      <main className="flex-1 p-8 overflow-y-auto">
       

        {/* Main Panel */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-800">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;