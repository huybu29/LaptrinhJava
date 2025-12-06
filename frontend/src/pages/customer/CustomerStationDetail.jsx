import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import api from '../../services/api'; 
import { 
  FiMapPin, FiNavigation, FiClock, FiPhone, 
  FiBatteryCharging, FiStar, FiShare2, FiInfo,
  FiWifi, FiCoffee, FiLoader, FiAlertCircle, FiUser, FiMessageSquare
} from 'react-icons/fi';

export default function StationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [station, setStation] = useState(null);
  const [availableBatteries, setAvailableBatteries] = useState(0);
  
  // State cho Review
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchStationData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Gọi song song 4 API (Thông tin trạm, Pin, List Review, Điểm TB)
        const [stationRes, batteryRes, reviewsRes, avgRes] = await Promise.all([
            api.get(`/stations/${id}`),
            api.get(`/batteries/station/${id}/available/count`),
            api.get(`/reviews/station/${id}`),
            api.get(`/reviews/station/${id}/average`)
        ]);

        setStation(stationRes.data);
        setAvailableBatteries(batteryRes.data);
        
        // Xử lý dữ liệu Review
        // Sắp xếp review mới nhất lên đầu
        const sortedReviews = reviewsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sortedReviews);
        
        // Xử lý điểm trung bình (làm tròn 1 chữ số thập phân)
        const average = avgRes.data || 0;
        setAvgRating(parseFloat(average.toFixed(1)));

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không tìm thấy thông tin trạm hoặc kết nối lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchStationData();
  }, [id]);

  const handleBookStation = () => {
      navigate(`/driver/booking/${station.id}`);
  };

  // Helper render sao
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
        <FiStar 
            key={index} 
            className={`w-4 h-4 ${index < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
        />
    ));
  };

  if (loading) return (
      <div className="min-h-screen bg-[#0f1219] flex justify-center items-center text-white">
          <FiLoader className="animate-spin text-3xl text-blue-500" />
      </div>
  );

  if (error || !station) return (
      <div className="min-h-screen bg-[#0f1219] flex justify-center items-center text-red-400 gap-2">
          <FiAlertCircle /> {error || "Không tìm thấy trạm."}
      </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb & Actions */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm">
            &larr; Quay lại
          </button>
          <div className="flex gap-3">
             <button className="p-2 rounded-full bg-[#161b26] border border-gray-700 hover:bg-[#2d3342] text-gray-300"><FiShare2 /></button>
             <button className="p-2 rounded-full bg-[#161b26] border border-gray-700 hover:bg-[#2d3342] text-gray-300"><FiInfo /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Images & Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery */}
            <div className="grid grid-cols-3 grid-rows-2 gap-2 h-80 rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 relative group">
                <img 
                  src={station.imageUrl || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000"} 
                  alt={station.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                   {station.status === 'ACTIVE' ? 'ĐANG MỞ CỬA' : 'BẢO TRÌ'}
                </div>
              </div>
              <div className="col-span-1 row-span-1 bg-gray-800"></div>
              <div className="col-span-1 row-span-1 bg-gray-800"></div>
            </div>

            {/* Station Header & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{station.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {/* HIỂN THỊ ĐIỂM TRUNG BÌNH TỪ API */}
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                  <FiStar className="fill-current" />
                  <span className="font-bold text-white">{avgRating}</span>
                  <span className="text-gray-500 text-xs ml-1">({reviews.length} đánh giá)</span>
                </div>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{station.address}</span>
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Details List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Thông tin chi tiết</h3>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#161b26] rounded-lg text-gray-400 mt-1"><FiMapPin /></div>
                <div><p className="text-gray-200 font-medium">Địa chỉ</p><p className="text-gray-400 text-sm">{station.address}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#161b26] rounded-lg text-gray-400 mt-1"><FiClock /></div>
                <div><p className="text-gray-200 font-medium">Giờ hoạt động</p><p className="text-green-400 text-sm font-medium">{station.operatingHours || "06:00 - 22:00"}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#161b26] rounded-lg text-gray-400 mt-1"><FiPhone /></div>
                <div><p className="text-gray-200 font-medium">Liên hệ</p><p className="text-gray-400 text-sm">{station.contactPhone || "1900 1234"}</p></div>
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Tiện ích</h3>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2 p-4 bg-[#161b26] border border-gray-800 rounded-xl min-w-[100px]">
                        <div className="text-blue-400 text-xl"><FiWifi /></div>
                        <span className="text-xs text-gray-300">Wifi</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-[#161b26] border border-gray-800 rounded-xl min-w-[100px]">
                        <div className="text-blue-400 text-xl"><FiCoffee /></div>
                        <span className="text-xs text-gray-300">Cafe</span>
                    </div>
                </div>
            </div>

            {/* --- PHẦN DANH SÁCH ĐÁNH GIÁ (MỚI THÊM) --- */}
            <div className="pt-8 border-t border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiMessageSquare className="text-blue-500"/> Đánh giá từ khách hàng
                    </h3>
                    <span className="text-gray-400 text-sm">{reviews.length} lượt nhận xét</span>
                </div>

                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-[#161b26] p-5 rounded-2xl border border-gray-800">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar ngẫu nhiên theo userId */}
                                        <img 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`} 
                                            alt="User Avatar" 
                                            className="w-10 h-10 rounded-full bg-gray-700"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-white">Khách hàng #{review.userId}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 gap-0.5">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                                    {review.comment || ""}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-[#161b26] rounded-xl border border-gray-800 border-dashed">
                            <p className="text-gray-500">Chưa có đánh giá nào cho trạm này.</p>
                        </div>
                    )}
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Battery Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-[#161b26] border border-gray-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <FiBatteryCharging className="text-green-500" /> Trạng thái Pin
                </h3>
                <div className="bg-[#0f1219] p-4 rounded-xl border border-gray-800 text-center mb-6">
                    <span className="block text-3xl font-bold text-green-500 mb-1">{availableBatteries}</span>
                    <span className="text-xs text-gray-400 uppercase font-semibold">Pin khả dụng</span>
                </div>
                <button 
                    onClick={handleBookStation}
                    disabled={availableBatteries === 0}
                    className={`w-full py-3.5 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mb-3 ${
                        availableBatteries > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {availableBatteries > 0 ? "Đặt lịch đổi pin" : "Hết pin khả dụng"}
                </button>
              </div>
              <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-1">
                 <button className="w-full py-3 hover:bg-[#2d3342] text-gray-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                    <FiNavigation className="w-4 h-4" /> Chỉ đường
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}