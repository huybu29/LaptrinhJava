import React, { useContext, useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaHistory,
  FaHeadset,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

// === DỮ LIỆU THÔNG BÁO GIẢ (MOCK) ===
// (Trong thực tế, bạn sẽ fetch API này)
const mockNotifications = [
  { id: 1, text: "Giao dịch #12345 tại Vincom đã hoàn tất.", time: "5 phút trước" },
  { id: 2, text: "Gói thuê bao của bạn sẽ hết hạn vào 30/11/2025.", time: "1 giờ trước" },
  { id: 3, text: "Chào mừng bạn đến với EVM!", time: "1 ngày trước" },
];

const CustomerLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // === STATE MỚI ĐỂ QUẢN LÝ DROPDOWN ===
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null); // Để xử lý click ra ngoài

  // === XỬ LÝ CLICK RA NGOÀI ===
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    // Lắng nghe sự kiện mousedown
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // Component item trong sidebar (Giữ nguyên)
  const SidebarItem = ({ icon, label, onClick, danger, badge }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition
        ${danger
          ? "text-red-400 hover:bg-red-900/20"
          : "text-gray-200 hover:bg-gray-800"
        }`}
    >
      <span className="mr-3 text-[#00B4D8] text-lg">{icon}</span>
      {label}
      {badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="text-2xl font-extrabold text-[#00B4D8] mb-6 text-center">
            EVM
          </div>

          {/* === KHỐI THÔNG TIN USER (ĐÃ CẬP NHẬT) === */}
          <div className="flex items-start justify-between mb-10 px-2">
            
            {/* Thông tin trái: Avatar & Tên */}
            <div className="flex items-center space-x-4">
              <img
                src="https://i.pravatar.cc/80"
                alt="avatar"
                className="w-14 h-14 rounded-full"
              />
              <div className="flex flex-col">
                <h2 className="text-base font-semibold">
                  {user?.fullName ? user.fullName : user?.username}
                </h2>
                <p className="text-xs text-gray-400">
                  {user?.email ?? "Chưa có email"}
                </p>
                <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-gray-800 text-[#00B4D8] w-max">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Thông tin phải: Nút chuông (MỚI) */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 text-gray-400 hover:text-white relative"
              >
                <FaBell size={18} />
                {/* Số thông báo (badge) */}
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              </button>

              {/* Dropdown thông báo (MỚI) */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-700">
                  <div className="p-3 border-b border-gray-700">
                    <h4 className="font-semibold text-white">Thông báo</h4>
                  </div>
                  <div className="flex flex-col max-h-80 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 cursor-pointer"
                      >
                        <p className="text-sm text-gray-200">{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                    {mockNotifications.length === 0 && (
                      <p className="text-gray-400 text-center p-4">
                        Không có thông báo mới.
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-gray-900 text-center rounded-b-lg">
                    <button
                      onClick={() => {
                        navigate("/driver/notifications");
                        setShowNotifications(false);
                      }}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Xem tất cả
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MENU theo ROLE */}
          <nav className="space-y-2">
            {/* ROLE_DRIVER */}
            {user?.role === "ROLE_CUSTOMER" && (
              <>
                <SidebarItem
                  icon={<FaTachometerAlt />}
                  label="Dashboard"
                  onClick={() => navigate("/driver/dashboard")}
                />
                <SidebarItem
                  icon={<FaCalendarAlt />}
                  label="Đặt lịch"
                  onClick={() => navigate("/driver/booking")}
                />
                <SidebarItem
                  icon={<FaHistory />}
                  label="Lịch sử giao dịch"
                  onClick={() => navigate("/driver/payment")}
                />
                {/* ❌ ĐÃ XÓA: Mục "Thông báo" ở đây */}
                <SidebarItem
                  icon={<FaHeadset />}
                  label="Hỗ trợ"
                  onClick={() => navigate("/driver/support-center")}
                />
              </>
            )}

            {/* ROLE_STAFF (Giữ nguyên) */}
            {user?.role === "ROLE_STAFF" && (
              <>
                {/* ... */}
              </>
            )}

            {/* ROLE_ADMIN (Giữ nguyên) */}
            {user?.role === "ROLE_ADMIN" && (
              <>
                {/* ... */}
              </>
            )}
          </nav>
        </div>

        {/* LOGOUT (Giữ nguyên) */}
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Đăng xuất"
          danger
          onClick={() => {
            logout();
            navigate("/login");
          }}
        />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 space-y-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;