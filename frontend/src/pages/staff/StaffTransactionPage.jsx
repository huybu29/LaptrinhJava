import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";
import {
  FaSearch,
  FaCheckCircle,
  FaUser,
  FaCar,
  FaPhone,
  FaMoneyBillWave,
  FaQrcode,
  FaCreditCard,
  FaStar,
} from "react-icons/fa";

// === Component Checkbox tùy chỉnh (Mục 2.b.3) ===
const BatteryCheckItem = ({ label, isChecked, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-2 p-3 rounded-lg text-left w-full transition-colors ${
      isChecked
        ? "bg-green-800 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`}
  >
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
        isChecked
          ? "bg-green-600 border-green-600"
          : "border-gray-500"
      }`}
    >
      {isChecked && <FaCheck size={12} />}
    </div>
    <span className="font-medium">{label}</span>
  </button>
);

// === Component Phương thức Thanh toán (Mục 2.b.2) ===
const PaymentMethodOption = ({ label, icon, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`flex items-center gap-3 p-3 rounded-lg text-left w-full border-2 transition-all ${
      selected
        ? "border-blue-500 bg-gray-700 ring-2 ring-blue-500"
        : "border-gray-600 bg-gray-800 hover:bg-gray-700"
    }`}
  >
    {icon}
    <span className="font-semibold text-white">{label}</span>
    <div
      className={`w-5 h-5 rounded-full ml-auto border-2 flex items-center justify-center ${
        selected ? "border-blue-500" : "border-gray-400"
      }`}
    >
      {selected && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
    </div>
  </button>);

// === Component Trang chính ===
const StaffTransactionPage = () => {
  const { user } = useContext(AuthContext);
  const stationId = user?.stationId;

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [booking, setBooking] = useState(null); // Lưu booking tìm được
  const [availableBatteries, setAvailableBatteries] = useState([]); // Pin sẵn sàng
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form xử lý
  const [checks, setChecks] = useState({ intact: false, noDents: false });
  const [newBatteryId, setNewBatteryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("SUBSCRIPTION"); // Mặc định
  const [notes, setNotes] = useState("");

  // 1. Tìm Booking (Mục 2.b.1)
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError("");
    setBooking(null);
    try {
      // API này cần backend hỗ trợ tìm booking (theo mã, SĐT, biển số)
      // và trả về { booking, customer, vehicle }
      const res = await api.get(`/staff/find-booking?query=${searchQuery}`); 
      const { booking, customer, vehicle } = res.data;

      // Lấy pin sẵn sàng tại trạm
      const batteriesRes = await api.get(
        `/batteries/station/${stationId}/available?type=${vehicle.batteryType}`
      );
      
      setBooking({ ...booking, customer, vehicle }); // Gộp dữ liệu
      setAvailableBatteries(batteriesRes.data);

    } catch (err) {
      console.error(err);
      setError("Không tìm thấy lịch hẹn hoặc khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hoàn tất Giao dịch (Mục 2.b.1, 2.b.2, 2.b.3)
  const handleCompleteTransaction = async () => {
    if (!newBatteryId) {
      alert("Vui lòng chọn một pin mới để gán cho khách.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        bookingId: booking.id,
        stationId: stationId,
        returnedBatteryChecks: checks, // Mục 2.b.3
        newBatteryId: newBatteryId,
        paymentMethod: paymentMethod, // Mục 2.b.2
        notes: notes,
      };

      // API này sẽ xử lý tất cả logic backend (cập nhật booking, đổi pin, tạo payment)
      await api.post("/staff/complete-swap", payload);

      alert("✅ Giao dịch hoàn tất!");
      // Reset trang
      setBooking(null);
      setSearchQuery("");
      setChecks({ intact: false, noDents: false });
      setNewBatteryId("");
      setPaymentMethod("SUBSCRIPTION");
    } catch (err) {
      console.error(err);
      alert(`❌ Lỗi: ${err.response?.data?.message || 'Không thể hoàn tất giao dịch.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Thanh Tìm kiếm */}
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-3">
          Bước 1: Tìm Lịch hẹn (Booking)
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập Mã Booking, Biển số xe, hoặc SĐT..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-500"
          >
            <FaSearch />
            Tìm kiếm
          </button>
        </div>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      {/* 2. Khu vực Xử lý Giao dịch (hiển thị khi tìm thấy) */}
      {booking && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Thông tin & Kiểm tra */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Thông tin khách hàng & Xe */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Thông tin Khách hàng & Xe</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-blue-400" />
                  <span>{booking.customer.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-400" />
                  <span>{booking.customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCar className="text-blue-400" />
                  <span>{booking.vehicle.licensePlate} ({booking.vehicle.model})</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaBatteryFull className="text-blue-400" />
                  <span>Yêu cầu: {booking.vehicle.batteryType}</span>
                </div>
              </div>
            </div>

            {/* Mục 2.b.3: Kiểm tra Pin trả về */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Bước 2: Kiểm tra Pin Khách trả
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <BatteryCheckItem label="Ngoại hình nguyên vẹn" isChecked={checks.intact} onToggle={() => setChecks(c => ({...c, intact: !c.intact}))} />
                <BatteryCheckItem label="Không móp méo, hư hại" isChecked={checks.noDents} onToggle={() => setChecks(c => ({...c, noDents: !c.noDents}))} />
              </div>
            </div>

            {/* Gán Pin mới & Ghi chú */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Bước 3: Gán Pin mới & Ghi chú
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Chọn Pin mới (Loại: {booking.vehicle.batteryType})
                  </label>
                  <select
                    value={newBatteryId}
                    onChange={(e) => setNewBatteryId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pin có sẵn ({availableBatteries.length}) --</option>
                    {availableBatteries.map(bat => (
                      <option key={bat.id} value={bat.id}>
                        {bat.serialNumber} (SOH: {bat.soh}%)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Ghi chú (nếu có)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    placeholder="Vd: Pin khách trả bị xước nhẹ..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thanh toán & Hoàn tất (Mục 2.b.2) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4">
                Bước 4: Thanh toán tại chỗ
              </h3>
              
              <div className="space-y-3 mb-6">
                <PaymentMethodOption 
                  label="Gói thuê bao"
                  icon={<FaStar size={20} className="text-yellow-400" />}
                  selected={paymentMethod === 'SUBSCRIPTION'}
                  onSelect={() => setPaymentMethod('SUBSCRIPTION')}
                />
                <PaymentMethodOption 
                  label="Tiền mặt (Cash)"
                  icon={<FaMoneyBillWave size={20} className="text-green-400" />}
                  selected={paymentMethod === 'CASH'}
                  onSelect={() => setPaymentMethod('CASH')}
                />
                <PaymentMethodOption 
                  label="Chuyển khoản / QR"
                  icon={<FaQrcode size={20} className="text-blue-400" />}
                  selected={paymentMethod === 'QR'}
                  onSelect={() => setPaymentMethod('QR')}
                />
                <PaymentMethodOption 
                  label="Thẻ (Card)"
                  icon={<FaCreditCard size={20} className="text-purple-400" />}
                  selected={paymentMethod === 'CARD'}
                  onSelect={() => setPaymentMethod('CARD')}
                />
              </div>

              {/* Chi tiết phí */}
              <div className="space-y-2 text-white mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Phí đổi pin (lẻ)</span>
                  <span>25.000 VND</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-400">
                    {paymentMethod === 'SUBSCRIPTION' ? '0 VND' : '25.000 VND'}
                  </span>
                </div>
              </div>

              {/* Hoàn tất (Mục 2.b.1) */}
              <button
                onClick={handleCompleteTransaction}
                disabled={loading || !newBatteryId}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Hoàn tất Giao dịch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTransactionPage;