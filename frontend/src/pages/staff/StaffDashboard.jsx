import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Đảm bảo import axios instance
import { 
  FiAlertTriangle, 
  FiDollarSign, 
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiBatteryCharging,
  FiTrendingUp,
  FiLoader
} from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const StationDashboard = () => {
  const [loading, setLoading] = useState(true);

  // 1. State KPI
  const [stats, setStats] = useState({
    ready: 0,      
    charging: 0,    
    maintenance: 0, 
    todayRevenue: 0, 
  });

  // 2. State Biểu đồ & Bookings
  const [revenueData, setRevenueData] = useState([]);
  const [bookings, setBookings] = useState([]);

  // === FETCH & PROCESS DATA ===
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Gọi song song 3 API để tiết kiệm thời gian
        const [ batteriesRes, paymentsRes, appointmentsRes] = await Promise.all([
            api.get('/batteries/my-station'),
            api.get('/payments/my-station/status/COMPLETED'),
            api.get('/appointments/my-station')
        ]);
        console.log("Dữ liệu Batteries:", batteriesRes.data);
        console.log("Dữ liệu Payments:", paymentsRes.data);
        console.log("Dữ liệu Appointments:", appointmentsRes.data);
        // --- A. XỬ LÝ BATTERIES (Tính KPI Pin) ---
        const batteries = batteriesRes.data;
        const readyCount = batteries.filter(b => b.status === 'AVAILABLE' || b.status === 'READY').length;
        const chargingCount = batteries.filter(b => b.status === 'CHARGING').length;
        const maintCount = batteries.filter(b => b.status === 'MAINTENANCE' || b.status === 'BROKEN').length;

        // --- B. XỬ LÝ PAYMENTS (Tính Doanh thu & Biểu đồ) ---
        // --- B. XỬ LÝ PAYMENTS (Tính Doanh thu & Biểu đồ) ---
        const payments = paymentsRes.data;
        
        // Helper: Lấy ngày chuẩn YYYY-MM-DD từ chuỗi bất kỳ
        const getPaymentDate = (payment) => {
            // Ưu tiên updatedAt vì status COMPLETED thường dựa vào ngày update cuối
            const dateStr = payment.updatedAt || payment.createdAt; 
            if (!dateStr) return "";
            return new Date(dateStr).toISOString().split('T')[0]; 
        };

        // B1. Doanh thu hôm nay
        // Lấy ngày hiện tại theo giờ máy local (tránh lệch múi giờ UTC)
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const localTodayStr = new Date(today.getTime() - offset).toISOString().split('T')[0];

        const todayRevenue = payments
            .filter(p => {
                const pDate = getPaymentDate(p);
                return pDate === localTodayStr && p.status === 'COMPLETED';
            })
            .reduce((sum, p) => sum + p.amount, 0);

        // B2. Biểu đồ 7 ngày gần nhất
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            // Chỉnh về local time để khớp với ngày của user
            const localD = new Date(d.getTime() - offset); 
            return localD.toISOString().split('T')[0];
        });

        const chartData = last7Days.map(dateStr => {
            // Tổng tiền của ngày đó
            const dailyTotal = payments
                .filter(p => {
                    const pDate = getPaymentDate(p);
                    return pDate === dateStr && p.status === 'COMPLETED';
                })
                .reduce((sum, p) => sum + p.amount, 0);
            
            // Format ngày hiển thị (VD: 05/12)
            const [year, month, day] = dateStr.split('-');
            const displayDate = `${day}/${month}`;
            
            return { name: displayDate, revenue: dailyTotal };
        });
        // --- C. XỬ LÝ APPOINTMENTS (Lịch hẹn sắp tới) ---
        const rawAppointments = appointmentsRes.data;
        const upcoming = rawAppointments
            .filter(a => a.status === 'PENDING') // Chỉ lấy lịch chưa check-in
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) // Sắp xếp theo giờ
            .slice(0, 10) // Lấy 10 cái đầu
            .map(a => ({
                id: a.id,
                customer: a.customerName || "Khách vãng lai",
                time: a.appointmentDate ? a.appointmentDate.substring(0, 5) : "00:00",
                plate: a.vin || "Chưa cập nhật",
                model: a.vehicleName || "VinFast"
            }));

        // --- UPDATE STATE ---
        setStats({
            ready: readyCount,
            charging: chargingCount,
            maintenance: maintCount,
            todayRevenue: todayRevenue
        });
        setRevenueData(chartData);
        setBookings(upcoming);

      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-2">
            <FiLoader className="animate-spin text-3xl text-blue-500" />
            <span className="text-gray-400">Đang đồng bộ dữ liệu trạm...</span>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 font-sans">
      
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Tổng quan Trạm
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">Online</span>
          </h1>
          <p className="text-gray-400 text-sm">Cập nhật lúc: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* === KPI CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Ready */}
        <div className="bg-[#161B28] p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><FiCheckCircle size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Pin sẵn sàng</p>
            <p className="text-2xl font-bold">{stats.ready} <span className="text-sm text-gray-500 font-normal">cục</span></p>
          </div>
        </div>
        
        {/* Card 2: Charging */}
        <div className="bg-[#161B28] p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><FiBatteryCharging size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Đang sạc</p>
            <p className="text-2xl font-bold">{stats.charging} <span className="text-sm text-gray-500 font-normal">cục</span></p>
          </div>
        </div>

        {/* Card 3: Maintenance */}
        <div className="bg-[#161B28] p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><FiAlertTriangle size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Cần bảo trì</p>
            <p className="text-2xl font-bold text-red-400">{stats.maintenance} <span className="text-sm text-gray-500 font-normal">cục</span></p>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-[#161B28] p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><FiDollarSign size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Doanh thu hôm nay</p>
            <p className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} <span className="text-sm text-gray-500 font-normal">đ</span></p>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: REVENUE CHART */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161B28] rounded-2xl p-6 border border-gray-800 h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FiTrendingUp className="text-blue-500"/>
                  Biểu đồ doanh thu
                </h2>
                <p className="text-gray-400 text-sm mt-1">7 ngày gần nhất</p>
              </div>
            </div>

            {/* CHART AREA */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF" 
                    tick={{fill: '#9CA3AF', fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    tick={{fill: '#9CA3AF', fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value/1000}k`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#60A5FA' }}
                    formatter={(value) => [`${value.toLocaleString()} đ`, "Doanh thu"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT: UPCOMING BOOKINGS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#161B28] rounded-2xl p-6 border border-gray-800 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiClock /> Lịch hẹn sắp tới
            </h2>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
              {bookings.length > 0 ? bookings.map((item) => (
                <div key={item.id} className="bg-[#0B0F19] p-4 rounded-xl border border-gray-800 flex justify-between items-center hover:border-blue-500/50 transition-colors">
                  <div>
                    <p className="font-bold text-blue-400">{item.time}</p>
                    <p className="text-sm font-medium">{item.customer}</p>
                    <p className="text-xs text-gray-500">{item.model} • {item.plate}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    Chi tiết
                  </button>
                </div>
              )) : (
                <div className="text-gray-500 text-center text-sm py-10 flex flex-col items-center">
                    <FiClock className="mb-2 text-2xl"/>
                    Chưa có lịch hẹn nào.
                </div>
              )}
            </div>

            {/* Quick Lookup */}
            <div className="mt-auto pt-6 border-t border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 mb-3">Tra cứu nhanh</h3>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Nhập SĐT khách hoặc Biển số..." 
                  className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none text-white placeholder-gray-600"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default StationDashboard;