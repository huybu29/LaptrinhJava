import React from "react";
import { Link, Outlet } from "react-router-dom";

const StaffPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          🔋 Staff Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/staff/dashboard"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🏠 Trang tổng quan
          </Link>

          <Link
            to="/staff/batteries"
            className="p-3 rounded-xl hover:bg-green-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🔋 Quản lý pin
          </Link>

          <Link
            to="/staff/bookings"
            className="p-3 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            📅 Giao dịch đổi pin
          </Link>

          <Link
            to="/staff/vehicles"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🚗 Quản lý phương tiện
          </Link>

          <Link
            to="/staff/tickets"
            className="p-3 rounded-xl hover:bg-purple-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🎫 Hỗ trợ & sự cố
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Xin chào, Nhân viên trạm 👋
          </h1>
          <p className="text-gray-600">
            Bảng điều khiển trạm đổi pin xe điện – quản lý pin, xe, và giao dịch.
          </p>
        </div>

        {/* Main Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* Outlet để hiển thị các trang con như /staff/batteries, /staff/bookings,... */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffPage;
