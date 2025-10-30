// src/pages/CustomerDashboardModern.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const [vehicleRes, reminderRes, historyRes, centerRes] = await Promise.all([
          api.get("/vehicles/me", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/reminders/me", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/services/history", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/stations", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setVehicles(vehicleRes.data || []);
        setReminders(reminderRes.data || []);
        setServiceHistory(historyRes.data || []);
        setCenters(centerRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-gray-600 animate-pulse">Đang tải dữ liệu...</div>;

  const vehicle = vehicles[0];
  const latestReminder = reminders[0];
  const latestService = serviceHistory[0];
  const nearestCenter = centers[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              👋 Xin chào, {user?.fullName || user?.username}
            </h2>
            <p className="text-gray-600 mt-2">
              Quản lý xe điện & dịch vụ nhanh chóng, tiện lợi.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/support-center")}
              className="border border-gray-800 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition"
            >
              ➕ Gửi yêu cầu hỗ trợ 
            </button>
            <button
              onClick={() => navigate("/payment")}
              className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              💰 Thanh toán
            </button>
            <button
              onClick={() => navigate("/my-vehicle")}
              className="border border-gray-800 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition"
            >
              ➕ Phương tiện
            </button>
            <button
              onClick={() => navigate("/booking")}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              📅 Đặt lịch
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Xe của tôi */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-2xl transition">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🚗 Xe của tôi</h3>
            {vehicle ? (
              <>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>PIN:</strong> {vehicle.batteryPercentage}%</p>
                <p><strong>Loại:</strong> {vehicle.batteryType}</p>
                <p><strong>VIN:</strong> {vehicle.vin}</p>
              </>
            ) : (
              <p className="text-gray-500">Chưa đăng ký phương tiện.</p>
            )}
          </div>

          {/* Nhắc nhở */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-2xl transition">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔔 Nhắc nhở gần nhất</h3>
            {latestReminder ? (
              <>
                <p>{latestReminder.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(latestReminder.date).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Không có nhắc nhở nào.</p>
            )}
          </div>

          {/* Trung tâm gần nhất */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-2xl transition">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🏢 Trung tâm gần nhất</h3>
            {nearestCenter ? (
              <>
                <p>{nearestCenter.name}</p>
                <p className="text-gray-600">{nearestCenter.address}</p>
                <p className="text-gray-600">{nearestCenter.phone}</p>
              </>
            ) : (
              <p className="text-gray-500">Không có trung tâm nào.</p>
            )}
          </div>
        </div>

        {/* Map & Service History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bản đồ */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-gray-900">
                🗺️ Bản đồ trung tâm dịch vụ
              </h3>
              <button
                onClick={() => navigate("/service-centers")}
                className="border border-gray-800 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:text-white transition"
              >
                📍 Xem danh sách
              </button>
            </div>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
              [Google Map hiển thị ở đây]
            </div>
          </div>

          {/* Lịch sử dịch vụ */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">📜 Lịch sử dịch vụ gần nhất</h3>
            {latestService ? (
              <div className="border-l-4 border-gray-800 pl-4">
                <p><strong>Loại:</strong> {latestService.type}</p>
                <p><strong>Chi phí:</strong> {latestService.cost} VND</p>
                <p><strong>Ngày:</strong> {new Date(latestService.date).toLocaleDateString()}</p>
                <p
                  className={`mt-2 font-semibold ${
                    latestService.status === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Trạng thái: {latestService.status}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Chưa có dịch vụ nào.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">&copy; 2025 EV Service Center. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerDashboard;
