import React, { useState, useEffect } from "react";
// import api from "../../services/api"; // Giả định
import {
  FiCpu,
  FiBatteryCharging,
  FiRepeat,
  FiAlertTriangle,
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiBarChart2,
} from "react-icons/fi";

// === Component: Thẻ Thống kê (Stat Card) ===
const StatCard = ({ title, value, icon, highlight = false }) => (
  <div
    className={`bg-slate-800 p-6 rounded-xl shadow-lg border ${
      highlight
        ? "border-yellow-700"
        : "border-slate-700"
    }`}
  >
    <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
    <div className="flex items-center gap-3">
      <span className={highlight ? "text-yellow-400" : "text-blue-400"}>
        {icon}
      </span>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// === Component: Bảng Khiếu nại (Mục 3.a) ===
const LatestTickets = ({ tickets }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full">
    <h3 className="text-xl font-semibold text-white mb-4">Khiếu nại Mới nhất</h3>
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-lg">
          <div>
            <p className="font-semibold text-white">{ticket.id}</p>
            <p className="text-sm text-gray-300">{ticket.description}</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-yellow-600 text-white rounded-full">
            {ticket.status}
          </span>
        </div>
      ))}
      {tickets.length === 0 && (
        <p className="text-gray-400">Không có khiếu nại nào.</p>
      )}
    </div>
  </div>
);

// === Component: Bảng Hoạt động Gần đây (Mục 3.c) ===
const RecentActivity = ({ activities }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
    <h3 className="text-xl font-semibold text-white mb-4">Hoạt động Gần đây</h3>
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${activity.type === 'dispatch' ? 'bg-blue-600' : 'bg-green-600'}`}>
            {activity.type === 'dispatch' ? <FiTruck size={16} /> : <FiCheckCircle size={16} />}
          </div>
          <p className="text-sm text-gray-300">
            <span className="font-medium text-white">{activity.user}</span> {activity.action}
            <span className="font-medium text-white"> {activity.target}</span>.
          </p>
          <span className="text-xs text-gray-500 ml-auto">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// === Component Trang chính ===
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call
    const fetchData = () => {
      setLoading(true);
      try {
        // const summaryRes = await api.get("/admin/dashboard-summary");
        // setStats(summaryRes.data.stats);
        // setTickets(summaryRes.data.tickets);
        // setActivities(summaryRes.data.activities);
        
        // Mock data
        setStats({
          activeStations: 128,
          availableBatteries: 1450,
          swapsToday: 512,
          pendingTickets: 8,
        });
        setTickets([
          { id: "#CPL-098", description: "Station Delta - Pin lỗi", status: "Đang xử lý" },
          { id: "#CPL-097", description: "Trạm Q1 - Hết pin", status: "Đang xử lý" },
        ]);
        setActivities([
          { id: 1, user: "Admin", action: "điều phối 10 pin tới", target: "Trạm Quận 1", time: "5 phút trước", type: "dispatch" },
          { id: 2, user: "Staff_Vincom", action: "xác nhận giao dịch", target: "#BK-774", time: "7 phút trước", type: "complete" },
          { id: 3, user: "Hệ thống", action: "báo cáo SoH thấp tại", target: "Trạm Bình Thạnh", time: "15 phút trước", type: "dispatch" },
        ]);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-gray-300">Đang tải Bảng điều khiển...</div>;
  }

  return (
    <div className="p-8 bg-slate-900 text-white min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bảng Điều Khiển Quản Trị</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
          <FiTruck size={18} />
          Điều phối Pin
        </button>
      </div>

      {/* Thẻ Thống kê (Mục 3.c) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Trạm đang hoạt động" 
          value={stats.activeStations} 
          icon={<FiCpu size={24} />} 
        />
        <StatCard 
          title="Pin sẵn sàng" 
          value={stats.availableBatteries.toLocaleString("vi-VN")} 
          icon={<FiBatteryCharging size={24} />} 
        />
        <StatCard 
          title="Lượt đổi pin hôm nay" 
          value={stats.swapsToday} 
          icon={<FiRepeat size={24} />} 
        />
        <StatCard 
          title="Khiếu nại chờ xử lý" 
          value={stats.pendingTickets} 
          icon={<FiAlertTriangle size={24} />} 
          highlight={true} 
        />
      </div>

      {/* Cột chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái (Bản đồ & Hoạt động) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bản đồ (Mục 3.a) */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Bản đồ Trạng thái Trạm</h3>
            <div className="h-96 bg-slate-700 rounded-lg flex items-center justify-center text-gray-400">
                            <p>(Khu vực hiển thị Google Map)</p>
            </div>
          </div>

          {/* Hoạt động gần đây */}
          <RecentActivity activities={activities} />
        </div>

        {/* Cột phải (Sức khỏe Pin & Khiếu nại) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Sức khỏe Pin (Mục 3.a) */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Sức khỏe Pin (SoH)</h3>
            <div className="h-48 flex items-center justify-center text-gray-400 bg-slate-700 rounded-lg">
                            <p>(Biểu đồ cột SoH)</p>
            </div>
          </div>
          
          {/* Khiếu nại mới nhất (Mục 3.a) */}
          <LatestTickets tickets={tickets} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;