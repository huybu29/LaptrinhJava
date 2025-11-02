import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);

  // Hàm tính khoảng cách giữa 2 điểm (Haversine)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // bán kính Trái đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const [vehicleRes, centerRes] = await Promise.all([
          api.get("/vehicles/me", { headers: { Authorization: `Bearer ${token}` } }),
          
         
          api.get("/stations", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setVehicles(vehicleRes.data || []);
        
        setCenters(centerRes.data || []);
        console.log("📡 Dữ liệu trạm:", centerRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Lấy vị trí hiện tại của người dùng
    if (!navigator.geolocation) {
      setGeoError("Trình duyệt không hỗ trợ GPS");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGeoError("Không thể lấy tọa độ. Hãy bật GPS hoặc cho phép quyền.")
      );
    }
  }, []);

  // Tìm trạm gần nhất
  useEffect(() => {
    if (userCoords.lat && centers.length > 0) {
      let nearest = centers[0];
      let minDist = getDistance(userCoords.lat, userCoords.lng, centers[0].latitude, centers[0].longitude);
      centers.forEach((st) => {
        const dist = getDistance(userCoords.lat, userCoords.lng, st.latitude, st.longitude);
        if (dist < minDist) {
          minDist = dist;
          nearest = st;
        }
      });
      setNearestStation(nearest);
    }
  }, [userCoords, centers]);

  if (loading)
    return <div className="text-center mt-10 text-gray-600 animate-pulse">Đang tải dữ liệu...</div>;

  const vehicle = vehicles[0];
  const latestReminder = reminders[0];
  const latestService = serviceHistory[0];
  const mapCenter = {
    lat: userCoords.lat || nearestStation?.latitude || 10.8231,
    lng: userCoords.lng || nearestStation?.longitude || 106.6297,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* --- 3 thẻ thông tin chính --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Xe */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">🚗 Xe của tôi</h3>
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
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">🔔 Nhắc nhở gần nhất</h3>
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

          {/* Trạm gần nhất */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">🏢 Trạm sạc gần nhất</h3>
            {nearestStation ? (
              <>
                <p>{nearestStation.name}</p>
                <p className="text-gray-600">{nearestStation.location}</p>
                <p className="text-gray-600">⚡ {nearestStation.capacity} pin</p>
                <p
                  className={`text-sm font-semibold ${
                    nearestStation.status === "Hoạt động" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {nearestStation.status}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Không có trạm sạc nào.</p>
            )}
          </div>
        </div>

        {/* --- Bản đồ & Lịch sử --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Map */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🗺️ Bản đồ trạm sạc</h3>
            {geoError && <p className="text-red-500 mb-2">{geoError}</p>}

            <div className="h-64 rounded-xl overflow-hidden">
              <LoadScript googleMapsApiKey="AIzaSyBAOGNM5Aqs3eL-LYk9Sx1d8cljbIqZfXM">
                <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={mapCenter} zoom={13}>
                  {userCoords.lat && userCoords.lng && <Marker position={userCoords} label="Bạn" />}
                  {centers.map((station, index) => (
                    <Marker
                      key={index}
                      position={{
                        lat: station.latitude || station.lat,
                        lng: station.longitude || station.lng,
                      }}
                      onClick={() => setSelectedStation(station)}
                      icon={
                        nearestStation && station.id === nearestStation.id
                          ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                          : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                      }
                    />
                  ))}
                  {selectedStation && (
                    <InfoWindow
                      position={{
                        lat: selectedStation.latitude || selectedStation.lat,
                        lng: selectedStation.longitude || selectedStation.lng,
                      }}
                      onCloseClick={() => setSelectedStation(null)}
                    >
                      <div className="text-sm">
                        <strong>{selectedStation.name}</strong><br />
                        📍 {selectedStation.location}<br />
                        ⚡ {selectedStation.capacity} pin<br />
                        {selectedStation.status}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          {/* Lịch sử dịch vụ */}
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-3">📜 Lịch sử dịch vụ gần nhất</h3>
            {latestService ? (
              <div className="border-l-4 border-gray-800 pl-4">
                <p><strong>Loại:</strong> {latestService.type}</p>
                <p><strong>Chi phí:</strong> {latestService.cost} VND</p>
                <p><strong>Ngày:</strong> {new Date(latestService.date).toLocaleDateString()}</p>
                <p
                  className={`mt-2 font-semibold ${
                    latestService.status === "completed" ? "text-green-600" : "text-yellow-600"
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

      <footer className="bg-gray-900 text-gray-300 py-10 mt-12 text-center">
        <p className="text-sm">&copy; 2025 EV Service Center. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerDashboard;
