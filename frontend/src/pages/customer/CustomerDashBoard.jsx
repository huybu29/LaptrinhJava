import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import {
  FiBell,
  FiSettings,
  FiEdit2,
  FiArrowUpLeft,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

// === Component Biểu đồ tròn (MỚI) ===
const CircularProgress = ({ percentage, range }) => {
  const radius = 80;
  const stroke = 18;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center my-4">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          stroke="#334155" // bg-slate-700
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#22C55E" // text-green-500
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold text-white">{percentage}%</span>
        <span className="text-sm text-gray-400 mt-1">Quãng đường dự kiến:</span>
        <span className="text-lg font-medium text-white">{range}km</span>
      </div>
    </div>
  );
};

// === Component Lịch sử giao dịch (MỚI) ===
const TransactionItem = ({ station, date, amount }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-700 rounded-full">
        <FiArrowUpLeft className="text-green-400" />
      </div>
      <div>
        <p className="font-semibold text-white">{station}</p>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
    </div>
    <span className="font-semibold text-red-400">{amount}K</span>
  </div>
);

// === Component Dashboard chính ===
const CustomerDashboard = () => {
  const { user } = useContext(AuthContext); // Dùng user từ context

  const [vehicle, setVehicle] = useState(null);
  const [battery, setBattery] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  //======================
  // Fetch API (Đã đơn giản hóa, bỏ map)
  //======================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Xe
        const vRes = await api.get("/vehicles/me");
        const v = vRes.data;
        setVehicle(v);

        // 2. Pin của xe
        if (v?.id) {
          const bRes = await api.get(`/batteries/vehicle/${v.id}`);
          setBattery(bRes.data);
        }

        // 3. Lịch sử thanh toán
        const paymentRes = await api.get("/payments/me");
        setServiceHistory(paymentRes.data.slice(0, 3)); // Chỉ lấy 3 mục mới nhất
      } catch (err) {
        console.error("Load data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-slate-900">
        Đang tải dữ liệu...
      </div>
    );

  //======================
  // % Pin (Dùng SOH)
  //======================
  const batteryPercent = Math.round(battery?.soh || 0);
  const estimatedRange = Math.round((batteryPercent / 100) * 300); // Giả sử 300km là max

  //======================
  // JSX MỚI THEO THIẾT KẾ
  //======================
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <FiBell size={22} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <FiSettings size={22} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === CỘT BÊN TRÁI === */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Trạng thái Pin */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">Trạng thái Pin</h2>
            <CircularProgress percentage={batteryPercent} range={estimatedRange} />
            <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <FiSearch />
              Tìm trạm...
            </button>
          </div>

          {/* Lịch sử giao dịch */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lịch sử giao dịch</h2>
              <a href="#" className="text-sm text-green-400 font-medium hover:underline">
                Xem tất cả
              </a>
            </div>
            <div className="flex flex-col divide-y divide-slate-700">
              {serviceHistory.length > 0 ? (
                serviceHistory.map((item) => (
                  <TransactionItem
                    key={item.paymentID}
                    station={item.invoiceNumber || "Giao dịch"} // Cần điều chỉnh
                    date={new Date(item.updatedAt).toLocaleDateString("vi-VN")}
                    amount={(item.amount / 1000).toFixed(0)} // Giả sử 250000 -> 250K
                  />
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Chưa có giao dịch.</p>
              )}
            </div>
          </div>
        </div>

        {/* === CỘT BÊN PHẢI === */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chào mừng */}
          <div className="bg-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`}
                alt="Avatar"
                className="w-20 h-20 rounded-full bg-slate-700"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Chào mừng trở lại, {user?.fullName || "Khách"}!
                </h2>
                <p className="text-gray-400">{user?.email}</p>
                <p className="text-gray-300 mt-1">
                  Đây là tổng quan nhanh về tài khoản của bạn.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600">
              <FiEdit2 size={16} />
              Chỉnh sửa hồ sơ
            </button>
          </div>

          {/* Phương tiện & Pin */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Phương tiện & Pin đã liên kết</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-sm text-gray-400">Số VIN</p>
                <p className="text-lg font-medium text-white">{vehicle?.vin || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Loại pin</p>
                <p className="text-lg font-medium text-white">{vehicle?.batteryType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Biển số xe</p>
                <p className="text-lg font-medium text-white">{vehicle?.licensePlate || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Mã Pin</p>
                <p className="text-lg font-medium text-white">{battery?.serialNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Gói thuê bao (MOCK DATA) */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Gói thuê bao hiện tại</h2>
            <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <FiPackage size={24} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Gói Linh hoạt 1</p>
                  <p className="text-gray-300">
                    Tối đa 500km/tháng. Gia hạn vào 15/12/2025.
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-green-600 rounded-lg font-semibold hover:bg-green-700">
                Nâng cấp gói
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;