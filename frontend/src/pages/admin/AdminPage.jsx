import React, { useContext } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import { 
  FiUsers, 
  FiMapPin, 
  FiCalendar, 
  FiTruck, 
  FiBatteryCharging, 
  FiMessageSquare, 
  FiPackage, 
  FiPieChart, 
  FiBell, 
  FiLogOut, 
  FiSettings,
  FiGrid 
} from "react-icons/fi";

const AdminPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper để xác định class cho Link (Active state)
  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `p-3 rounded-xl transition flex items-center gap-3 font-medium ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
        : "text-gray-400 hover:bg-[#252A36] hover:text-white"
    }`;
  };

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-white font-sans">
      {/* === Sidebar (Fixed) === */}
      <aside className="w-64 bg-[#161B28] border-r border-gray-800 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiSettings className="text-blue-500 animate-spin-slow" size={28} /> 
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-4 overflow-y-auto custom-scrollbar">
          <Link to="/admin/users" className={getLinkClass("/admin/users")}>
            <FiUsers size={20} /> Quản lý người dùng
          </Link>
          <Link to="/admin/stations" className={getLinkClass("/admin/stations")}>
            <FiMapPin size={20} /> Quản lý trạm
          </Link>
         
          <Link to="/admin/batteries" className={getLinkClass("/admin/batteries")}>
            <FiBatteryCharging size={20} /> Quản lý pin
          </Link>
          <Link to="/admin/tickets" className={getLinkClass("/admin/tickets")}>
            <FiMessageSquare size={20} /> Support Ticket
          </Link>
          <Link to="/admin/battery-packages" className={getLinkClass("/admin/battery-packages")}>
            <FiPackage size={20} /> Gói thuê bao
          </Link>
          <Link to="/admin/reports" className={getLinkClass("/admin/reports")}>
            <FiPieChart size={20} /> Báo cáo & Thống kê
          </Link>
          
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2 font-medium group"
          >
            <FiLogOut className="group-hover:-translate-x-1 transition-transform" /> 
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 p-8 ml-64">
        {/* Header Section */}
       

        {/* Content Panel (Outlet Container) */}
        {/* Container này tạo nền tối cho nội dung con (Outlet) */}
        <div className="bg-[#161B28] border border-gray-800 rounded-3xl p-6 min-h-[calc(100vh-160px)] shadow-xl relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;