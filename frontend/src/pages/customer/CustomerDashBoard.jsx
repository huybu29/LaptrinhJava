// src/pages/CustomerDashboardModern.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState("");
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

    // Lấy vị trí người dùng
    if (!navigator.geolocation) {
      setGeoError("Trình duyệt không hỗ trợ GPS");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setGeoError("Không thể lấy tọa độ. Hãy bật GPS / cho phép quyền.")
      );
    }
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-gray-600 animate-pulse">Đang tải dữ liệu...</div>;

  const vehicle = vehicles[0];
  const latestReminder = reminders[0];
  const latestService = serviceHistory[0];
  const nearestCenter = centers[0];

  // Default HCM if no data
  const mapCenter = {
    lat: nearestCenter?.latitude || 10.8231,
    lng: nearestCenter?.longitude || 106.6297,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">👋 Xin chào, {user?.fullName || user?.username}</h2>
            <p className="text-gray-600 mt-2">Quản lý xe điện & dịch vụ nhanh chóng, tiện lợi.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button onClick={() => navigate("/support-center")} className="border border-gray-800 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition">
              ➕ Gửi yêu cầu hỗ trợ
            </button>
            <button onClick={() => navigate("/payment")} className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
              💰 Thanh toán
            </button>
            <button onClick={() => navigate("/my-vehicle")} className="border border-gray-800 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition">
              ➕ Phương tiện
            </button>
            <button onClick={() => navigate("/booking")} className="bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
              📅 Đặt lịch
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Xe */}
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

          {/* Reminder */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-2xl transition">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔔 Nhắc nhở gần nhất</h3>
            {latestReminder ? (
              <>
                <p>{latestReminder.message}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(latestReminder.date).toLocaleDateString()}</p>
              </>
            ) : (
              <p className="text-gray-500">Không có nhắc nhở nào.</p>
            )}
          </div>

          {/* Nearest Center */}
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

        {/* Map + Service History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-gray-900">🗺️ Bản đồ trung tâm dịch vụ</h3>
              <button onClick={() => navigate("/service-centers")} className="border border-gray-800 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:text-white transition">
                📍 Xem danh sách
              </button>
            </div>

            {geoError && <p className="text-red-500 mb-2">{geoError}</p>}

            <div className="h-64 rounded-xl overflow-hidden">
              <LoadScript googleMapsApiKey="AIzaSyBAOGNM5Aqs3eL-LYk9Sx1d8cljbIqZfXM">
                <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={mapCenter} zoom={14}>
                  {nearestCenter && <Marker position={{ lat: nearestCenter.latitude, lng: nearestCenter.longitude }} />}
                  {/* Marker người dùng */}
                  {userCoords.lat && userCoords.lng && (
                    <Marker position={{ lat: userCoords.lat, lng: userCoords.lng }} label="Bạn" />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          {/* Service History */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">📜 Lịch sử dịch vụ gần nhất</h3>
            {latestService ? (
              <div className="border-l-4 border-gray-800 pl-4">
                <p><strong>Loại:</strong> {latestService.type}</p>
                <p><strong>Chi phí:</strong> {latestService.cost} VND</p>
                <p><strong>Ngày:</strong> {new Date(latestService.date).toLocaleDateString()}</p>
                <p className={`mt-2 font-semibold ${latestService.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
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
      <footer className="bg-gray-900 text-gray-300 py-10 mt-12 text-center">
        <p className="text-sm">&copy; 2025 EV Service Center. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerDashboard;

