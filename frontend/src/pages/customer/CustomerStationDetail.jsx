import React from 'react';
import { 
  FiMapPin, 
  FiNavigation, 
  FiClock, 
  FiPhone, 
  FiBatteryCharging, 
  FiStar, 
  FiShare2, 
  FiInfo,
  FiWifi,
  FiCoffee,
  FiTool
} from 'react-icons/fi';

export default function StationDetail() {
  // Dữ liệu giả lập của một trạm
  const station = {
    name: "Trạm Đổi Pin - Vincom Landmark 81",
    address: "720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM",
    status: "open", // 'open' | 'closed' | 'maintenance'
    rating: 4.8,
    reviews: 124,
    distance: "1.2 km",
    openTime: "06:00 - 22:00",
    phone: "1900 1234",
    batteryStatus: {
      available: 8,      // Số pin đầy sẵn sàng
      total: 20,         // Tổng sức chứa
      emptySlots: 5,     // Số khe trống để nhét pin cũ vào
      charging: 7        // Số pin đang sạc
    },
    amenities: [
      { name: 'Wifi miễn phí', icon: <FiWifi /> },
      { name: 'Khu vực chờ & Cafe', icon: <FiCoffee /> },
      { name: 'Dụng cụ sửa xe cơ bản', icon: <FiTool /> }
    ],
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=300"
    ]
  };

  // Tính phần trăm thanh progress
  const batteryPercentage = (station.batteryStatus.available / station.batteryStatus.total) * 100;

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb & Actions */}
        <div className="flex justify-between items-center mb-6">
          <button className="text-gray-400 hover:text-white text-sm">
            &larr; Quay lại bản đồ
          </button>
          <div className="flex gap-3">
             <button className="p-2 rounded-full bg-[#161b26] border border-gray-700 hover:bg-[#2d3342] text-gray-300">
                <FiShare2 className="w-5 h-5" />
             </button>
             <button className="p-2 rounded-full bg-[#161b26] border border-gray-700 hover:bg-[#2d3342] text-gray-300">
                <FiInfo className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Gallery Images */}
            <div className="grid grid-cols-3 grid-rows-2 gap-2 h-80 rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 relative group">
                <img 
                  src={station.images[0]} 
                  alt="Main Station" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                   ĐANG MỞ CỬA
                </div>
              </div>
              <div className="col-span-1 row-span-1">
                 <img src={station.images[1]} alt="Sub 1" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 row-span-1">
                 <img src={station.images[2]} alt="Sub 2" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Basic Info Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{station.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1 text-yellow-400">
                  <FiStar className="fill-current" />
                  <span className="font-bold text-white">{station.rating}</span>
                  <span className="text-gray-500">({station.reviews} đánh giá)</span>
                </div>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{station.distance} từ vị trí của bạn</span>
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Details List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Thông tin chi tiết</h3>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#161b26] rounded-lg text-gray-400 mt-1">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-200 font-medium">Địa chỉ</p>
                  <p className="text-gray-400 text-sm">{station.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#161b26] rounded-lg text-gray-400 mt-1">
                  <FiClock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-200 font-medium">Giờ hoạt động</p>
                  <p className="text-green-400 text-sm font-medium">{station.openTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#161b26] rounded-lg text-gray-400 mt-1">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-200 font-medium">Liên hệ</p>
                  <p className="text-gray-400 text-sm">{station.phone}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Tiện ích tại trạm</h3>
                <div className="flex gap-4">
                    {station.amenities.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-[#161b26] border border-gray-800 rounded-xl min-w-[100px]">
                            <div className="text-blue-400 text-xl">
                                {item.icon}
                            </div>
                            <span className="text-xs text-gray-300 text-center">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Battery Status & Actions (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Battery Status Card - Main Highlight */}
              <div className="bg-[#161b26] border border-gray-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <FiBatteryCharging className="text-green-500" />
                    Trạng thái Pin
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0f1219] p-4 rounded-xl border border-gray-800 text-center">
                        <span className="block text-3xl font-bold text-green-500 mb-1">{station.batteryStatus.available}</span>
                        <span className="text-xs text-gray-400 uppercase font-semibold">Pin khả dụng</span>
                    </div>
                    <div className="bg-[#0f1219] p-4 rounded-xl border border-gray-800 text-center">
                        <span className="block text-3xl font-bold text-gray-300 mb-1">{station.batteryStatus.emptySlots}</span>
                        <span className="text-xs text-gray-400 uppercase font-semibold">Cổng trống</span>
                    </div>
                </div>

                {/* Battery Level Visual */}
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Lượng pin dự trữ</span>
                        <span>{station.batteryStatus.available} / {station.batteryStatus.total}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <div 
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${batteryPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 italic">
                        * {station.batteryStatus.charging} pin đang sạc (dự kiến đầy trong 15p)
                    </p>
                </div>

                {/* Primary Action */}
                <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 mb-3">
                    Đặt giữ Pin (15p)
                </button>
                <p className="text-xs text-center text-gray-500">Giữ chỗ miễn phí trong 15 phút đầu tiên</p>
              </div>

              {/* Navigation Action */}
              <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-1">
                 <button className="w-full py-3 hover:bg-[#2d3342] text-gray-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                    <FiNavigation className="w-4 h-4" />
                    Chỉ đường đến trạm
                 </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}