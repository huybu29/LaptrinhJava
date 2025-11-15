import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Giả định bạn có service 'api'
import { FaBatteryFull, FaSpinner, FaTools, FaCheck } from "react-icons/fa";

// === Component Thẻ Thống kê ===
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-gray-800 p-6 rounded-xl flex items-center gap-5 shadow-lg border border-gray-700">
    <div className={`p-4 rounded-full ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-400">{title}</p>
    </div>
  </div>
);

// === Component Trang Tổng quan ===
const StaffDashboard = () => {
  const [stats, setStats] = useState({ full: 0, charging: 0, maintenance: 0 });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Giả định backend có 2 API cho staff
        // 1. Lấy thống kê pin của trạm này
        const statsRes = await api.get("/staff/inventory/stats"); 
        
        // 2. Lấy 5 lịch hẹn (booking) sắp tới của trạm này
        const bookingsRes = await api.get("/staff/bookings/upcoming"); 

        setStats(statsRes.data);
        setUpcomingBookings(bookingsRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
        // Dùng dữ liệu giả (mock) nếu API lỗi để demo
        setStats({ full: 12, charging: 8, maintenance: 2 });
        setUpcomingBookings([
          { id: 1, customerName: "Nguyễn Văn A", time: "2025-11-16T10:00:00", batteryType: "LFP 55.6 kWh", status: "PENDING" },
          { id: 2, customerName: "Trần Thị B", time: "2025-11-16T10:30:00", batteryType: "LFP 55.6 kWh", status: "PENDING" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý khi nhân viên nhấn "Xác nhận"
  const handleConfirmBooking = (bookingId) => {
    // Chuyển hướng sang trang chi tiết giao dịch
    // (Đây là nơi thực hiện bước 2.b của đề tài)
    navigate(`/staff/transactions/${bookingId}`); 
  };

  if (loading) {
    return <div className="text-center text-gray-300">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Thống kê Tồn kho Pin (Mục 2.a) */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Tồn kho Pin tại Trạm
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Pin Đầy (Sẵn sàng)"
            value={stats.full}
            icon={<FaBatteryFull size={24} className="text-white" />}
            colorClass="bg-green-600"
          />
          <StatCard
            title="Pin Đang Sạc"
            value={stats.charging}
            icon={<FaSpinner size={24} className="text-white" />}
            colorClass="bg-yellow-600"
          />
          <StatCard
            title="Pin Bảo dưỡng / Lỗi"
            value={stats.maintenance}
            icon={<FaTools size={24} className="text-white" />}
            colorClass="bg-red-600"
          />
        </div>
      </section>

      {/* 2. Lịch hẹn (Booking) Sắp tới (Mục 2.b) */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Lịch hẹn sắp tới
        </h2>
        
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          {upcomingBookings.length === 0 ? (
            <p className="text-gray-400 p-6 text-center">
              Không có lịch hẹn nào sắp tới.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
                <tr>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Thời gian hẹn</th>
                  <th className="p-4">Loại Pin yêu cầu</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-700">
                    <td className="p-4 text-white font-medium">
                      {booking.customerName}
                    </td>
                    <td className="p-4 text-gray-200">
                      {new Date(booking.time).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4 text-gray-200">
                      {booking.batteryType}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleConfirmBooking(booking.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        <FaCheck className="inline-block mr-1" />
                        Xác nhận
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default StaffDashboard;