import { useState, useEffect } from "react";

export default function UserLocation() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => setError("Không thể lấy tọa độ. Hãy bật GPS / cho phép quyền.")
    );
  }, []);

  return (
    <div>
      <h3>📍 Vị trí người dùng</h3>
      {error && <p>{error}</p>}
      {coords.lat && coords.lng ? (
        <p>Lat: {coords.lat}<br/>Lng: {coords.lng}</p>
      ) : (
        <p>Đang lấy vị trí...</p>
      )}
    </div>
  );
}
