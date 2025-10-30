// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
    status: "ACTIVE",
  });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.phone || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    try {
      await api.delete(`/users/${id}`, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      await api.post("/users", newUser, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setShowModal(false);
      setNewUser({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER",
        status: "ACTIVE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
      alert("Tạo user thất bại!");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">👤 Quản lý User</h2>
      <p className="text-gray-600 mb-4">Danh sách user trong hệ thống.</p>

      {/* Search & Add */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm username, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ➕ Thêm User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Họ tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, idx) => (
                <tr key={u.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.fullName}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.phone}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{u.status}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded transition"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Không có user nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm user */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">➕ Thêm User</h3>
            <div className="space-y-2">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={newUser.username}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={newUser.fullName}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newUser.phone}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              />
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <select
                name="status"
                value={newUser.status}
                onChange={handleNewUserChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
