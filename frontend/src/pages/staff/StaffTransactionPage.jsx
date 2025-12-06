import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { 
  FiUser, FiCheckCircle, FiPackage, FiSearch, FiRefreshCw, 
  FiDatabase, FiTag, FiZap, FiDollarSign, FiCreditCard, FiStar, FiLoader, FiAlertTriangle, FiArrowDown
} from 'react-icons/fi';
import api from '../../services/api'; 

// Mock Bill Constants
const MOCK_BILL = { amount: 35000, message: "Phí đổi pin tiêu chuẩn", isSubscriptionCovered: false };
const MOCK_BILL_FREE = { amount: 0, message: "Trừ 1 lượt gói Tiêu Chuẩn", isSubscriptionCovered: true };

export default function WarehouseSwapProcess() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Data Objects
  const [appointment, setAppointment] = useState(null); 
  const [vehicleBattery, setVehicleBattery] = useState(null);
  const [inventory, setInventory] = useState([]); 

  // Process State
  const [inputSerial, setInputSerial] = useState("");
  const [selectedBattery, setSelectedBattery] = useState(null); 
  const [returnedBattery, setReturnedBattery] = useState(null); 
  
  // Payment & Rating
  const [paymentId, setPaymentId] = useState(null); // ID hóa đơn từ server
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [rating, setRating] = useState(5);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchInitialData = async () => {
        if (!id) { setInitLoading(false); return; }

        try {
            setInitLoading(true);

            // A. Appointment
            const appRes = await api.get(`/appointments/${id}`);
            const appData = appRes.data;
            setAppointment(appData);

            // B. Get Vehicle Battery
            try {
                const vehBatRes = await api.get(`/batteries/vehicle/${appData.vehicleId}`);
                setVehicleBattery(vehBatRes.data);
                if (vehBatRes.data && vehBatRes.data.id) {
                    setInputSerial(vehBatRes.data.id); 
                }
            } catch (e) {
                console.warn("Không tìm thấy thông tin pin trên xe.");
            }

            // C. Inventory
            try {
                const stockRes = await api.get(`/batteries/my-station/status/AVAILABLE`);
                setInventory(stockRes.data);
            } catch (e) {
                console.warn("Lỗi tải tồn kho.");
            }

            setStep(2);

        } catch (err) {
            console.error("Lỗi:", err);
            alert("Lỗi tải dữ liệu đơn hàng!");
            navigate('/station/appointments');
        } finally {
            setInitLoading(false);
        }
    };

    fetchInitialData();
  }, [id, navigate]);


  // --- CÁC HÀM XỬ LÝ ---

  // Bước 2: Nhập kho (Return)
  const handleReturnBattery = () => {
    if (!inputSerial) return alert("Serial pin trống!");
    
    if (vehicleBattery && inputSerial !== vehicleBattery.id) {
        if(!window.confirm(`Cảnh báo: Serial nhập vào (${inputSerial}) KHÁC với Serial trên hệ thống (${vehicleBattery.id}). Tiếp tục?`)) {
            return;
        }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 500);
  };

  // Bước 3: Xuất kho (Issue) - Auto Select
  const handleSelectBattery = () => {
    const bestBattery = [...inventory].sort((a, b) => b.currentLevel - a.currentLevel)[0];
    if (!bestBattery) return alert("Kho hết pin sẵn sàng!");
    
    setLoading(true);
    setTimeout(() => {
      setSelectedBattery(bestBattery);
      setLoading(false);
    }, 600);
  };

  // --- API 1: THỰC HIỆN ĐỔI PIN (EXECUTE) ---
  const confirmExportAndCreatePayment = async () => {
    setLoading(true);
    try {
        // Gọi API /swaps/execute
        const res = await api.post('/swaps/execute', {
            appointmentId: appointment.id,
            userId: appointment.customerId,
            stationId: appointment.stationId || 3, // Fallback nếu thiếu
            staffId: 1, // Lấy từ current user context
            oldBatteryId: inputSerial,
            newBatteryId: selectedBattery?.id, 
            paymentMethod: "CASH", // Tạm thời để CASH, bước sau user chọn lại
            amount: 35000 // Tạm tính
        });

        if (res.data && res.data.paymentId) {
            setPaymentId(res.data.paymentId);
            setInventory(prev => prev.filter(b => b.id !== selectedBattery.id));
            setStep(4);
        } else {
            alert("Lỗi: Không nhận được mã thanh toán!");
        }

    } catch (err) {
        console.error("Lỗi đổi pin:", err);
        alert("Giao dịch thất bại! Vui lòng kiểm tra lại.");
    } finally {
        setLoading(false);
    }
  };

  // --- API 2: XÁC NHẬN THANH TOÁN (CONFIRM) ---
  const handleConfirmPayment = async () => {
      if (!paymentId) return alert("Lỗi: Thiếu mã hóa đơn!");
      setLoading(true);
      
      try {
          // Gọi API /payments/confirm với method đã chọn (SUBSCRIPTION, CASH, BANK)
          await api.post('/payments/confirm', {
              paymentID: paymentId,
              method: paymentMethod 
          });

          setStep(5); // Thành công -> Đánh giá
      } catch (err) {
          console.error("Lỗi thanh toán:", err);
          alert(err.response?.data?.message || "Thanh toán thất bại!");
      } finally {
          setLoading(false);
      }
  };

  // Bước 5: Kết thúc
  const handleFinish = () => {
    navigate('/station/appointments');
  };

  // --- RENDER UI ---
  if (initLoading) return <div className="min-h-screen bg-[#0f1219] flex items-center justify-center text-white"><FiLoader className="animate-spin text-3xl"/></div>;

  return (
    <div className="min-h-screen bg-[#0f1219] text-gray-100 font-sans p-6 flex flex-col md:flex-row gap-6">
      
      {/* === CỘT TRÁI: WIZARD === */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-6">
            <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiPackage className="text-blue-500"/> Quy trình Đổi pin #{id}
            </h1>
            <div className="flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-0"></div>
                {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                        {step > s ? <FiCheckCircle /> : s}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1 uppercase font-bold tracking-wider">
                <span>Check-in</span><span>Nhập</span><span>Xuất</span><span>Thanh toán</span><span>Đánh giá</span>
            </div>
        </div>

        {/* Dynamic Action Area */}
        <div className="flex-1 bg-[#161b26] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[450px]">
            
            {/* STEP 1: CHECK-IN */}
            {step === 1 && <p>Đang tải dữ liệu...</p>}

            {/* STEP 2: NHẬP KHO */}
            {step === 2 && (
                <div className="w-full max-w-md animate-fade-in-up">
                    <h2 className="text-xl font-bold text-center mb-6">Thu hồi Pin cũ</h2>
                    {appointment && (
                        <div className="mb-6 bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.customerId}`} className="w-12 h-12 rounded-full bg-gray-800 object-cover" alt="avt"/>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">Khách hàng #{appointment.customerId}</h3>
                                {vehicleBattery ? (
                                    <div className="flex items-center gap-2 mt-1 text-green-400 bg-green-500/10 px-2 py-1 rounded w-fit text-xs font-bold border border-green-500/20">
                                        <FiZap /> Pin trên xe: {vehicleBattery.id}
                                    </div>
                                ) : (
                                    <div className="text-yellow-500 text-sm mt-1"><FiAlertTriangle className="inline"/> Không tìm thấy pin</div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="bg-[#0f1219] p-6 rounded-2xl border border-gray-700 mb-6 text-center">
                        <label className="text-xs text-gray-500 uppercase font-bold mb-2 block text-left">Serial Number</label>
                        <input 
                            type="text" 
                            value={inputSerial}
                            onChange={(e) => setInputSerial(e.target.value.toUpperCase())}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 text-center font-mono text-lg uppercase"
                        />
                        {vehicleBattery && (
                            <div className="flex justify-center mt-3 text-blue-500 text-xs items-center gap-1">
                                <FiArrowDown /> <span>Đã khớp với dữ liệu xe</span>
                            </div>
                        )}
                    </div>
                    <button onClick={handleReturnBattery} disabled={loading || !inputSerial} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                        {loading ? <FiLoader className="animate-spin"/> : <><FiDatabase /> Xác nhận & Nhập kho</>}
                    </button>
                </div>
            )}

            {/* STEP 3: XUẤT KHO */}
            {step === 3 && (
                <div className="w-full max-w-md animate-fade-in-up text-center">
                    <h2 className="text-xl font-bold mb-2">Xuất kho Pin mới</h2>
                    {!selectedBattery ? (
                        <button onClick={handleSelectBattery} disabled={loading} className="w-full py-12 border-2 border-dashed border-green-500/50 rounded-2xl bg-green-500/5 hover:bg-green-500/10 text-green-400 font-bold flex flex-col items-center justify-center gap-2 transition-all mt-4">
                            {loading ? <FiRefreshCw className="animate-spin w-8 h-8"/> : <FiZap className="w-8 h-8"/>}
                            <span>Lấy pin tốt nhất từ kho</span>
                        </button>
                    ) : (
                        <div className="space-y-6 mt-4">
                            <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                                <p className="text-green-500 text-sm uppercase font-bold mb-1">Pin đề xuất</p>
                                <h1 className="text-4xl font-bold text-white mb-2">{selectedBattery.id}</h1>
                                <div className="flex justify-center gap-2">
                                    <span className="bg-green-600 text-white px-2 py-0.5 rounded font-bold text-sm">Level: {selectedBattery.currentLevel}%</span>
                                </div>
                            </div>
                            <button onClick={confirmExportAndCreatePayment} className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold shadow-lg animate-bounce">
                                {loading ? "Đang xử lý..." : "Xác nhận Lắp đặt"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 4: THANH TOÁN (CÓ CHỌN GÓI CƯỚC) */}
            {step === 4 && (
                <div className="w-full max-w-md animate-fade-in-up">
                    <h2 className="text-xl font-bold text-center mb-6">Thanh toán</h2>
                    
                    <div className="space-y-4">
                        {/* Option 1: Gói Thuê Bao (Subscription) */}
                        <button 
                            onClick={() => setPaymentMethod('SUBSCRIPTION')}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${paymentMethod === 'SUBSCRIPTION' ? 'border-green-500 bg-green-900/20 text-green-400' : 'border-gray-700 hover:bg-gray-800'}`}
                        >
                            <span className="flex items-center gap-2 font-bold"><FiCheckCircle/> Gói Thuê Bao (Miễn phí)</span>
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold border border-green-500/30">Ưu tiên</span>
                        </button>

                        {/* Option 2: Trả tiền lẻ */}
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setPaymentMethod('CASH')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CASH' ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                                <FiDollarSign size={24}/> <span className="text-xs font-bold">TIỀN MẶT</span>
                            </button>
                            <button onClick={() => setPaymentMethod('BANK')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'BANK' ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                                <FiCreditCard size={24}/> <span className="text-xs font-bold">CHUYỂN KHOẢN</span>
                            </button>
                        </div>

                        {/* Hiển thị số tiền nếu không chọn Subscription */}
                        {paymentMethod !== 'SUBSCRIPTION' && (
                            <div className="bg-[#0f1219] p-4 rounded-lg text-center border border-gray-700 mt-4">
                                <p className="text-gray-400 text-xs uppercase font-bold">Số tiền phải thu</p>
                                <p className="text-2xl font-bold text-white mt-1">35.000 đ</p>
                            </div>
                        )}

                        <button onClick={handleConfirmPayment} className={`w-full py-4 rounded-xl font-bold shadow-lg mt-4 ${paymentMethod === 'SUBSCRIPTION' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            {loading ? "Đang xử lý..." : paymentMethod === 'SUBSCRIPTION' ? "Xác nhận Trừ lượt" : "Xác nhận Thanh toán"}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 5: ĐÁNH GIÁ (DONE) */}
            {step === 5 && (
                <div className="w-full max-w-md text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thành công!</h2>
                    <p className="text-gray-400 mb-8 text-sm">Giao dịch hoàn tất. Cảm ơn quý khách.</p>
                    <button onClick={handleFinish} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-gray-200">
                        Về màn hình chính
                    </button>
                </div>
            )}

        </div>
      </div>

      {/* === CỘT PHẢI: KHO HÀNG === */}
      <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-[#161b26] border border-gray-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                  <h3 className="font-bold text-gray-300 text-sm uppercase flex items-center gap-2"><FiDatabase /> Pin Khả Dụng</h3>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{inventory.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {inventory.length > 0 ? inventory.map((bat, idx) => (
                      <div key={idx} className="bg-[#0f1219] p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                          <div>
                              <span className="font-mono text-sm font-bold text-white block">{bat.id}</span>
                              <span className="text-[10px] px-1 rounded text-green-500 bg-green-500/10">READY</span>
                          </div>
                          <div className={`font-bold ${bat.currentLevel >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>{bat.currentLevel}%</div>
                      </div>
                  )) : <p className="text-center text-gray-500 text-xs py-4">Kho hết pin READY</p>}
              </div>
          </div>
      </div>
    </div>
  );
}