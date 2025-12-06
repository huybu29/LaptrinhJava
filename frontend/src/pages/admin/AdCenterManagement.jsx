import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone, 
  FiCheckCircle, FiAlertTriangle, FiXCircle, FiX, FiBatteryCharging, 
  FiRefreshCw, FiCheckSquare, FiSquare, FiArrowRight
} from "react-icons/fi";

const AdminStations = () => {
  // === DATA STATES ===
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // === PAGINATION & FILTER ===
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // === MODAL ADD/EDIT STATION ===
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: null, name: "", location: "", phone: "", latitude: 0, longitude: 0, status: "ACTIVE",
  });

  // === NEW STATES: QUẢN LÝ KHO PIN & BULK ACTION ===
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationBatteries, setStationBatteries] = useState([]);
  const [loadingBatteries, setLoadingBatteries] = useState(false);
  
  // State cho việc chọn nhiều pin
  const [selectedBatIds, setSelectedBatIds] = useState([]); 
  const [targetStationId, setTargetStationId] = useState(""); // ID trạm đích để điều phối

  // --- FETCH DATA ---
  const fetchStations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stations", { headers: { "X-User-Role": "ROLE_ADMIN" } });
      setStations(res.data);
      setFilteredStations(res.data);
    } catch (error) { console.error("Lỗi tải trạm:", error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchStations(); }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const results = stations.filter(s => (s.name || "").toLowerCase().includes(lowerSearch) || (s.location || "").toLowerCase().includes(lowerSearch));
    setFilteredStations(results);
    setCurrentPage(1);
  }, [search, stations]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);

  // --- HANDLERS CHO STATION ---
  const handleDelete = async (id) => {
      if (!window.confirm("Xóa trạm này?")) return;
      try {
          await api.delete(`/stations/${id}`, { headers: { "X-User-Role": "ROLE_ADMIN" } });
          setStations(prev => prev.filter(s => s.id !== id));
      } catch (e) { alert("Lỗi xóa: " + e.message); }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          if (isEditing) await api.put(`/stations/${formData.id}`, formData, { headers: { "X-User-Role": "ROLE_ADMIN" } });
          else await api.post("/stations", formData, { headers: { "X-User-Role": "ROLE_ADMIN" } });
          setShowModal(false); fetchStations();
      } catch (e) { alert("Lỗi lưu: " + e.message); } finally { setIsSubmitting(false); }
  };

  // === HANDLERS CHO KHO PIN (INVENTORY) ===
  
  const handleViewInventory = async (station) => {
      setSelectedStation(station);
      setShowInventoryModal(true);
      setLoadingBatteries(true);
      setSelectedBatIds([]); // Reset selection
      setTargetStationId(""); // Reset target

      try {
          const res = await api.get(`/batteries/station/${station.id}/available`, {
              headers: { "X-User-Role": "ROLE_ADMIN" }
          });
          setStationBatteries(res.data);
      } catch (error) {
          console.error(error);
          alert("Không thể tải dữ liệu pin.");
      } finally {
          setLoadingBatteries(false);
      }
  };

  // --- LOGIC CHỌN NHIỀU (MULTI-SELECT) ---
  const toggleSelectAll = () => {
      if (selectedBatIds.length === stationBatteries.length) {
          setSelectedBatIds([]); // Bỏ chọn hết
      } else {
          setSelectedBatIds(stationBatteries.map(b => b.id)); // Chọn hết
      }
  };

  const toggleSelectOne = (id) => {
      if (selectedBatIds.includes(id)) {
          setSelectedBatIds(prev => prev.filter(item => item !== id));
      } else {
          setSelectedBatIds(prev => [...prev, id]);
      }
  };

  // --- LOGIC ĐIỀU PHỐI HÀNG LOẠT (BULK TRANSFER) ---
  const handleBulkTransfer = async () => {
      if (selectedBatIds.length === 0) return alert("Vui lòng chọn ít nhất 1 pin!");
      if (!targetStationId) return alert("Vui lòng chọn trạm đích!");
      if (parseInt(targetStationId) === selectedStation.id) return alert("Trạm đích không được trùng trạm hiện tại!");

      if (!window.confirm(`Bạn có chắc muốn chuyển ${selectedBatIds.length} pin sang trạm mới?`)) return;

      try {
          // Gọi API song song cho tất cả pin được chọn
          // (Trong thực tế nên có API bulk update từ Backend, nhưng ở đây dùng loop update để tận dụng API cũ)
          const promises = selectedBatIds.map(batteryId => {
              const battery = stationBatteries.find(b => b.id === batteryId);
              return api.put(`/batteries/${batteryId}`, {
                  ...battery,
                  stationId: parseInt(targetStationId)
              }, { headers: { "X-User-Role": "ROLE_ADMIN" } });
          });

          await Promise.all(promises);

          alert(`Đã điều phối ${selectedBatIds.length} pin thành công!`);
          handleViewInventory(selectedStation); // Reload lại kho
      } catch (error) {
          console.error(error);
          alert("Có lỗi xảy ra khi điều phối. Vui lòng kiểm tra lại.");
      }
  };

  // Helper Render
  const renderStatusBadge = (status) => {
    const styles = { ACTIVE: "bg-green-500/10 text-green-500", MAINTENANCE: "bg-yellow-500/10 text-yellow-500", INACTIVE: "bg-red-500/10 text-red-500" };
    return <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="p-6 bg-[#0B0F19] min-h-screen text-gray-100 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FiMapPin className="text-blue-500" /> Quản lý Trạm Sạc</h1>
        <button onClick={() => {setFormData({id:null,name:"",location:"",phone:"",latitude:0,longitude:0,status:"ACTIVE"}); setIsEditing(false); setShowModal(true);}} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex gap-2">
            <FiPlus /> Thêm Trạm
        </button>
      </div>

      {/* Table Stations */}
      <div className="bg-[#161b26] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
            <thead className="bg-[#1f2937] text-gray-400 text-xs uppercase">
                <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Tên trạm</th>
                    <th className="p-4">Địa chỉ</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Hành động</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-800">
                {currentItems.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-[#1f2937]/50">
                        <td className="p-4 text-gray-500">{idx + 1}</td>
                        <td className="p-4 font-bold">{s.name}</td>
                        <td className="p-4 text-gray-400">{s.location}</td>
                        <td className="p-4">{renderStatusBadge(s.status)}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                            <button onClick={() => handleViewInventory(s)} className="p-2 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20" title="Kho Pin"><FiBatteryCharging /></button>
                            <button onClick={() => {setFormData(s); setIsEditing(true); setShowModal(true);}} className="p-2 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20"><FiEdit2 /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20"><FiTrash2 /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* === MODAL THÊM/SỬA TRẠM === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
           <div className="bg-[#161b26] w-full max-w-lg rounded-2xl border border-gray-700 p-6">
               <h3 className="text-xl font-bold mb-4">{isEditing ? "Cập nhật Trạm" : "Thêm Trạm Mới"}</h3>
               <form onSubmit={handleSubmit} className="space-y-3">
                   <input required placeholder="Tên trạm" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded p-2"/>
                   <input required placeholder="Địa chỉ" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded p-2"/>
                   <div className="flex justify-end gap-3 mt-4">
                       <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 bg-gray-700 rounded">Hủy</button>
                       <button type="submit" className="px-4 py-2 bg-blue-600 rounded text-white">Lưu</button>
                   </div>
               </form>
           </div>
        </div>
      )}

      {/* === MODAL KHO PIN (QUAN TRỌNG) === */}
      {showInventoryModal && selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <div className="bg-[#161b26] w-full max-w-4xl rounded-2xl border border-gray-700 shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <FiBatteryCharging className="text-green-500"/> Kho Pin: {selectedStation.name}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Đang chọn: <span className="text-white font-bold">{selectedBatIds.length}</span> pin</p>
                    </div>
                    <button onClick={() => setShowInventoryModal(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
                </div>

                {/* Body Modal */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {loadingBatteries ? (
                        <div className="text-center text-gray-500 py-10">Đang tải danh sách pin...</div>
                    ) : stationBatteries.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1f2937] text-gray-400 uppercase sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 w-10">
                                        <button onClick={toggleSelectAll} className="text-white hover:text-blue-400">
                                            {selectedBatIds.length === stationBatteries.length && stationBatteries.length > 0 
                                                ? <FiCheckSquare size={18}/> 
                                                : <FiSquare size={18}/>}
                                        </button>
                                    </th>
                                    <th className="p-3">Serial / Code</th>
                                    <th className="p-3">Mức Pin</th>
                                    <th className="p-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {stationBatteries.map(bat => (
                                    <tr key={bat.id} className={`hover:bg-[#1f2937]/50 cursor-pointer ${selectedBatIds.includes(bat.id) ? 'bg-blue-900/20' : ''}`} onClick={() => toggleSelectOne(bat.id)}>
                                        <td className="p-3">
                                            {selectedBatIds.includes(bat.id) 
                                                ? <FiCheckSquare className="text-blue-500" size={18}/> 
                                                : <FiSquare className="text-gray-600" size={18}/>}
                                        </td>
                                        <td className="p-3 font-mono font-bold text-white">{bat.serialNumber || bat.batteryCode}</td>
                                        <td className="p-3 text-green-400 font-bold">{bat.currentLevel || bat.soh}%</td>
                                        <td className="p-3"><span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">AVAILABLE</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-500 py-10 border border-dashed border-gray-700 rounded-xl">
                            Trạm này hiện không có pin nào sẵn sàng.
                        </div>
                    )}
                </div>

                {/* Footer Actions (Thanh điều phối) */}
                <div className="p-4 bg-[#0f1219] border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-gray-400 text-sm hidden md:block">
                        * Chọn pin trong danh sách để thực hiện thao tác
                    </span>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Dropdown chọn trạm đích */}
                        <div className="relative flex-1 md:w-64">
                            <select 
                                value={targetStationId} 
                                onChange={(e) => setTargetStationId(e.target.value)}
                                className="w-full bg-[#161b26] border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:border-blue-500 outline-none appearance-none"
                            >
                                <option value="">-- Chọn trạm chuyển đến --</option>
                                {stations
                                    .filter(s => s.id !== selectedStation.id) // Loại bỏ trạm hiện tại
                                    .map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))
                                }
                            </select>
                            <FiMapPin className="absolute right-3 top-3 text-gray-500 pointer-events-none"/>
                        </div>

                        {/* Nút hành động */}
                        <button 
                            onClick={handleBulkTransfer}
                            disabled={selectedBatIds.length === 0 || !targetStationId}
                            className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                                selectedBatIds.length > 0 && targetStationId 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <FiRefreshCw /> Điều phối ({selectedBatIds.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminStations;