// src/pages/customer/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../services/api";
import { FiSearch } from "react-icons/fi";
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

  // Calculate distance between two coordinates
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
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case "LOW_STOCK":
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      case "UNAVAILABLE":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default:
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  const filteredStations = stations.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "ALL" ||
      (filter === "AVAILABLE" && s.status === "AVAILABLE") ||
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
                className={`px-3 py-1 rounded-lg ${
                  filter === f
                    ? f === "AVAILABLE"
                      ? "bg-green-600"
                      : f === "LOW_STOCK"
                      ? "bg-yellow-600"
                      : f === "UNAVAILABLE"
                      ? "bg-red-600"
                      : "bg-teal-600"
                    : "bg-gray-700"
                }`}
              >
                {f === "AVAILABLE"
                  ? "Available"
                  : f === "LOW_STOCK"
                  ? "Low Stock"
                  : f === "UNAVAILABLE"
                  ? "Unavailable"
                  : "All"}
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
            className="w-full"
          />
          <p className="text-gray-300 text-sm">{radius} km</p>
        </div>

        <hr className="border-gray-600 mb-4" />

        {/* Station List */}
        <h3 className="text-lg font-bold mb-3">Stations Near You</h3>
        <div className="flex flex-col gap-4">
          {filteredStations.map((s) => (
            <InfoCard key={s.id} title={s.name} >
              <p>📍 {s.location}</p>
              <div className="flex items-center gap-2 mt-2">
                <IoFlash size={20} />
                <span>{s.available}/{s.total} batteries</span>
              </div>
              {s.status === "ACTIVE" && ( <button className="mt-3 w-full bg-teal-500 py-2 rounded-lg font-semibold hover:bg-teal-600" onClick={() => handleSelectStation(s)}> Book Now </button> )}
              {s.status === "LOW_STOCK" && (
                <p className="mt-2 text-yellow-400">Low availability. Book soon.</p>
              )}
              {s.status === "UNAVAILABLE" && (
                <p className="mt-2 text-red-400">Currently unavailable.</p>
              )}
            </InfoCard>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="w-2/3 relative">
        <LoadScript googleMapsApiKey="AIzaSyBAOGNM5Aqs3eL-LYk9Sx1d8cljbIqZfXM">
          <GoogleMap
            center={{
              lat: userCoords.lat || 10.776889,
              lng: userCoords.lng || 106.700806,
            }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {userCoords.lat && (
              <Marker position={userCoords} label={{ text: "You", color: "black" }} />
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

// Card Component
const InfoCard = ({ title, children, onClick }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 p-4 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
  >
    <h4 className="text-xl font-semibold">{title}</h4>
    {children}
  </div>
);

export default BookingPage;
