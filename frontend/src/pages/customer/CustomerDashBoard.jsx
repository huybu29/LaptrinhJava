import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiPlusCircle,
  FiClock,
  FiMapPin, 
  FiChevronRight,
  FiZap 
} from "react-icons/fi";

// === Component Thanh Pin Ngang (Giữ nguyên) ===
const BatteryProgressBar = ({ percentage }) => {
  return (
    <div className="bg-[#161B28] rounded-2xl p-6 shadow-lg border border-gray-800">
      <div className="flex justify-between items-end mb-3">
        <span className="text-gray-200 font-medium text-lg">Mức pin hiện tại</span>
        <span className="text-3xl font-bold text-white">{percentage}%</span>
      </div>
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// === Component Dashboard chính ===
const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [battery, setBattery] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  
  // --- STATE MAPS (Tra cứu nhanh) ---
  const [stationsMap, setStationsMap] = useState({}); // Tra cứu tên trạm
  const [plansMap, setPlansMap] = useState({});       // 1. Tra cứu tên gói cước (Mới thêm)

  const [loading, setLoading] = useState(true);

  // === Helper Format Date ===
  const formatAppointmentTime = (isoString) => {
    const date = new Date(isoString);
    return {
        day: date.getDate(),
        month: `T${date.getMonth() + 1}`,
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // === Fetch Data ===
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // --- A. Lấy danh sách TRẠM (Stations Map) ---
        try {
            const stationRes = await api.get("/stations"); 
            const sMap = {};
            if (Array.isArray(stationRes.data)) {
                stationRes.data.forEach(st => sMap[st.id] = st);
            }
            setStationsMap(sMap);
        } catch (e) { console.warn("Lỗi tải trạm:", e); }

        // --- B. Lấy danh sách GÓI CƯỚC (Plans Map) - MỚI THÊM ---
        try {
            const planRes = await api.get("/subscription-plans"); 
            const pMap = {};
            if (Array.isArray(planRes.data)) {
                planRes.data.forEach(plan => {
                    pMap[plan.id] = plan; // Lưu object plan vào map với key là plan.id
                });
            }
            setPlansMap(pMap);
            console.log("Plans Map:", pMap);
        } catch (e) { console.warn("Lỗi tải gói cước:", e); }

        // --- C. Xe & Pin ---
        try {
            const vRes = await api.get("/vehicles/me");
            setVehicle(vRes.data);
            if (vRes.data?.id) {
                const bRes = await api.get(`/batteries/vehicle/${vRes.data.id}`);
                setBattery(bRes.data);
            }
        } catch (e) { console.log("Chưa có xe"); }

        // --- D. Lịch sử ---
        try {
            const paymentRes = await api.get("/payments/me");
            setServiceHistory(paymentRes.data.slice(0, 3));
        } catch (e) { console.log("Lỗi history"); }

        // --- E. Lịch hẹn ---
        try {
            const appRes = await api.get("/appointments/me"); 
            const sortedApts = appRes.data
                .filter(a => a.status === 'PENDING' || a.status === 'APPROVED')
                .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                .slice(0, 3);
            setAppointments(sortedApts);
        } catch (error) { console.warn("Lỗi fetch appointment", error); }

        // --- F. Gói thuê bao cá nhân ---
        try {
            const subRes = await api.get("/user-subscriptions/me");
            // Tìm gói ACTIVE
            if (Array.isArray(subRes.data)) {
                const activeSub = subRes.data.find(sub => sub.status === 'ACTIVE');
                setSubscription(activeSub || null);
            }
        } catch (error) { console.warn("Lỗi tải user sub", error); }

      } catch (err) {
        console.error("Critical Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0F19] text-white">
         <div className="flex flex-col items-center gap-2">
           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
           <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );

  const batteryPercent = Math.round(battery?.soh || 0);
  const estimatedRange = Math.round((batteryPercent / 100) * 300);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-10 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Chào buổi sáng, {user?.fullName || "Tài xế"}!
        </h1>
        <p className="text-gray-400">Chào mừng trở lại bảng điều khiển của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === CỘT TRÁI (Giữ nguyên) === */}
        <div className="lg:col-span-2 space-y-6">
          {vehicle ? (
            <>
              <div className="bg-[#161B28] rounded-2xl p-6 relative overflow-hidden shadow-lg border border-gray-800 flex flex-col md:flex-row items-center justify-between min-h-[200px]">
                <div className="z-10 w-full md:w-1/2">
                  <p className="text-gray-400 text-sm mb-1">Phương tiện</p>
                  <h2 className="text-2xl font-bold text-white mb-2">{vehicle.model}</h2>
                  <p className="text-gray-400 text-sm mb-6">Biển số: <span className="text-blue-400 font-mono">{vehicle.licensePlate}</span></p>
                  <button className="px-6 py-2 bg-[#252A36] hover:bg-[#2d3342] text-white rounded-lg text-sm font-medium border border-gray-700">Chi tiết</button>
                </div>
                <div className="w-full md:w-1/2 flex justify-center relative"><div className="w-48 h-24 bg-gray-800/50 rounded-lg border border-gray-700"></div></div>
              </div>
              <BatteryProgressBar percentage={batteryPercent} />
            </>
          ) : (
            <div className="bg-[#161B28] rounded-2xl p-10 border border-gray-800 text-center"><h2 className="text-white">Chưa liên kết xe</h2></div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold">Tìm trạm đổi pin</button>
             <button className="bg-[#1F2937] hover:bg-[#283240] text-white py-4 rounded-xl font-semibold border border-gray-700">Đặt lịch</button>
          </div>
        </div>

        {/* === CỘT PHẢI === */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* === Card Gói Thuê Bao (Updated Lookup Plan Name) === */}
          <div className="bg-[#161B28] rounded-2xl p-6 border border-gray-800 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Gói thuê bao</h3>
            
            {subscription ? (
                <div className="bg-gradient-to-br from-blue-900/20 to-[#111927] border border-blue-500/30 rounded-xl p-5 mb-4 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                                <FiZap size={18} />
                            </div>
                            
                            {/* --- LOGIC HIỂN THỊ TÊN GÓI TỪ PLANS MAP --- */}
                            <h4 className="text-lg font-bold text-white">
                                {plansMap[subscription.planId]?.name || subscription.name || "Gói dịch vụ"}
                            </h4>
                            {/* ------------------------------------------- */}
                        
                        </div>
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            {subscription.status}
                        </span>
                    </div>

                    <div className="space-y-3 text-sm text-gray-400 relative z-10">
                        <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                            <span>Lượt đổi còn lại:</span>
                            <span className="text-white font-bold text-base">
                                {subscription.swapLimitSnapshot 
                                    ? `${subscription.swapLimitSnapshot - subscription.swapsUsed} lượt` 
                                    : "∞ Vô cực"
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Hết hạn:</span>
                            <span className="text-white font-mono">
                                {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#1F2937]/50 border border-dashed border-gray-700 rounded-xl p-6 mb-4 text-center">
                    <p className="text-gray-400 text-sm mb-3">Bạn chưa có gói dịch vụ nào.</p>
                    <button onClick={() => navigate('/subscription')} className="text-blue-400 text-sm font-bold flex items-center justify-center gap-1 mx-auto">
                        <FiPlusCircle /> Đăng ký ngay
                    </button>
                </div>
            )}
            {subscription && (
                <button onClick={() => navigate('/subscription')} className="w-full bg-[#252A36] text-white py-3 rounded-xl font-medium border border-gray-700">Quản lý gói</button>
            )}
          </div>

          {/* === Card Lịch Hẹn Sắp Tới (Lookup Station Name) === */}
          <div className="bg-[#161B28] rounded-2xl p-6 border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiClock className="text-blue-500" /> Lịch hẹn sắp tới
              </h3>
              <button onClick={() => navigate('/appointments')} className="p-1 hover:bg-gray-800 rounded-full"><FiChevronRight className="text-gray-400" /></button>
            </div>

            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map((apt) => {
                        const dateInfo = formatAppointmentTime(apt.appointmentDate);
                        const stationInfo = stationsMap[apt.stationId] || {}; // Tra cứu trạm
                        return (
                            <div key={apt.id} className="flex gap-3 items-start group cursor-pointer hover:bg-[#111620] p-2 rounded-xl transition-colors -mx-2">
                                <div className="bg-[#1F2937] p-2 rounded-lg text-center min-w-[55px]">
                                    <span className="block font-bold text-lg text-white">{dateInfo.day}</span>
                                    <span className="text-[10px] uppercase text-gray-400">{dateInfo.month}</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold text-gray-200 text-sm truncate" title={stationInfo.name}>
                                        {stationInfo.name || `Trạm số ${apt.stationId}`}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 truncate">
                                        <FiMapPin size={10} /> <span>{stationInfo.location || "Đang tải địa chỉ..."}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><FiClock size={10} /> {dateInfo.time}</span>
                                        <span className="text-green-500 font-bold text-[10px] border border-green-500/30 px-1 rounded">{apt.status}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">Không có lịch hẹn nào</div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;