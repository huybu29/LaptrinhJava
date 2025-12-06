import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { 
  FiSearch, FiCalendar, FiList, FiGrid,
  FiClock, FiLoader, FiX, FiAlertCircle, FiMoreHorizontal, FiRefreshCcw,
  FiCheckCircle, FiSlash, FiActivity, FiUser, FiTruck, FiPlayCircle
} from 'react-icons/fi';
import api from '../../services/api'; 

export default function StationAppointmentManager() {
  const navigate = useNavigate(); // Hook điều hướng

  // --- STATE ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // Loading cho nút bấm

  const [viewMode, setViewMode] = useState("LIST"); // 'LIST' | 'CALENDAR'
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // State lịch (Tháng hiện tại)
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- 1. FETCH DATA ---
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/appointments/my-station`);

      const mappedData = response.data.map(item => {
        // Parse ngày giờ từ chuỗi ISO
        const dateObj = new Date(item.appointmentDate);
        
        return {
          id: item.id,
          rawDate: item.appointmentDate,
          status: item.status, 
          notes: item.notes,
          customerId: item.customerId,
          vehicleId: item.vehicleId,
          
          // Dữ liệu hiển thị
          date: dateObj.toISOString().split('T')[0], // YYYY-MM-DD
          time: dateObj.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
          
          // Fallback hiển thị (nếu API chưa trả về tên)
          customerName: item.customerName || `Khách hàng #${item.customerId}`,
          vehicleName: item.vehicleName || `Xe ID: ${item.vehicleId}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.customerId}`
        };
      });
      setAppointments(mappedData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setError("Không thể tải danh sách lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --- 2. HÀM TIẾP NHẬN (CHECK-IN) ---
  const handleCheckIn = async (appointment) => {
    if (appointment.status === 'IN_PROGRESS') {
        navigate(`/staff/swap-process/${appointment.id}`);
        return;
    }
    try {
        setProcessingId(appointment.id);
        
        // Bước A: Gọi API cập nhật trạng thái
        await api.put(`/appointments/${appointment.id}`, {
            status: "IN_PROGRESS",
            notes: appointment.notes
        });

        // Bước B: Chuyển hướng kèm ID trên URL (để bên kia dùng useParams)
        navigate(`/staff/swap-process/${appointment.id}`);

    } catch (err) {
        console.error("Lỗi tiếp nhận:", err);
        alert("Có lỗi xảy ra khi tiếp nhận. Vui lòng thử lại.");
    } finally {
        setProcessingId(null);
    }
  };

  // --- 3. HELPER & FILTERS ---
  const filteredList = appointments.filter(item => {
    const matchStatus = filterStatus === "ALL" || item.status === filterStatus;
    const matchSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.id.toString().includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const renderStatusBadge = (status, mini = false) => {
    const config = {
      PENDING:     { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Chờ xử lý", icon: <FiClock/> },
      CONFIRMED:   { color: "text-blue-500",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   label: "Đã xác nhận", icon: <FiCheckCircle/> },
      IN_PROGRESS: { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "Đang thực hiện", icon: <FiActivity/> },
      COMPLETED:   { color: "text-green-500",  bg: "bg-green-500/10",  border: "border-green-500/20",  label: "Hoàn tất", icon: <FiCheckCircle/> },
      CANCELED:    { color: "text-red-500",    bg: "bg-red-500/10",    border: "border-red-500/20",    label: "Đã hủy", icon: <FiSlash/> },
    };
    const style = config[status] || config.PENDING;
    if (mini) return <div className={`w-2 h-2 rounded-full ${style.bg.replace('/10', '')}`}></div>;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${style.bg} ${style.color} ${style.border}`}>
        {style.icon} {style.label}
      </span>
    );
  };

  // --- 4. VIEW: LIST (DANH SÁCH) ---
  const renderListView = () => (
    <div className="bg-[#161b26] border border-gray-800 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1f2937] text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-5 font-medium">Thời gian</th>
              <th className="p-5 font-medium">Khách hàng</th>
              <th className="p-5 font-medium">Xe</th>
              <th className="p-5 font-medium">Trạng thái</th>
              <th className="p-5 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {filteredList.length > 0 ? filteredList.map((item) => (
              <tr key={item.id} className="hover:bg-[#1f2937]/50 transition-colors cursor-pointer" onClick={() => setSelectedBooking(item)}>
                <td className="p-5">
                  <div className="font-mono text-lg font-bold text-white">{item.time}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-700" />
                    <div>
                      <div className="font-bold text-white">{item.customerName}</div>
                      <div className="text-xs text-gray-500">ID: {item.customerId}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="font-medium text-gray-200">{item.vehicleName}</div>
                  <div className="text-xs text-blue-400 font-mono mt-1">ID: {item.vehicleId}</div>
                </td>
                <td className="p-5">{renderStatusBadge(item.status)}</td>
                <td className="p-5 text-right">
                    {(item.status === 'PENDING' || item.status === 'CONFIRMED') ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleCheckIn(item); }}
                            disabled={processingId === item.id}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto ${processingId === item.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {processingId === item.id ? <FiLoader className="animate-spin"/> : <FiPlayCircle />} Tiếp nhận
                        </button>
                    ) : (
                        <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"><FiMoreHorizontal size={20} /></button>
                    )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="p-12 text-center text-gray-500">Không tìm thấy lịch hẹn.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- 5. VIEW: CALENDAR (LỊCH HOÀN CHỈNH) ---
  const renderCalendarView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); 

    // Logic tính toán lịch
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (CN) -> 6 (T7)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Mảng ô trống đầu tháng
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    // Mảng các ngày trong tháng
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
        {/* Điều khiển tháng */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white capitalize">
                Tháng {month + 1}, {year}
            </h2>
            <div className="flex gap-2">
                <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700 text-gray-300">Trước</button>
                <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500 text-white">Hiện tại</button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700 text-gray-300">Sau</button>
            </div>
        </div>

        {/* Grid Lịch */}
        <div className="grid grid-cols-7 gap-2">
          {/* Header Thứ */}
          {['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'].map(d => (
             <div key={d} className="text-center text-xs text-gray-500 font-bold py-2 uppercase tracking-wide">{d}</div>
          ))}

          {/* Ô trống (Padding) */}
          {blanks.map(b => <div key={`blank-${b}`} className="min-h-[100px] bg-transparent"></div>)}

          {/* Các ngày */}
          {days.map(day => {
            // Tạo chuỗi ngày chuẩn YYYY-MM-DD
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // Tìm lịch hẹn trong ngày này
            const dayBookings = filteredList.filter(b => b.date === dateStr);
            
            // Kiểm tra có phải hôm nay không
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <div 
                key={day} 
                className={`min-h-[100px] border rounded-xl p-2 flex flex-col gap-1 transition-all ${
                  isToday 
                    ? 'bg-blue-900/10 border-blue-500 relative' 
                    : 'bg-[#0f1219] border-gray-800 hover:border-gray-600'
                }`}
              >
                {/* Số ngày */}
                <div className={`text-sm font-bold mb-1 flex justify-between items-center ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>
                    <span>{day}</span>
                    {isToday && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                </div>
                
                {/* Danh sách booking trong ngày */}
                <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar max-h-[80px]">
                  {dayBookings.map(b => (
                    <div 
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="text-[10px] px-2 py-1.5 rounded cursor-pointer flex items-center gap-1.5 border bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 group"
                    >
                      {renderStatusBadge(b.status, true)}
                      <span className="truncate font-mono group-hover:text-white transition-colors">
                        {b.time.substring(0,5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 font-sans p-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><FiCalendar className="text-blue-500" /> Quản lý Lịch hẹn</h1></div>
        <div className="flex gap-2">
             <button onClick={fetchAppointments} className="p-2 bg-[#161b26] border border-gray-800 rounded-lg hover:text-blue-500"><FiRefreshCcw className={loading ? "animate-spin" : ""} /></button>
            <div className="flex bg-[#161b26] p-1 rounded-lg border border-gray-800">
                <button onClick={() => setViewMode('LIST')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'LIST' ? 'bg-[#2d3342] text-white shadow' : 'text-gray-400 hover:text-white'}`}><FiList /> Danh sách</button>
                <button onClick={() => setViewMode('CALENDAR')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'CALENDAR' ? 'bg-[#2d3342] text-white shadow' : 'text-gray-400 hover:text-white'}`}><FiGrid /> Lịch</button>
            </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors uppercase ${filterStatus === status ? 'bg-blue-600 text-white' : 'bg-[#0f1219] text-gray-400 border border-gray-800'}`}>{status === 'ALL' ? 'Tất cả' : status}</button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#0f1219] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:border-blue-500 outline-none" />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? <div className="flex justify-center p-12"><FiLoader className="animate-spin text-3xl text-blue-500"/></div> : (viewMode === 'LIST' ? renderListView() : renderCalendarView())}

      {/* MODAL CHI TIẾT */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
          <div className="bg-[#161b26] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1f2937] p-5 flex justify-between items-center border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Chi tiết Lịch hẹn #{selectedBooking.id}</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
                <div className="flex gap-4 items-center">
                    <img src={selectedBooking.avatar} className="w-16 h-16 rounded-xl bg-gray-700 object-cover" alt="Avt"/>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">{selectedBooking.customerName}</h2>
                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">ID: {selectedBooking.customerId}</span>
                        </div>
                        <div className="mt-2">{renderStatusBadge(selectedBooking.status)}</div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0f1219] p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-500 text-xs uppercase mb-2 flex items-center gap-1"><FiClock/> Thời gian</p>
                        <p className="text-white font-mono font-bold text-lg">{selectedBooking.time}</p>
                        <p className="text-blue-400 text-sm">{selectedBooking.date}</p>
                    </div>
                    <div className="bg-[#0f1219] p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-500 text-xs uppercase mb-2 flex items-center gap-1"><FiTruck/> Phương tiện</p>
                        <p className="text-white font-bold truncate">Xe ID: {selectedBooking.vehicleId}</p>
                    </div>
                </div>

                {selectedBooking.notes ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-sm">
                        <FiAlertCircle className="text-yellow-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-yellow-500 text-xs uppercase mb-1">Ghi chú từ khách hàng</p>
                            <span className="text-gray-300">{selectedBooking.notes}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center italic text-sm">Không có ghi chú.</p>
                )}
            </div>
            <div className="p-4 bg-[#0f1219] border-t border-gray-800 flex justify-end gap-3">
                <button onClick={() => setSelectedBooking(null)} className="px-6 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">Đóng</button>
                
                {/* NÚT TIẾP NHẬN - CHUYỂN HƯỚNG */}
                {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'IN_PROGRESS') && (
                    <button 
                        onClick={() => handleCheckIn(selectedBooking)}
                        disabled={processingId === selectedBooking.id}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
                    >
                        {processingId === selectedBooking.id ? <FiLoader className="animate-spin"/> : <FiPlayCircle />} 
                        Tiếp nhận & Xử lý
                    </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}