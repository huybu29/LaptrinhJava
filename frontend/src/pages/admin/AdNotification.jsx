import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    receiverType: "",
    readStatus: false,
    createdAt: ""
  });

  // Lấy danh sách thông báo
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setFilteredNotifications(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thông báo:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter theo search
  useEffect(() => {
    setFilteredNotifications(
      notifications.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (n.message || "").toLowerCase().includes(search.toLowerCase()) ||
          (n.receiverType || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, notifications]);

  // Xóa thông báo
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
    }
  };

  // Thêm / Sửa thông báo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/notifications/${formData.id}`, formData);
      } else {
        await api.post("/notifications", formData);
      }
      setShowModal(false);
      setFormData({ title: "", message: "", receiverType: "", readStatus: false, createdAt: "" });
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi khi lưu thông báo:", error);
    }
  };

  const handleEdit = (notification) => {
    // Convert createdAt sang dạng string cho input datetime-local nếu cần
    setFormData({
      ...notification,
      createdAt: notification.createdAt ? new Date(notification.createdAt).toISOString().slice(0,16) : ""
    });
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🔔 Quản lý thông báo</h2>
      <p className="text-gray-600 mb-4">Danh sách các thông báo trong hệ thống.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo title, message, receiverType..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition"
        >
          ➕ Thêm thông báo
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Receiver Type</th>
              <th className="px-4 py-2">Read Status</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n, idx) => (
                <tr key={n.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{n.title}</td>
                  <td className="px-4 py-2">{n.message}</td>
                  <td className="px-4 py-2">{n.receiverType}</td>
                  <td className="px-4 py-2">{n.readStatus ? "✅" : "❌"}</td>
                  <td className="px-4 py-2">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(n)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
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
                  Không có thông báo nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h3 className="text-xl font-bold mb-4">{formData.id ? "Sửa" : "Thêm"} thông báo</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Receiver Type"
                value={formData.receiverType}
                onChange={(e) => setFormData({ ...formData, receiverType: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <label className="flex items-center space-x-2 px-3 py-2 border rounded">
                <input
                  type="checkbox"
                  checked={formData.readStatus}
                  onChange={(e) => setFormData({ ...formData, readStatus: e.target.checked })}
                />
                <span>Đã đọc</span>
              </label>
              <input
                type="datetime-local"
                placeholder="Created At"
                value={formData.createdAt}
                onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <div className="col-span-2 flex justify-end space-x-2 mt-4">
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

export default AdminNotifications;
