import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    status: "OPEN",
  });

  // 🔹 Lấy danh sách ticket
  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
      setFilteredTickets(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ticket:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔹 Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    setFilteredTickets(
      tickets.filter(
        (t) =>
          (t.subject || "").toLowerCase().includes(search.toLowerCase()) ||
          (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
          (t.status || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, tickets]);

  // 🔹 Xóa ticket
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ticket này?")) return;
    try {
      await api.delete(`/tickets/${id}`);
      setTickets(tickets.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa ticket:", error);
    }
  };

  // 🔹 Cập nhật trạng thái ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tickets/${formData.id}/status?status=${formData.status}`);
      setShowModal(false);
      setFormData({ id: null, status: "OPEN" });
      fetchTickets();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái ticket:", error);
    }
  };

  // 🔹 Mở modal sửa trạng thái
  const handleEdit = (ticket) => {
    setFormData({
      id: ticket.id,
      status: ticket.status,
    });
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🎫 Quản lý Ticket hỗ trợ</h2>
      <p className="text-gray-600 mb-4">Cập nhật trạng thái ticket người dùng gửi.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề, mô tả, trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Tiêu đề</th>
              <th className="px-4 py-2">Người dùng</th>
              <th className="px-4 py-2">Trạm</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Tạo lúc</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t, idx) => (
                <tr key={t.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-semibold">{t.subject}</td>
                  <td className="px-4 py-2">{t.userId}</td>
                  <td className="px-4 py-2">{t.stationId}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        t.status === "OPEN"
                          ? "bg-yellow-200 text-yellow-800"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-200 text-blue-800"
                          : t.status === "RESOLVED"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Cập nhật trạng thái
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded transition"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Không có ticket nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal cập nhật trạng thái */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Cập nhật trạng thái Ticket #{formData.id}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default AdminTickets;
