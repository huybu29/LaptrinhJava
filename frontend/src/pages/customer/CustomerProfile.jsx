import React from 'react';
// Import các icon từ bộ Feather Icons (fi) của react-icons vì nét mảnh, hiện đại
import { FiCamera, FiUser, FiMail, FiPhone, FiLock, FiShield } from 'react-icons/fi';

export default function PersonalProfile() {
  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-400">Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-[#161b26] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          
          {/* Top Section: Avatar & Basic Info */}
          <div className="p-8 border-b border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group cursor-pointer">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover bg-white group-hover:opacity-80 transition-opacity"
                />
                {/* Overlay icon khi hover vào ảnh */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="text-gray-800 w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Trần Văn An</h3>
                <p className="text-gray-400">tvan.drive@email.com</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2d3342] hover:bg-[#374151] text-sm font-medium rounded-md text-gray-200 transition-colors border border-gray-700">
              <FiCamera className="w-4 h-4" />
              <span>Tải ảnh lên</span>
            </button>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Thông tin cá nhân</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Input with Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Họ và Tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-500 w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="Trần Văn An"
                    className="w-full bg-[#262c3a] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Email Input with Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-500 w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    defaultValue="tvan.drive@email.com"
                    className="w-full bg-[#262c3a] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Phone Input with Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-500 w-5 h-5" />
                  </div>
                  <input 
                    type="tel" 
                    defaultValue="0901234567"
                    className="w-full bg-[#262c3a] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-[#161b26] border-t border-gray-800 flex justify-end gap-3 rounded-b-xl">
            <button className="px-5 py-2 rounded-lg bg-[#2d3342] hover:bg-[#374151] text-gray-200 font-medium text-sm transition-colors border border-gray-700">
              Hủy
            </button>
            <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-900/20">
              Lưu thay đổi
            </button>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-[#161b26] border border-gray-800 rounded-xl p-8">
          <div className="mb-6 flex items-center gap-2">
            <FiShield className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Bảo mật</h3>
              <p className="text-gray-400 text-sm">Quản lý mật khẩu và các tùy chọn bảo mật khác.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#11141d] rounded-lg border border-gray-800/50">
            <div className="flex items-start gap-4">
               <div className="p-2 bg-[#1f2937] rounded-lg text-gray-400 mt-1">
                 <FiLock className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-semibold text-gray-200">Mật khẩu</h4>
                  <p className="text-sm text-gray-500 mt-1">Cập nhật lần cuối: 2 tháng trước</p>
               </div>
            </div>
            <button className="px-4 py-2 bg-[#2d3342] hover:bg-[#374151] text-sm font-medium rounded-md text-gray-200 transition-colors border border-gray-700 whitespace-nowrap">
              Đổi mật khẩu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}