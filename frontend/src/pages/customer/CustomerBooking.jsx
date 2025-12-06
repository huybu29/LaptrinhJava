// src/pages/customer/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../services/api";
// Import thêm FiNavigation để làm nút chỉ đường
import { FiSearch, FiNavigation } from "react-icons/fi"; 
import { IoFlash } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [filter, setFilter] = useState("ALL");
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState("");
  const [loading, setLoading] = useState(true);

  // Date/Time selection (can be used in detail page)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  // Calculate distance between two coordinates (Logic cũ giữ nguyên)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
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
    if (!navigator.geolocation) {
      setGeoError("Trình duyệt không hỗ trợ GPS");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);

        try {
          const res = await api.get("/stations/nearest/", {
            params: { latitude: coords.lat, longitude: coords.lng, n: 10 },
            headers: { "X-User-Role": "CUSTOMER" },
          });
          setStations(res.data);
        } catch (err) {
          console.error("Lỗi tải trạm gần nhất:", err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setGeoError("Không thể lấy tọa độ. Hãy bật GPS hoặc cho phép quyền.");
        setLoading(false);
      }
    );
  }, []);

  const getMarkerColor = (st) => {
    switch (st.status) {
      case "AVAILABLE":
      case "ACTIVE": // Thêm case ACTIVE nếu backend trả về
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // Xanh
      case "LOW_STOCK":
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; // Vàng
      case "UNAVAILABLE":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; // Đỏ
      default:
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  const filteredStations = stations.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    
    // Logic filter cũ
    const matchFilter =
      filter === "ALL" ||
      (filter === "AVAILABLE" && (s.status === "AVAILABLE" || s.status === "ACTIVE")) || // Hỗ trợ cả ACTIVE
      (filter === "LOW_STOCK" && s.status === "LOW_STOCK") ||
      (filter === "UNAVAILABLE" && s.status === "UNAVAILABLE");
      
    const withinRadius =
      !userCoords.lat ||
      getDistance(userCoords.lat, userCoords.lng, s.latitude, s.longitude) <= radius;
    return matchSearch && matchFilter && withinRadius;
  });

  const handleSelectStation = (station) => {
    navigate(`/driver/booking/${station.id}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-gray-950">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-1/3 bg-[#1f2937] text-white p-6 flex flex-col overflow-y-auto">
        <h1 className="text-2xl font-bold mb-1">EV Battery Swap</h1>
        <p className="text-sm text-gray-300 mb-6">Find a Station</p>

        {/* Search */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400"
            placeholder="Search by location, station name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Filter by Status</h3>
          <div className="flex gap-2 flex-wrap">
            {["AVAILABLE", "LOW_STOCK", "UNAVAILABLE", "ALL"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? f === "AVAILABLE"
                      ? "bg-green-600 text-white"
                      : f === "LOW_STOCK"
                      ? "bg-yellow-600 text-white"
                      : f === "UNAVAILABLE"
                      ? "bg-red-600 text-white"
                      : "bg-teal-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {f === "AVAILABLE"
                  ? "Sẵn sàng"
                  : f === "LOW_STOCK"
                  ? "Sắp hết"
                  : f === "UNAVAILABLE"
                  ? "Bảo trì"
                  : "Tất cả"}
              </button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-1">Search Radius</h3>
          <input
            type="range"
            min="1"
            max="30"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <p className="text-gray-300 text-sm">{radius} km</p>
        </div>

        <hr className="border-gray-600 mb-4" />

        {/* Station List - PHẦN ĐƯỢC CHỈNH SỬA UI */}
        <h3 className="text-lg font-bold mb-3 flex justify-between items-center">
          Stations Near You 
          <span className="text-xs font-normal text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{filteredStations.length}</span>
        </h3>
        
        <div className="flex flex-col gap-4 pb-10">
          {filteredStations.map((s) => {
             // Tính khoảng cách hiển thị UI
             const distance = userCoords.lat 
                ? getDistance(userCoords.lat, userCoords.lng, s.latitude, s.longitude).toFixed(1) 
                : "...";
             
             // Xác định màu và text cho Badge trạng thái
             let statusColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
             let statusText = "Không rõ";

             if (s.status === "ACTIVE" || s.status === "AVAILABLE") {
                 statusColor = "bg-green-500/10 text-green-500 border-green-500/20";
                 statusText = "Sẵn sàng";
             } else if (s.status === "LOW_STOCK") {
                 statusColor = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                 statusText = "Sắp hết";
             } else if (s.status === "UNAVAILABLE") {
                 statusColor = "bg-red-500/10 text-red-500 border-red-500/20";
                 statusText = "Bảo trì";
             }

             return (
              <div 
                key={s.id}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-all shadow-lg group"
              >
                {/* Header Card: Tên + Khoảng cách + Badge */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                      {s.name}
                    </h4>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <FiNavigation className="w-3 h-3" /> Cách đây {distance} km
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${statusColor}`}>
                    {statusText}
                  </div>
                </div>

                {/* Body Card: Địa chỉ + Pin */}
                <div className="space-y-2 mb-4">
                   <p className="text-sm text-gray-300 line-clamp-1" title={s.location}>
                     📍 {s.location}
                   </p>
                   <div className="flex items-center gap-2 mt-2">
                     <div className={`flex items-center gap-1 font-medium ${s.available > 0 ? 'text-teal-400' : 'text-red-400'}`}>
                        <IoFlash size={16} />
                        <span>{s.available}/{s.total} Pin</span>
                     </div>
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                   {/* Nút Book / Xem chi tiết - Chỉ hiện nếu trạm Active/Available/Low Stock */}
                   {(s.status === "ACTIVE" || s.status === "AVAILABLE" || s.status === "LOW_STOCK") ? (
                      <button 
                        className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-teal-900/20" 
                        onClick={() => handleSelectStation(s)}
                      > 
                        Xem chi tiết 
                      </button>
                   ) : (
                      <button className="flex-1 bg-gray-700 text-gray-500 py-2 rounded-lg text-sm font-semibold cursor-not-allowed" disabled>
                        Tạm ngưng
                      </button>
                   )}

                   {/* Nút chỉ đường Google Maps */}
                   <button 
                      onClick={(e) => {
                         e.stopPropagation();
                         window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`, '_blank');
                      }}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg border border-gray-600 transition-colors"
                      title="Chỉ đường trên Google Maps"
                   >
                      <FiNavigation size={18} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAP - Giữ nguyên */}
      <div className="w-2/3 relative">
        <LoadScript googleMapsApiKey="AIzaSyBAOGNM5Aqs3eL-LYk9Sx1d8cljbIqZfXM">
          <GoogleMap
            center={{
              lat: userCoords.lat || 10.776889,
              lng: userCoords.lng || 106.700806,
            }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
               styles: [ // Thêm dark mode cho map để đồng bộ
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
               ]
            }}
          >
            {userCoords.lat && (
              <Marker position={userCoords} label={{ text: "You", color: "white" }} />
            )}
            {stations.map((s) => (
              <Marker
                key={s.id}
                position={{ lat: s.latitude, lng: s.longitude }}
                icon={getMarkerColor(s)}
                onClick={() => handleSelectStation(s)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default BookingPage;