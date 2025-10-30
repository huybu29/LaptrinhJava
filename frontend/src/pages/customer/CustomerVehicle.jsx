import React, { useEffect, useState } from "react";
import api from "../../services/api";

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vin: "",
    model: "",
    batteryType: "",
  });

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  const fetchVehicles = async () => {
    try {
      const res = await api.get(`/vehicles/me`, {
        headers: {
          "X-User-Role": userRole,
          "X-User-Id": userId,
        },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách xe:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", { ...newVehicle, ownerId: userId });
      setShowForm(false);
      setNewVehicle({ vin: "", model: "", batteryType: "" });
      fetchVehicles();
    } catch (err) {
      console.error("Lỗi khi thêm xe:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Đang tải dữ liệu...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">🚗 Phương tiện của tôi</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            {showForm ? "✖️ Hủy" : "+ Thêm phương tiện"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddVehicle} className="bg-gray-100 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="VIN"
                value={newVehicle.vin}
                onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Battery Type"
                value={newVehicle.batteryType}
                onChange={(e) => setNewVehicle({ ...newVehicle, batteryType: e.target.value })}
                className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="text-right mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
              >
                ✅ Lưu phương tiện
              </button>
            </div>
          </form>
        )}

        {vehicles.length === 0 ? (
          <p className="text-gray-500 italic text-center">Bạn chưa có phương tiện nào được thêm.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{v.model}</h3>
                <p className="text-gray-600"><strong>VIN:</strong> {v.vin}</p>
                <p className="text-gray-600"><strong>Battery Type:</strong> {v.batteryType}</p>
                <p className="text-gray-600"><strong>Registered At:</strong> {v.registeredAt ? new Date(v.registeredAt).toLocaleString() : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVehicles;
