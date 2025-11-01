// src/pages/staff/StaffVehicleManagement.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";

const StaffVehicleManagement = () => {
  const { user } = useContext(AuthContext);
  const stationId = user?.stationId;

  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Lấy dữ liệu: vehicles + appointments (lọc theo station)
  const fetchData = async () => {
    if (!stationId) return;
    try {
      setLoading(true);
      setErr("");
      const [vehRes, appRes] = await Promise.all([
        api.get("/vehicles"),
        api.get("/appointments"),
      ]);

      const allVehicles = Array.isArray(vehRes.data) ? vehRes.data : [];
      const allApps = Array.isArray(appRes.data) ? appRes.data : [];

      // chỉ lấy appointment của trạm mình
      const sid = Number(stationId);
      const myApps = allApps.filter(a => Number(a.serviceCenterId) === sid);

      setAppointments(myApps);
      // set tạm, lọc ở useMemo để kết hợp search
      setVehicles(allVehicles);
    } catch (e) {
      console.error(e);
      setErr("Không thể tải dữ liệu phương tiện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  // Tập vehicleId xuất hiện ở các appointment của trạm
  const vehicleIdsInStation = useMemo(() => {
    const s = new Set();
    appointments.forEach(a => {
      if (a.vehicleId != null) s.add(Number(a.vehicleId));
    });
    return s;
  }, [appointments]);

  // Lọc danh sách xe thuộc trạm (qua appointment) + theo search
  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase();

    return vehicles
      .filter(v => vehicleIdsInStation.has(Number(v.id)))
      .filter(v =>
        (v.vin || "").toLowerCase().includes(q) ||
        (v.model || "").toLowerCase().includes(q) ||
        (v.batteryType || "").toLowerCase().includes(q) ||
        String(v.ownerId || "").includes(search)
      );
  }, [vehicles, vehicleIdsInStation, search]);

  if (!stationId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        Không xác định được <b>stationId</b> của nhân viên. Hãy đảm bảo <code>user</code> trong
        <code> AuthContext </code> có trường <code>stationId</code>.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800">🚗 Phương tiện tại trạm</h2>
        <p className="text-gray-600">
          Hiển thị các xe có lịch hẹn tại trạm <span className="font-semibold">{stationId}</span>. (Chỉ xem)
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Tìm theo VIN, model, batteryType, ownerId..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 w-full md:w-1/2"
        />
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          🔄 Làm mới
        </button>
      </div>

      {err && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">VIN</th>
              <th className="px-4 py-2 text-left">Model</th>
              <th className="px-4 py-2 text-left">Battery Type</th>
              <th className="px-4 py-2 text-left">Owner ID</th>
              <th className="px-4 py-2 text-left">Đăng ký</th>
              <th className="px-4 py-2 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((v, idx) => (
                <tr key={v.id} className="border-t hover:bg-green-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-semibold">{v.vin}</td>
                  <td className="px-4 py-2">{v.model}</td>
                  <td className="px-4 py-2">{v.batteryType || "-"}</td>
                  <td className="px-4 py-2">{v.ownerId ?? "-"}</td>
                  <td className="px-4 py-2">
                    {v.registeredAt ? new Date(v.registeredAt).toLocaleString("vi-VN") : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setSelected(v)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có phương tiện nào có lịch hẹn tại trạm của bạn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xem chi tiết */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Chi tiết xe</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Đóng"
              >
                ✖
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-gray-600 mb-1">VIN</label>
                <input readOnly value={selected.vin || "-"} className="border px-3 py-2 rounded w-full bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Model</label>
                <input readOnly value={selected.model || "-"} className="border px-3 py-2 rounded w-full bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Battery Type</label>
                <input readOnly value={selected.batteryType || "-"} className="border px-3 py-2 rounded w-full bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Owner ID</label>
                <input readOnly value={selected.ownerId ?? "-"} className="border px-3 py-2 rounded w-full bg-gray-100" />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Registered At</label>
                <input
                  readOnly
                  value={selected.registeredAt ? new Date(selected.registeredAt).toLocaleString("vi-VN") : "-"}
                  className="border px-3 py-2 rounded w-full bg-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * Nhân viên chỉ có quyền xem phương tiện có liên quan tới lịch hẹn tại trạm của mình.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffVehicleManagement;
