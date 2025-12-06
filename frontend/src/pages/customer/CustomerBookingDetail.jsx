import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Đừng quên import CSS của datepicker

import {
  IoCalendarOutline,
  IoTimeOutline,
  IoChevronBack,
  IoChevronForward,
  IoLocationOutline,
} from "react-icons/io5";
import api from "../../services/api";

// === DỮ LIỆU GIẢ LẬP KHUNG GIỜ (Theo ảnh mẫu) ===
const TIME_SLOTS = {
  morning: ["09:00", "09:30", "10:00", "10:30", "11:00"],
  afternoon: ["13:00", "13:30", "14:00", "15:30"],
  evening: ["18:00", "19:30"],
};

const BookingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [station, setStation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(""); // Lưu giờ dạng string "09:00"

  const userId = localStorage.getItem("userId");

  // --- 1. LẤY DỮ LIỆU (Giữ nguyên logic cũ) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
       
       const [stationRes, vehicleRes] = await Promise.all([
        api.get(`/stations/${id}`),
         api.get(`/vehicles/me`),
        ]);
        setStation(stationRes.data);
        setVehicle(vehicleRes.data);
        
        
        
      } catch (err) {
        console.error(err);
        navigate("/booking");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // --- 2. XỬ LÝ ĐẶT LỊCH (Giữ nguyên logic cũ) ---
  const handleConfirm = async () => {
    if (!appointmentTime) {
      alert("Vui lòng chọn khung giờ!");
      return;
    }

    const [hours, minutes] = appointmentTime.split(":").map(Number);
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const payload = {
      customerId: userId,
      vehicleId: vehicle?.id,
      stationId: station?.id,
      appointmentDate: appointmentDateTime.toISOString(),
      status: "PENDING",
    };

    console.log("Booking Payload:", payload);
     await api.post("/appointments", payload);
    alert("✅ Đặt lịch thành công!");
    navigate("/booking");
  };

  if (loading) return <div className="h-screen bg-[#0f1219] flex items-center justify-center text-white">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Chọn thời gian đặt lịch</h1>
          <p className="text-gray-400">Vui lòng chọn ngày và khung giờ bạn muốn đến trạm.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === CỘT TRÁI: LỊCH & GIỜ (Chiếm 2 phần) === */}
          <div className="lg:col-span-2 bg-[#161b26] border border-gray-800 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* 1. DATE PICKER (Lịch) */}
              <div className="md:w-1/2">
                <style>{`
                  .react-datepicker { font-family: inherit; background-color: transparent; border: none; }
                  .react-datepicker__header { background-color: transparent; border-bottom: none; }
                  .react-datepicker__day-name { color: #9ca3af; width: 2.5rem; margin: 0.2rem; }
                  .react-datepicker__day { color: #e5e7eb; width: 2.5rem; height: 2.5rem; line-height: 2.5rem; margin: 0.2rem; border-radius: 9999px; }
                  .react-datepicker__day:hover { background-color: #374151; }
                  .react-datepicker__day--selected { background-color: #2563eb !important; color: white; font-weight: bold; }
                  .react-datepicker__day--keyboard-selected { background-color: transparent; }
                  .react-datepicker__day--outside-month { color: #4b5563; }
                `}</style>
                
                <DatePicker
                  selected={appointmentDate}
                  onChange={(date) => setAppointmentDate(date)}
                  inline
                  renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                    <div className="flex items-center justify-between px-2 py-4 mb-2">
                      <button onClick={decreaseMonth} className="text-gray-400 hover:text-white p-1"><IoChevronBack /></button>
                      <span className="text-lg font-bold text-white">
                        Tháng {date.getMonth() + 1} {date.getFullYear()}
                      </span>
                      <button onClick={increaseMonth} className="text-gray-400 hover:text-white p-1"><IoChevronForward /></button>
                    </div>
                  )}
                />
              </div>

              {/* 2. TIME SLOTS (Khung giờ) */}
              <div className="md:w-1/2">
                <h3 className="text-white font-semibold mb-4">
                  Khung giờ còn trống - {appointmentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
                </h3>

                <div className="space-y-6">
                  {/* Buổi sáng */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Buổi sáng</p>
                    <div className="grid grid-cols-3 gap-3">
                      {TIME_SLOTS.morning.map((time) => (
                        <TimeSlotButton 
                          key={time} 
                          time={time} 
                          selected={appointmentTime === time} 
                          onClick={() => setAppointmentTime(time)} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Buổi chiều */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Buổi chiều</p>
                    <div className="grid grid-cols-3 gap-3">
                      {TIME_SLOTS.afternoon.map((time) => (
                        <TimeSlotButton 
                          key={time} 
                          time={time} 
                          selected={appointmentTime === time} 
                          onClick={() => setAppointmentTime(time)} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Buổi tối */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Buổi tối</p>
                    <div className="grid grid-cols-3 gap-3">
                      {TIME_SLOTS.evening.map((time) => (
                        <TimeSlotButton 
                          key={time} 
                          time={time} 
                          selected={appointmentTime === time} 
                          onClick={() => setAppointmentTime(time)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* === CỘT PHẢI: TÓM TẮT (Chiếm 1 phần) === */}
          <div className="lg:col-span-1">
            <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Tóm tắt lịch hẹn</h2>

              {/* Station Info */}
              <div className="mb-6 pb-6 border-b border-gray-800">
                <p className="text-sm text-gray-500 mb-3">Trạm đã chọn</p>
                <div className="flex gap-4">
                  {/* Ảnh giả lập */}
                  <img 
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=150&h=150&fit=crop" 
                    alt="Station" 
                    className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{station?.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{station?.address}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time Summary */}
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ngày hẹn</p>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <IoCalendarOutline className="text-gray-400" />
                    <span>
                       {appointmentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Giờ hẹn</p>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <IoTimeOutline className="text-gray-400" />
                    <span>{appointmentTime || "--:--"}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!appointmentTime}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all ${
                  appointmentTime 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30" 
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Xác nhận Lịch hẹn
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Component phụ cho nút giờ
const TimeSlotButton = ({ time, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-1 rounded-lg text-sm font-medium transition-all border ${
      selected
        ? "bg-blue-600 border-blue-600 text-white shadow-md"
        : "bg-[#1f2937] border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
    }`}
  >
    {time}
  </button>
);

export default BookingDetailPage;