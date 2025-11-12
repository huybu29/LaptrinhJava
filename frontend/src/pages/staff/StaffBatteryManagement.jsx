import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";

const StaffBatteryManagement = () => {
  const { user } = useContext(AuthContext);
  const [batteries, setBatteries] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBatteries, setFilteredBatteries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);

  const stationId = user?.stationId; // ID trạm của nhân viên

  // 🧩 Lấy danh sách pin rồi lọc theo stationId của nhân viên
  const fetchBatteries = async () => {
    try {
      const res = await api.get("/batteries"); // lấy toàn bộ pin
      const allBatteries = res.data;
      const stationBatteries = allBatteries.filter(
        (b) => b.stationId === stationId
      );
      setBatteries(stationBatteries);
      setFilteredBatteries(stationBatteries);
    } catch (err) {
      console.error("Lỗi khi tải danh sách pin:", err);
    }
  };

  useEffect(() => {
    if (stationId) fetchBatteries();
  }, [stationId]);

  // 🔍 Tìm kiếm
  useEffect(() => {
    setFilteredBatteries(
      batteries.filter(
        (b) =>
          (b.batteryCode || "").toLowerCase().includes(search.toLowerCase()) ||
          (b.status || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, batteries]);

  // 💾 Cập nhật trạng thái pin
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/batteries/${selectedBattery.id}`, selectedBattery);
      setShowModal(false);
      fetchBatteries();
    } catch (err) {
      console.error("Lỗi khi cập nhật pin:", err);
    }
  };

  const handleEdit = (battery) => {
    setSelectedBattery(battery);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🔋 Quản lý pin trạm</h2>
      <p className="text-gray-600 mb-4">
        Danh sách pin thuộc trạm <span className="font-semibold">{stationId}</span>.
      </p>

      {/* Ô tìm kiếm */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã pin hoặc trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 w-1/2"
        />
      </div>

      {/* Bảng hiển thị pin */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Mã pin</th>
              <th className="px-4 py-2">SOH</th>
              <th className="px-4 py-2">Dung lượng (kWh)</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatteries.length > 0 ? (
              filteredBatteries.map((b, i) => (
                <tr key={b.id} className="border-t hover:bg-green-50 transition">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-semibold">{b.batteryCode}</td>
                  <td className="px-4 py-2">{b.soh}</td>
                  <td className="px-4 py-2">{b.capacityKwh}</td>
                  <td
                    className={`px-4 py-2 font-bold ${
                      b.status === "AVAILABLE"
                        ? "text-green-600"
                        : b.status === "IN_USE"
                        ? "text-yellow-600"
                        : b.status === "CHARGING"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {b.status}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(b)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có pin nào trong trạm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cập nhật */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">🔧 Cập nhật trạng thái pin</h3>
            <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Mã pin</label>
                <input
                  type="text"
                  value={selectedBattery?.batteryCode || ""}
                  readOnly
                  className="border px-3 py-2 rounded w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={selectedBattery?.status || ""}
                  onChange={(e) =>
                    setSelectedBattery({ ...selectedBattery, status: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="IN_USE">IN_USE</option>
                  <option value="CHARGING">CHARGING</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBatteryManagement;
