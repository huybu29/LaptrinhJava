import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";

import {
  IoCalendarOutline,
  IoTimeOutline,
  IoFlashOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { MdOutlinePlace } from "react-icons/md";
import api from "../../services/api";

// === COMPONENT MỚI CHO BẢNG THÔNG TIN ===
const InfoRow = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="text-blue-500 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold text-white">{children}</p>
    </div>
  </div>
);

// === COMPONENT CHÍNH ===
const BookingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // stationId từ route /booking/:id

  const [station, setStation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(""); // HH:mm

  const userId = localStorage.getItem("userId");

  // Lấy station và vehicle (GIỮ NGUYÊN)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, vehicleRes] = await Promise.all([
          api.get(`/stations/${id}`),
          api.get(`/vehicles/me`),
        ]);
        setStation(stationRes.data);
        setVehicle(vehicleRes.data); // duy nhất 1 xe
      } catch (err) {
        console.error(err);
        navigate("/booking");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Xử lý xác nhận (GIỮ NGUYÊN)
  const handleConfirm = async () => {
    if (!vehicle || !appointmentTime) {
      alert("Vui lòng chọn giờ đặt!");
      return;
    }

    const [hours, minutes] = appointmentTime.split(":").map(Number);
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const payload = {
      customerId: userId,
      vehicleId: vehicle.id,
      stationId: station.id,
      appointmentDate: appointmentDateTime.toISOString(),
      status: "PENDING",
    };

    try {
      await api.post("/appointments", payload);
      alert("✅ Đặt lịch thành công!");
      navigate("/booking");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi đặt lịch");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-gray-950">
        Loading...
      </div>
    );

  // === GIAO DIỆN MỚI ===
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white font-sans">
      {/* === CỘT BÊN TRÁI === */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Book a Battery Swap</h1>
            <button
              onClick={() => navigate("/booking")}
              className="px-4 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Change Station
            </button>
          </div>
          <p className="text-gray-400 mb-8">
            Select a date and time for your appointment at {station?.name}.
          </p>

          {/* 1. Chọn ngày (ĐÃ SỬA) */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Select a Date</h2>
            <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
              <DatePicker
                selected={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                inline
                calendarClassName="bg-transparent text-white border-none"
                headerClassName="text-white"
                monthClassName="bg-transparent"
                
                // ⭐️ THÊM CÁI NÀY: Để style "Su, Mo, Tu..."
                dayNameClassName={() => "text-gray-400 w-9"} 

                // ⭐️ CẬP NHẬT CÁI NÀY:
                dayClassName={(date) => {
                  const isSelected = date.toDateString() === appointmentDate.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  // Thêm logic kiểm tra ngày ngoài tháng
                  const isOutsideMonth = date.getMonth() !== appointmentDate.getMonth();
                  
                  if (isOutsideMonth) return "text-gray-600 rounded-full w-9 h-9 leading-9";
                  if (isSelected) return "bg-blue-600 text-white rounded-full w-9 h-9 leading-9";
                  if (isToday) return "text-blue-400 font-bold rounded-full w-9 h-9 leading-9";
                  return "text-white hover:bg-gray-700 rounded-full w-9 h-9 leading-9";
                }}
                
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex items-center justify-between px-2 py-1">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className="p-1 rounded-full text-gray-300 hover:bg-gray-700 disabled:text-gray-600"
                    >
                      <IoChevronBack size={20} />
                    </button>
                    <span className="text-lg font-semibold text-white">
                      {date.toLocaleString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      className="p-1 rounded-full text-gray-300 hover:bg-gray-700 disabled:text-gray-600"
                    >
                      <IoChevronForward size={20} />
                    </button>
                  </div>
                )}
              />
            </div>
          </div>

          {/* 2. Chọn giờ (GIỮ NGUYÊN) */}
          <div>
            <h2 className="text-xl font-bold mb-4">2. Select a Time</h2>
            <div className="max-w-xs">
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.g.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-gray-400 mt-2 text-sm">
                Please select your desired appointment time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === CỘT BÊN PHẢI (GIỮ NGUYÊN) === */}
      <div className="w-full lg:w-96 bg-gray-950 p-8 flex flex-col justify-between border-l border-gray-800">
        <div>
          <h2 className="text-2xl font-bold mb-6">Appointment Information</h2>
          <div className="space-y-5">
            <InfoRow icon={<IoFlashOutline size={22} />} label="Station">
              {station?.name}
            </InfoRow>
            <InfoRow icon={<MdOutlinePlace size={22} />} label="Address">
              {station?.address || station?.location}
            </InfoRow>
            <InfoRow icon={<IoCalendarOutline size={20} />} label="Date">
              {appointmentDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </InfoRow>
            
            <InfoRow icon={<IoTimeOutline size={22} />} label="Time">
              {appointmentTime ? appointmentTime : "Please select a time"}
            </InfoRow>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50"
            onClick={handleConfirm}
            disabled={!appointmentTime}
          >
            Confirm Booking
          </button>
          <button
            className="w-full px-4 py-3 text-gray-400 hover:text-white transition"
            onClick={() => navigate("/booking")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;