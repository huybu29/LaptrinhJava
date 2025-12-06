import React, { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";
import { FaFilter, FaRedo, FaEdit } from "react-icons/fa";

/* ======= UI helpers (Đã sửa cho Pin) ======= */
// Cập nhật theo Dark Mode của StaffLayout
const StatusBadge = ({ value }) => {
  const cls =
    value === "FULL" ? "text-green-300 bg-green-800" :
    value === "CHARGING" ? "text-yellow-300 bg-yellow-800" :
    value === "MAINTENANCE" ? "text-red-300 bg-red-800" :
    value === "IN_USE" ? "text-blue-300 bg-blue-800" :
    "text-gray-300 bg-gray-700";
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${cls}`}>{value}</span>;
};

// Các trạng thái nhân viên có thể cập nhật
const ALL_STATUSES = ["FULL", "CHARGING", "MAINTENANCE", "IN_USE"];

// Build payload đầy đủ (Dựa theo cấu trúc Entity/DTO của Battery)
const buildBatteryPayload = (b, nextStatus) => ({
  id: b.id,
  serialNumber: b.serialNumber,
  capacityKwh: b.capacityKwh,
  soh: b.soh,
  status: nextStatus, // Trạng thái mới
  stationId: b.stationId,
  // Thêm các trường khác nếu backend yêu cầu (vd: cycleCount)
});

/* ======= Component ======= */
const StaffInventoryPage = () => {
  const { user } = useContext(AuthContext);
  const stationId = user?.stationId;

  const [allBatteries, setAllBatteries] = useState([]); // Pin của trạm
  const [filteredBatteries, setFilteredBatteries] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusDraft, setStatusDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Lấy danh sách pin (toàn hệ thống) rồi lọc theo trạm của staff
  const fetchBatteries = async () => {
    if (!stationId) return;
    try {
      setLoading(true);
      setErr("");
      // Giả định /api/batteries trả về TẤT CẢ pin
      const res = await api.get("/batteries"); 
      const all = Array.isArray(res.data) ? res.data : [];
      
      // Lọc pin chỉ thuộc trạm của nhân viên này
      const mine = all.filter((b) => Number(b.stationId) === Number(stationId));
      
      setAllBatteries(mine);
      setFilteredBatteries(mine);
    } catch (error) {
      console.error("Lỗi khi tải danh sách pin:", error);
      setErr("Không thể tải danh sách pin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  // Filter (Lọc theo Tình trạng và Tìm kiếm)
  useEffect(() => {
    let result = allBatteries;

    // 1. Lọc theo trạng thái
    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }

    // 2. Lọc theo tìm kiếm (Serial, Model)
    const q = (filters.search || "").toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          (b.serialNumber || "").toLowerCase().includes(q) 
      );
    }
    
    setFilteredBatteries(result);
  }, [filters, allBatteries]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Mở Modal
  const openModal = (battery) => {
    setSelected(battery);
    setStatusDraft(battery?.status || "FULL");
    setShowModal(true);
  };

  // Lưu trạng thái từ modal
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selected) return;
    
    if (statusDraft === selected.status) {
      setShowModal(false);
      return; // Không thay đổi
    }

    try {
      const payload = buildBatteryPayload(selected, statusDraft);
      // Giả định API cập nhật pin
      await api.put(`/batteries/${selected.id}`, payload); 
      setShowModal(false);
      setSelected(null);
      setStatusDraft("");
      fetchBatteries(); // Tải lại dữ liệu
    } catch (error) {
      console.error("PUT /batteries error:", error?.response || error);
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  if (!stationId) {
    return (
      <div className="bg-yellow-800 border border-yellow-700 text-yellow-100 p-4 rounded-lg">
        Không xác định được <b>stationId</b> của nhân viên.
      </div>
    );
  }

  return (
    // Dùng nền tối (dark mode) của StaffLayout
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md border border-gray-800">
      <h2 className="text-2xl font-bold mb-2 text-white">Quản lý Tồn kho Pin</h2>
      <p className="text-gray-400 mb-4">
        Theo dõi và quản lý pin tại trạm (Station ID: {stationId}).
      </p>

      {/* Thanh Filter (Mục 2.a) */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Tìm theo Mã Pin (Serial) hoặc Model..."
          value={filters.search}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
        />
        <div className="flex gap-2 items-center">
          <FaFilter className="text-gray-400" />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả Trạng thái</option>
            <option value="FULL">Đầy (Sẵn sàng)</option>
            <option value="CHARGING">Đang sạc</option>
            <option value="MAINTENANCE">Bảo dưỡng/Lỗi</option>
            <option value="IN_USE">Đang sử dụng</option>
          </select>
        </div>
        <button
          onClick={fetchBatteries}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
        >
          <FaRedo /> Làm mới
        </button>
      </div>

      {err && (
        <div className="mb-3 text-sm text-red-300 bg-red-800 border border-red-700 p-3 rounded">
          {err}
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-800">
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
            <tr>
              <th className="px-4 py-3">Mã Pin (Serial)</th>
              
              <th className="px-4 py-3">Dung lượng</th>
              <th className="px-4 py-3">Sức khỏe (SoH)</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Đang tải dữ liệu pin...
                </td>
              </tr>
            ) : filteredBatteries.length > 0 ? (
              filteredBatteries.map((b) => (
                <tr key={b.id} className="hover:bg-gray-700 transition">
                  <td className="px-4 py-3 font-mono text-white">{b.batteryCode}</td>
                
                  <td className="px-4 py-3">{b.capacityKwh ? `${b.capacityKwh} kWh` : "-"}</td>
                  <td className="px-4 py-3">{b.soh ? `${b.soh}%` : "-"}</td>
                  <td className="px-4 py-3"><StatusBadge value={b.status || "UNKNOWN"} /></td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openModal(b)}
                      className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded transition text-sm flex items-center gap-1 mx-auto"
                    >
                      <FaEdit /> Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  Không tìm thấy pin nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Cập nhật Trạng thái */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3 shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Cập nhật Trạng thái Pin</h3>
            <form onSubmit={handleSaveStatus}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Mã Pin</label>
                <input
                  readOnly
                  value={selected.id}
                  className="mt-1 border px-3 py-2 rounded bg-gray-700 text-gray-300 w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400">Trạng thái mới</label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                  className="mt-1 border px-3 py-2 rounded bg-gray-700 border-gray-600 text-white w-full"
                >
                  <option value={selected.status} disabled>
                    {selected.status} (hiện tại)
                  </option>
                  {ALL_STATUSES.filter(s => s !== selected.status).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setSelected(null); }}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded bg-green-600 hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffInventoryPage;