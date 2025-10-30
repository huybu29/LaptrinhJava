import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminBatteries = () => {
  const [batteries, setBatteries] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBatteries, setFilteredBatteries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    batteryCode: "",
    soh: 0,
    capacityKwh: 0,
    stationId: null,
    status: "AVAILABLE",
    lastUsedAt: null
  });

  // 🧩 Lấy danh sách pin
  const fetchBatteries = async () => {
    try {
      const res = await api.get("/batteries");
      setBatteries(res.data);
      setFilteredBatteries(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách pin:", err);
    }
  };

  useEffect(() => {
    fetchBatteries();
  }, []);

  // 🔍 Tìm kiếm
  useEffect(() => {
    setFilteredBatteries(
      batteries.filter(
        (b) =>
          (b.batteryCode || "").toLowerCase().includes(search.toLowerCase()) ||
          (b.status || "").toLowerCase().includes(search.toLowerCase()) ||
          (b.stationId ? b.stationId.toString() : "").includes(search)
      )
    );
  }, [search, batteries]);

  // 🗑️ Xóa pin
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa pin này?")) return;
    try {
      await api.delete(`/batteries/${id}`);
      setBatteries(batteries.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa pin:", err);
    }
  };

  // 💾 Thêm / Cập nhật pin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/batteries/${formData.id}`, formData);
      } else {
        await api.post("/batteries", formData);
      }
      setShowModal(false);
      setFormData({
        id: null,
        batteryCode: "",
        soh: 0,
        capacityKwh: 0,
        stationId: null,
        status: "AVAILABLE",
        lastUsedAt: null
      });
      fetchBatteries();
    } catch (err) {
      console.error("Lỗi khi lưu pin:", err);
    }
  };

  const handleEdit = (battery) => {
    setFormData(battery);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🧰 Quản lý pin</h2>
      <p className="text-gray-600 mb-4">Danh sách pin trong kho.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, trạm, trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          ➕ Thêm pin
        </button>
      </div>

      {/* Bảng hiển thị pin */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Mã pin</th>
              <th className="px-4 py-2">SOH</th>
              <th className="px-4 py-2">Dung lượng (kWh)</th>
              <th className="px-4 py-2">ID trạm</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatteries.length > 0 ? (
              filteredBatteries.map((b, i) => (
                <tr key={b.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-semibold">{b.batteryCode}</td>
                  <td className="px-4 py-2">{b.soh}</td>
                  <td className="px-4 py-2">{b.capacityKwh}</td>
                  <td className="px-4 py-2">{b.stationId}</td>
                  <td
                    className={`px-4 py-2 font-bold ${
                      b.status === "AVAILABLE" ? "text-green-600" :
                      b.status === "IN_USE" ? "text-yellow-600" :
                      b.status === "CHARGING" ? "text-blue-600" :
                      "text-gray-500"
                    }`}
                  >
                    {b.status}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Không có pin nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h3 className="text-xl font-bold mb-4">
              {formData.id ? "✏️ Sửa pin" : "➕ Thêm pin"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Mã pin"
                value={formData.batteryCode}
                onChange={(e) => setFormData({ ...formData, batteryCode: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="SOH"
                value={formData.soh}
                onChange={(e) => setFormData({ ...formData, soh: parseFloat(e.target.value) })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Dung lượng (kWh)"
                value={formData.capacityKwh}
                onChange={(e) => setFormData({ ...formData, capacityKwh: parseFloat(e.target.value) })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="ID trạm"
                value={formData.stationId || ""}
                onChange={(e) => setFormData({ ...formData, stationId: parseInt(e.target.value) })}
                className="border px-3 py-2 rounded"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="IN_USE">IN_USE</option>
                <option value="CHARGING">CHARGING</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default AdminBatteries;
