// src/pages/admin/AdminDashboardModern.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-grey mb-8">
          ⚙️ Admin Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/admin/users"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            👤 Quản lý người dùng
          </Link>
          <Link
            to="/admin/stations"
            className="p-3 rounded-xl hover:bg-green-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🏭 Quản lý trạm
          </Link>
          <Link
            to="/admin/bookings"
            className="p-3 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            📅 Quản lý đặt lịch
          </Link>
          <Link
            to="/admin/vehicles"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🚗 Quản lý phương tiện
          </Link>
          <Link
            to="/admin/batteries"
            className="p-3 rounded-xl hover:bg-green-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý  pin
          </Link>
          <Link
            to="/admin/tickets"
            className="p-3 rounded-xl hover:bg-purple-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            Quản lý support ticket
          </Link>
          <Link
            to="/admin/battery-packages"
            className="p-3 rounded-xl hover:bg-purple-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            Quản lý gói thuê
          </Link>
          <Link
            to="/admin/reports"
            className="p-3 rounded-xl hover:bg-red-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            📊 Báo cáo & thống kê
          </Link>
          <Link
            to="/admin/notification"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            👤 Quản lý thông báo
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Xin chào, Admin 👋
          </h1>
          <p className="text-gray-600">
            Bảng điều khiển tổng quan hệ thống EV Service Center.
          </p>
        </div>

      

        {/* Main Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* Outlet sẽ render các trang con như /admin/users, /admin/stations,... */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
