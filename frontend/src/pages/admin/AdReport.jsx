import React, { useState, useEffect } from "react";
// import api from "../../services/api"; // Giả định
import {
  FiDownload,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiCpu,
  FiAlertTriangle,
} from "react-icons/fi";

// === Component Lọc Thời gian ===
const TimeFilter = () => {
  const [active, setActive] = useState("Tháng này");
  const filters = ["Hôm nay", "Tuần này", "Tháng này", "Tùy chỉnh"];

  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActive(filter)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            active === filter
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-gray-400 hover:bg-slate-700"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// === Component Thẻ Thống kê ===
const StatCard = ({ title, value, growth, icon, color }) => {
  const isPositive = growth.startsWith("+");
  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span className={`text-${color}-500`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <div
        className={`text-sm flex items-center gap-1 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
        <span>{growth}</span>
      </div>
    </div>
  );
};

// === Component Trạng thái Bảng ===
const StatusBadge = ({ status }) => {
  if (status === "Hoạt động") {
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 bg-opacity-20 text-green-400">
        Hoạt động
      </span>
    );
  }
  return (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 bg-opacity-20 text-yellow-400">
      Bảo trì
    </span>
  );
};

// === Component Trang chính ===
const AdminReportPage = () => {
  const [loading, setLoading] = useState(true);
  
  // Dữ liệu giả (mock data) - Bạn sẽ thay thế bằng API
  const [stats, setStats] = useState({});
  const [stationPerformance, setStationPerformance] = useState([]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const statsRes = await api.get("/admin/stats");
    //     const performanceRes = await api.get("/admin/station-performance");
    //     setStats(statsRes.data);
    //     setStationPerformance(performanceRes.data);
    //   } catch (err) { console.error(err); }
    //   finally { setLoading(false); }
    // }
    // fetchData();

    // Mock data để demo
    setStats({
      totalRevenue: "1,2 tỷ VNĐ",
      revenueGrowth: "+5.2%",
      totalSwaps: "15,680",
      swapsGrowth: "+8.1%",
      newCustomers: "250",
      customersGrowth: "+12%",
      bestStation: "Trạm Quận 1",
    });
    setStationPerformance([
      { id: 1, name: "Trạm Quận 1", swaps: 2540, revenue: "210,000,000 VNĐ", status: "Hoạt động" },
      { id: 2, name: "Trạm Quận 3", swaps: 1980, revenue: "185,500,000 VNĐ", status: "Hoạt động" },
      { id: 3, name: "Trạm Bình Thạnh", swaps: 1560, revenue: "142,300,000 VNĐ", status: "Bảo trì" },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-gray-300">Đang tải báo cáo...</div>;
  }

  return (
    <div className="bg-slate-900 text-gray-200 p-8 rounded-xl border border-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Báo cáo & Thống kê</h1>
          <p className="text-gray-400 mt-1">
            Phân tích hiệu suất toàn bộ hệ thống trạm đổi pin.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition border border-slate-700">
          <FiDownload />
          Xuất báo cáo
        </button>
      </div>

      {/* Lọc thời gian */}
      <TimeFilter />

      {/* Thống kê KPI (Mục 3.c) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={stats.totalRevenue} 
          growth={stats.revenueGrowth}
          icon={<FiDollarSign size={20} />}
          color="green"
        />
        <StatCard 
          title="Tổng lượt đổi pin" 
          value={stats.totalSwaps} 
          growth={stats.swapsGrowth}
          icon={<FiBarChart2 size={20} />}
          color="blue"
        />
        <StatCard 
          title="Khách hàng mới" 
          value={stats.newCustomers} 
          growth={stats.customersGrowth}
          icon={<FiUsers size={20} />}
          color="purple"
        />
        <StatCard 
          title="Trạm hiệu quả nhất" 
          value={stats.bestStation} 
          growth="Tháng này"
          icon={<FiTrendingUp size={20} />}
          color="yellow"
        />
      </div>

      {/* Biểu đồ (Mục 3.c) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Doanh thu theo thời gian */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-1">Doanh thu theo thời gian</h3>
          <p className="text-2xl font-bold text-white">890 triệu VNĐ</p>
          <p className="text-sm text-green-500 mb-4">Tháng này +12.5%</p>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/*  */}
            <p>[Biểu đồ Đường (Doanh thu) sẽ hiển thị ở đây]</p>
          </div>
        </div>

        {/* Giờ cao điểm */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-1">Giờ cao điểm</h3>
          <p className="text-2xl font-bold text-white">1,200 lượt</p>
          <p className="text-sm text-red-500 mb-4">Hôm nay -2.3%</p>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/*  */}
            <p>[Biểu đồ Cột (Giờ cao điểm) sẽ hiển thị ở đây]</p>
          </div>
        </div>
      </div>

      {/* Bảng & Gợi ý (Mục 3.a & 3.c) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hiệu suất các trạm */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Hiệu suất các trạm</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-400">
                <tr>
                  <th className="pb-3">Tên Trạm</th>
                  <th className="pb-3">Lượt đổi pin</th>
                  <th className="pb-3">Doanh thu</th>
                  <th className="pb-3">Tình trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {stationPerformance.map((station) => (
                  <tr key={station.id}>
                    <td className="py-3 font-medium text-white">{station.name}</td>
                    <td className="py-3 text-gray-300">{station.swaps.toLocaleString("vi-VN")}</td>
                    <td className="py-3 text-gray-300">{station.revenue}</td>
                    <td className="py-3">
                      <StatusBadge status={station.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dự báo & Gợi ý */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <FiCpu size={24} className="text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Dự báo & Gợi ý</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg">
              <p className="font-semibold text-blue-300 mb-1">Dự báo</p>
              <p className="text-sm text-gray-300">
                Dự báo nhu cầu tăng 20% vào cuối tuần tại khu vực trung tâm.
              </p>
            </div>
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 p-4 rounded-lg">
              <p className="font-semibold text-yellow-300 mb-1">Gợi ý</p>
              <p className="text-sm text-gray-300">
                Bổ sung pin cho Trạm Quận 1 và Trạm Quận 3 để đảm bảo hoạt động.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReportPage;