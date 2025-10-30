// src/pages/AdminEditStation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const AdminEditStation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: 0,
    longitude: 0,
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const res = await api.get(`/stations/${id}`, {
          headers: { "X-User-Role": "ROLE_ADMIN" },
        });
        setStation(res.data);
      } catch (error) {
        console.error("Lỗi khi tải trạm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/stations/${id}`, station, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      alert("Cập nhật thành công!");
      navigate("/admin/stations");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạm:", error);
      alert("Cập nhật thất bại!");
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">✏️ Chỉnh sửa trạm</h2>
      <div className="space-y-3">
        <label className="block">
          Tên trạm:
          <input
            type="text"
            name="name"
            value={station.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block">
          Địa chỉ:
          <input
            type="text"
            name="address"
            value={station.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block">
          Phone:
          <input
            type="text"
            name="phone"
            value={station.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block">
          Vĩ độ:
          <input
            type="number"
            name="latitude"
            value={station.latitude}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block">
          Kinh độ:
          <input
            type="number"
            name="longitude"
            value={station.longitude}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block">
          Trạng thái:
          <select
            name="status"
            value={station.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mt-1"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => navigate("/admin/stations")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AdminEditStation;
