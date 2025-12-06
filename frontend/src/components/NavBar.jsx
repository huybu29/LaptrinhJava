import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaHistory,
  FaHeadset,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

const CustomerLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Component item trong sidebar
  const SidebarItem = ({ icon, label, onClick, danger, badge }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition
        ${danger
          ? "text-red-400 hover:bg-red-900/20"
          : "text-gray-200 hover:bg-gray-800"
        }`}
    >
      <span className="mr-3 text-[#00B4D8] text-lg">{icon}</span>
      {label}

      {badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="text-2xl font-extrabold text-[#00B4D8] mb-6 text-center">
            EVM
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-10">
            <img
              src="https://i.pravatar.cc/80"
              alt="avatar"
              className="w-20 h-20 rounded-full mb-3"
            />
            <h2 className="text-lg font-semibold">{user?.name || "Người dùng"}</h2>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>

          {/* MENU theo ROLE */}
          <nav className="space-y-2">

            {/* ROLE_DRIVER */}
            {user?.role === "ROLE_DRIVER" && (
              <>
                <SidebarItem
                  icon={<FaTachometerAlt />}
                  label="Dashboard"
                  onClick={() => navigate("/driver/dashboard")}
                />
                <SidebarItem
                  icon={<FaCalendarAlt />}
                  label="Đặt lịch"
                  onClick={() => navigate("/driver/booking")}
                />
                <SidebarItem
                  icon={<FaHistory />}
                  label="Lịch sử giao dịch"
                  onClick={() => navigate("/driver/history")}
                />
                <SidebarItem
                  icon={<FaBell />}
                  label="Thông báo"
                  onClick={() => navigate("/driver/notifications")}
                  badge={3}
                />
                <SidebarItem
                  icon={<FaHeadset />}
                  label="Hỗ trợ"
                  onClick={() => navigate("/driver/support-center")}
                />
                <SidebarItem
                  icon={<FaBox />}
                  label="Gói thuê"
                  onClick={() => navigate("/driver/rental-packages")}
                />
              </>
            )}

            {/* ROLE_STAFF */}
            {user?.role === "ROLE_STAFF" && (
              <>
                <SidebarItem
                  icon={<FaTachometerAlt />}
                  label="Staff Dashboard"
                  onClick={() => navigate("/staff")}
                />
                <SidebarItem
                  icon={<FaHistory />}
                  label="Xử lý giao dịch"
                  onClick={() => navigate("/staff/transactions")}
                />
              </>
            )}

            {/* ROLE_ADMIN */}
            {user?.role === "ROLE_ADMIN" && (
              <>
                <SidebarItem
                  icon={<FaTachometerAlt />}
                  label="Admin Dashboard"
                  onClick={() => navigate("/admin")}
                />
                <SidebarItem
                  icon={<FaHistory />}
                  label="Quản lý hệ thống"
                  onClick={() => navigate("/admin/system")}
                />
              </>
            )}
          </nav>
        </div>

        {/* LOGOUT */}
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Đăng xuất"
          danger
          onClick={() => {
            logout();
            navigate("/login");
          }}
        />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
