import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Đảm bảo đường dẫn đúng
import {
  FiDownload, FiDollarSign, FiBarChart2, FiUsers, FiTrendingUp, FiTrendingDown, FiCpu, FiClock
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// === Helper: Parse JSON an toàn ===
const safeParseJSON = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    return null;
  }
};

// === Component Helper ===
const StatCard = ({ title, value, growth, icon, color }) => {
  const isPositive = growth.startsWith("+");
  return (
    <div className="bg-[#161b26] p-5 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <div className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
        <span>{growth}</span>
      </div>
    </div>
  );
};

const AdminReportPage = () => {
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSwaps: 0,
    revenueGrowth: "+0%",
    swapsGrowth: "+0%",
    newCustomers: 0,
    customersGrowth: "+0%",
    bestStation: "..."
  });
  const [chartData, setChartData] = useState([]);
  const [stationPerformance, setStationPerformance] = useState([]);
  const [topForecast, setTopForecast] = useState(null); // State mới để lưu dự báo nổi bật
  const [timeFilter, setTimeFilter] = useState("month"); 

  useEffect(() => {
    const calculateData = async () => {
      try {
        setLoading(true);
        
        // 1. Gọi API
        const [paymentsRes, stationsRes] = await Promise.all([
            api.get("/payments/", { headers: { "X-User-Role": "ROLE_ADMIN" } }).catch(() => ({ data: [] })),
            api.get("/stations", { headers: { "X-User-Role": "ROLE_ADMIN" } }).catch(() => ({ data: [] }))
        ]);

        const payments = paymentsRes.data; 
        const stations = stationsRes.data;

        // --- 2. TÍNH TOÁN ---
        
        // A. Tổng quan (Giữ nguyên logic cũ)
        const totalRevenue = payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        const totalSwaps = payments
            .filter(p => p.bookingID != null && p.status === 'COMPLETED')
            .length;

        const uniqueUsers = new Set(payments.map(p => p.userID)).size;

        // B. Hiệu suất trạm & Xử lý AI Forecast
        const stationStatsMap = {};
        payments.forEach(p => {
            if (p.stationId && p.status === 'COMPLETED') {
                if (!stationStatsMap[p.stationId]) {
                    stationStatsMap[p.stationId] = { revenue: 0, swaps: 0 };
                }
                stationStatsMap[p.stationId].revenue += (p.amount || 0);
                if (p.bookingID) stationStatsMap[p.stationId].swaps += 1;
            }
        });

        const performanceList = stations.map(s => {
            // [MỚI] Parse dữ liệu AI từ chuỗi JSON
            const forecastData = safeParseJSON(s.aiForecast);

            return {
                id: s.id,
                name: s.name,
                revenue: stationStatsMap[s.id]?.revenue || 0,
                swaps: stationStatsMap[s.id]?.swaps || 0,
                status: s.status,
                // Gắn dữ liệu dự báo vào object trạm
                forecast: forecastData 
            };
        }).sort((a, b) => b.revenue - a.revenue);

        // Tìm trạm có dự báo nhu cầu cao nhất để hiển thị gợi ý
        const stationWithHighestDemand = [...performanceList].sort((a, b) => 
            (b.forecast?.predictedSwaps || 0) - (a.forecast?.predictedSwaps || 0)
        )[0];
        setTopForecast(stationWithHighestDemand);

        const bestStationName = performanceList.length > 0 && performanceList[0].revenue > 0 
            ? performanceList[0].name 
            : "Chưa có dữ liệu";

        // C. Biểu đồ (Giữ nguyên logic cũ)
        const chartMap = {};
        const today = new Date();
        const daysToShow = timeFilter === 'week' ? 7 : 30;
        
        for(let i=daysToShow-1; i>=0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}); 
            chartMap[dateStr] = 0; 
        }

        payments.forEach(p => {
            if (p.status === 'COMPLETED' && p.createdAt) {
                const pDate = new Date(p.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'});
                if (chartMap[pDate] !== undefined) {
                    chartMap[pDate] += (p.amount || 0);
                }
            }
        });

        const chartDataArray = Object.keys(chartMap).map(date => ({
            name: date,
            revenue: chartMap[date]
        }));

        // --- 3. UPDATE STATE ---
        setStats({
            totalRevenue,
            totalSwaps,
            newCustomers: uniqueUsers,
            revenueGrowth: "+5.2%",
            swapsGrowth: "+8.1%",
            customersGrowth: "+12%",
            bestStation: bestStationName
        });
        setStationPerformance(performanceList);
        setChartData(chartDataArray);

      } catch (err) {
        console.error("Lỗi tính toán báo cáo:", err);
      } finally {
        setLoading(false);
      }
    };

    calculateData();
  }, [timeFilter]);

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (loading) return <div className="min-h-screen bg-[#0B0F19] flex justify-center items-center text-white">Đang xử lý dữ liệu...</div>;

  return (
    <div className="p-6 bg-[#0B0F19] min-h-screen text-gray-100 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Báo cáo & Thống kê</h1>
          <p className="text-gray-400 mt-1">Tổng quan hiệu suất hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#161b26] border border-gray-700 rounded-lg hover:bg-gray-800 text-white transition">
          <FiDownload /> Xuất báo cáo
        </button>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 mb-6">
          {['week', 'month'].map(f => (
              <button 
                key={f} 
                onClick={() => setTimeFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${timeFilter === f ? 'bg-blue-600 text-white' : 'bg-[#161b26] text-gray-400 border border-gray-800'}`}
              >
                  {f === 'week' ? '7 Ngày qua' : 'Tháng này'}
              </button>
          ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} growth={stats.revenueGrowth} icon={<FiDollarSign size={24}/>} color="green"/>
        <StatCard title="Tổng lượt đổi pin" value={stats.totalSwaps.toLocaleString()} growth={stats.swapsGrowth} icon={<FiBarChart2 size={24}/>} color="blue"/>
        <StatCard title="Khách hàng" value={stats.newCustomers} growth={stats.customersGrowth} icon={<FiUsers size={24}/>} color="purple"/>
        <StatCard title="Trạm tốt nhất" value={stats.bestStation} growth="Top 1" icon={<FiTrendingUp size={24}/>} color="yellow"/>
      </div>

      {/* Charts & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#161b26] p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Biểu đồ Doanh thu</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false}/>
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val)=>`${val/1000000}M`} />
                        <Tooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color:'#fff'}} itemStyle={{color: '#60A5FA'}} formatter={(val)=>[formatCurrency(val), "Doanh thu"]}/>
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* AI Suggestions (Đã cập nhật dynamic data) */}
        <div className="lg:col-span-1 bg-[#161b26] p-6 rounded-xl border border-gray-800 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <FiCpu className="text-blue-500" size={24}/>
                <h3 className="text-xl font-bold text-white">Gợi ý AI (Beta)</h3>
            </div>
            
            {/* Box 1: Dự báo nhu cầu cao nhất */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                <p className="font-bold text-blue-400 mb-1">Dự báo nhu cầu</p>
                {topForecast && topForecast.forecast ? (
                    <>
                        <p className="text-sm text-gray-300 mb-2">
                           Trạm <span className="font-bold text-white">{topForecast.name}</span> dự kiến cần tới 
                           <span className="font-bold text-yellow-400"> {topForecast.forecast.predictedSwaps} pin</span> vào ngày mai.
                        </p>
                        <p className="text-xs text-gray-400 italic">"{topForecast.forecast.note}"</p>
                    </>
                ) : (
                    <p className="text-sm text-gray-300">Chưa có dữ liệu dự báo nào.</p>
                )}
            </div>
            
            {/* Box 2: Cảnh báo chung */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <p className="font-bold text-yellow-400 mb-1">Chiến lược vận hành</p>
                <p className="text-sm text-gray-300">
                    Nên tập trung điều phối pin sạc đầy tới các trạm có khung giờ cao điểm từ 
                    <span className="font-bold text-white"> 17h - 19h</span>.
                </p>
            </div>
        </div>
      </div>

      {/* Station Performance Table (Đã thêm cột Dự báo) */}
      <div className="bg-[#161b26] p-6 rounded-xl border border-gray-800 overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-4">Hiệu suất & Dự báo Trạm</h3>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 uppercase bg-[#1f2937]">
                      <tr>
                          <th className="p-4">Tên Trạm</th>
                          <th className="p-4 text-right">Lượt đổi (Thực tế)</th>
                          <th className="p-4 text-center bg-blue-900/20">Dự báo (Ngày mai)</th>
                          <th className="p-4 text-center">Giờ cao điểm</th>
                          <th className="p-4 text-right">Doanh thu</th>
                          <th className="p-4 text-center">Trạng thái</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                      {stationPerformance.map(s => (
                          <tr key={s.id} className="hover:bg-[#1f2937]/50 transition-colors">
                              <td className="p-4 font-bold text-white">{s.name}</td>
                              
                              {/* Thực tế */}
                              <td className="p-4 text-right text-gray-300">{s.swaps.toLocaleString()}</td>
                              
                              {/* Dự báo AI */}
                              <td className="p-4 text-center bg-blue-900/10">
                                  {s.forecast ? (
                                      <div className="flex flex-col items-center">
                                          <span className="text-yellow-400 font-bold text-base">
                                              {s.forecast.predictedSwaps}
                                          </span>
                                          <span className="text-[10px] text-gray-500">lượt</span>
                                      </div>
                                  ) : (
                                      <span className="text-gray-600">-</span>
                                  )}
                              </td>

                              {/* Giờ cao điểm */}
                              <td className="p-4 text-center">
                                  {s.forecast ? (
                                     <div className="flex items-center justify-center gap-1 text-gray-300 bg-gray-800 px-2 py-1 rounded">
                                        <FiClock size={12}/> {s.forecast.peakHours}
                                     </div>
                                  ) : (
                                     <span className="text-gray-600">-</span>
                                  )}
                              </td>

                              {/* Doanh thu */}
                              <td className="p-4 text-right text-blue-400 font-mono">{formatCurrency(s.revenue)}</td>
                              
                              {/* Trạng thái */}
                              <td className="p-4 text-center">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                      {s.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
};

export default AdminReportPage;