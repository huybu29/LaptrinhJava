import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api'; 
import { AuthContext } from '../../services/AuthContext'; 
import { FiSearch, FiCheck } from "react-icons/fi";
import { HiOutlineDeviceMobile, HiOutlineCreditCard, HiOutlineCash, HiOutlineQrcode } from 'react-icons/hi';
import { IoArrowBackOutline } from 'react-icons/io5';

// =========================================================
// === HELPER: Định dạng tiền tệ ===
const currencyFormatter = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// =========================================================
// === COMPONENT CHỈ BÁO BƯỚC ===
const StepIndicator = ({ currentStep, totalSteps, stepNames }) => (
    <div className="flex justify-center mb-8">
        {stepNames.map((name, index) => (
            <div key={index} className={`flex items-center ${index < totalSteps - 1 ? 'w-1/3' : 'w-auto'}`}>
                <div className={`flex flex-col items-center z-10 ${currentStep >= index + 1 ? 'text-blue-400' : 'text-gray-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 shadow-lg ${currentStep > index + 1 ? 'bg-blue-600 text-white' : currentStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        {currentStep > index + 1 ? <FiCheck size={16} /> : index + 1}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center ${currentStep >= index + 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                        {name}
                    </span>
                </div>
                {index < totalSteps - 1 && (
                    <div className={`flex-1 h-0.5 -ml-1 ${currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                )}
            </div>
        ))}
    </div>
);

// =========================================================
// === BƯỚC 1: KIỂM TRA PIN TRẢ ===
const CheckReturnedBattery = ({ appointment, onNext, onCancel }) => {
    const [formData, setFormData] = useState({
        remainingCapacity: '50',
        status: 'Bình thường',
        physicalDamage: ['Không có'],
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.remainingCapacity || Number(formData.remainingCapacity) < 0 || Number(formData.remainingCapacity) > 100) {
            alert('Vui lòng nhập dung lượng pin còn lại hợp lệ (0-100%).');
            return;
        }
        onNext({
            batteryCode: appointment.oldBatteryCode,
            remainingCapacity: Number(formData.remainingCapacity),
            status: formData.status,
            physicalDamage: formData.physicalDamage.length > 0 ? formData.physicalDamage : ['Không có'],
            notes: formData.notes
        });
    };

    if (!appointment) return <div className="text-center py-20 text-gray-400">Đang tải thông tin cuộc hẹn...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Kiểm tra Pin Trả ({appointment.oldBatteryCode})</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cột trái */}
                <div className="space-y-6">
                    <p className="text-gray-400 font-medium border-b border-gray-700 pb-3 mb-3">THÔNG TIN KIỂM TRA</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Dung lượng còn lại (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.remainingCapacity}
                            onChange={(e) => setFormData({ ...formData, remainingCapacity: e.target.value })}
                            placeholder="Nhập dung lượng từ 0-100"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-gray-300 mb-2">Tình trạng ngoại quan</p>
                        <div className="flex gap-4 flex-wrap">
                            {['Bình thường', 'Trầy xước nhẹ', 'Móp méo', 'Nứt vỡ'].map(status => (
                                <label key={status} className="flex items-center text-sm text-gray-300">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={formData.status === status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="form-radio text-blue-500 bg-gray-600 border-gray-500"
                                    />
                                    <span className="ml-2">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-gray-300 mb-2">Phát hiện lỗi vật lý</p>
                        <div className="grid grid-cols-2 gap-3">
                            {['Lỗi cổng sạc', 'Rò rỉ dung dịch', 'Phồng pin', 'Không có'].map(error => (
                                <label key={error} className="flex items-center text-sm text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="error"
                                        value={error}
                                        checked={formData.physicalDamage.includes(error)}
                                        onChange={(e) => {
                                            let newErrors;
                                            if (e.target.value === 'Không có' && e.target.checked) {
                                                newErrors = ['Không có'];
                                            } else if (e.target.value === 'Không có' && !e.target.checked) {
                                                newErrors = formData.physicalDamage.filter(err => err !== 'Không có');
                                            } else {
                                                newErrors = e.target.checked
                                                    ? [...formData.physicalDamage.filter(err => err !== 'Không có'), error]
                                                    : formData.physicalDamage.filter(err => err !== error);
                                            }
                                            setFormData({ ...formData, physicalDamage: newErrors });
                                        }}
                                        className="form-checkbox text-blue-500 bg-gray-600 border-gray-500 rounded"
                                    />
                                    <span className="ml-2">{error}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Ghi chú</label>
                        <textarea
                            rows="3"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Mô tả chi tiết các vấn đề nếu có..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                    </div>
                </div>
                {/* Cột phải */}
                <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 space-y-4">
                    <p className="text-white font-bold mb-3">Thông tin Pin Khách hàng</p>
                    <p className="text-gray-300">Mã Pin: <span className="float-right text-white font-medium">{appointment.oldBatteryCode}</span></p>
                    <p className="text-gray-300">ID Pin (giả định): <span className="float-right text-white font-medium">BSS-LFP-2023-0188</span></p>
                    <p className="text-white font-bold pt-4 border-t border-gray-600 mt-4">Thông tin Khách hàng</p>
                    <p className="text-gray-300">Mã KH: <span className="float-right text-white font-medium">{appointment.customerId}</span></p>
                    <p className="text-gray-300">Tên KH: <span className="float-right text-white font-medium">{appointment.customerName}</span></p>
                    <div className="border-2 border-dashed border-gray-600 p-8 text-center rounded-lg text-gray-500 mt-4">
                        Tải ảnh minh chứng (Không bắt buộc)
                    </div>
                </div>
                <div className="lg:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-700">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition">Hủy</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Xác nhận & Tiếp tục</button>
                </div>
            </form>
        </div>
    );
};

// =========================================================
// === BƯỚC 2: XÁC NHẬN PIN MỚI ===
const ConfirmBatterySwap = ({ appointment, onNext, onBack, stationId }) => {
    const [availableBatteries, setAvailableBatteries] = useState([]);
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { appointmentId } = useParams();
    useEffect(() => {
        const fetchBatteries = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/batteries/station/${stationId}/all`);
                setAvailableBatteries(res.data);
                
                if (res.data && res.data.length > 0) setSelectedBattery(res.data[0]);
            } catch (err) {
                console.error(err);
                alert('Không thể tải danh sách pin khả dụng.');
            } finally { setLoading(false); }
        };
        if (stationId) fetchBatteries();
    }, [stationId]);

    const filteredBatteries = availableBatteries.filter(b =>
        b.batteryCode.toLowerCase().includes(search.toLowerCase()) || b.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = () => {
        if (!selectedBattery) {
            alert('Vui lòng chọn pin để đổi.');
            return;
        }
        onNext(selectedBattery);
    };

    if (loading) return <div className="text-center py-20 text-blue-400">Đang tải pin...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Xác nhận Pin mới</h2>
            <div className="grid grid-cols-2 gap-4 bg-gray-700 p-5 rounded-xl mb-6">
                <div><p className="text-sm text-gray-400">Mã khách hàng</p><p className="text-white font-medium">{appointment.customerId}</p></div>
                <div><p className="text-sm text-gray-400">Mã pin cũ</p><p className="text-white font-medium">{appointment.oldBatteryCode}</p></div>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm pin..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredBatteries.map(b => (
                    <div
                        key={b.id}
                        onClick={() => setSelectedBattery(b)}
                        className={`bg-gray-700 p-4 rounded-xl border-2 cursor-pointer transition ${selectedBattery?.id === b.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-600 hover:border-blue-600/50'}`}
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-white font-bold">{b.batteryCode}</p>
                            <span className="text-green-400 font-semibold flex items-center gap-1">
                               SOH: {b.soh}%
                            </span>
                        </div>
                        
                    </div>
                ))}
            </div>

            <div className="flex justify-between gap-4 pt-6 border-t border-gray-700 mt-6">
                <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                    <IoArrowBackOutline size={18} /> Quay lại
                </button>
                <button onClick={handleSubmit} className={`px-6 py-2 rounded-lg text-white font-semibold transition ${!selectedBattery ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    Xác nhận đổi pin
                </button>
            </div>
        </div>
    );
};

// =========================================================
// === BƯỚC 3: THANH TOÁN ===
const ProcessPayment = ({ appointment, swapData, onComplete, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const totalAmount = (appointment?.baseSwapFee || 0) + (appointment?.overdueFee || 0);
    const [amountReceived, setAmountReceived] = useState(totalAmount);
    const change = amountReceived > totalAmount ? amountReceived - totalAmount : 0;

    const paymentMethods = [
        { name: 'Tiền mặt', icon: HiOutlineCash, value: 'CASH' },
        { name: 'Mã QR', icon: HiOutlineQrcode, value: 'QR' },
        { name: 'Chuyển khoản', icon: HiOutlineDeviceMobile, value: 'TRANSFER' },
        { name: 'Thẻ', icon: HiOutlineCreditCard, value: 'CARD' },
    ];

    const handlePaymentConfirm = () => {
        if (paymentMethod === 'CASH' && amountReceived < totalAmount) {
            alert('Số tiền khách đưa không đủ.');
            return;
        }
        const paymentDetails = {
            amount: totalAmount,
            method: paymentMethod,
            receivedAmount: paymentMethod === 'CASH' ? amountReceived : totalAmount,
            status: 'COMPLETED',
        };
        onComplete(paymentDetails);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Thanh toán cho đơn hàng #{appointment.id}</h1>
                <span className="text-sm text-yellow-400 font-medium bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-700/50">Chờ thanh toán</span>
            </div>
            <p className="text-gray-400 mb-8">Vui lòng xác nhận thông tin và chọn phương thức thanh toán.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thông tin đơn hàng */}
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-white">Thông tin đơn hàng</h3>
                        <div className="space-y-3">
                            <p className="text-gray-300">Khách hàng: <span className="float-right text-white font-medium">{appointment.customerName}</span></p>
                            <p className="text-gray-300">Pin mới đổi: <span className="float-right text-blue-400 font-bold">{swapData.newBattery.code}</span></p>
                            <p className="text-gray-300">Pin cũ nhận: <span className="float-right text-white font-medium">{appointment.oldBatteryCode} (SOC: {swapData.inspection.remainingCapacity}%)</span></p>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-white">Chi tiết thanh toán</h3>
                        <div className="space-y-3 text-gray-300">
                            <p>Phí đổi pin: <span className="float-right">{currencyFormatter(appointment.baseSwapFee)}</span></p>
                            <p className="text-red-400">Phí thuê pin quá hạn: <span className="float-right">{currencyFormatter(appointment.overdueFee)}</span></p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-gray-700 flex justify-between items-center">
                            <p className="text-2xl font-bold text-white">Tổng tiền</p>
                            <p className="text-3xl font-bold text-blue-400">{currencyFormatter(totalAmount)}</p>
                        </div>
                    </div>
                </div>

                {/* Chọn phương thức thanh toán */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-white">Phương thức thanh toán</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map(method => {
                            const Icon = method.icon;
                            return (
                                <button
                                    key={method.value}
                                    onClick={() => setPaymentMethod(method.value)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${paymentMethod === method.value ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-600 text-gray-300 hover:border-blue-500'}`}
                                >
                                    <Icon size={22} /> {method.name}
                                </button>
                            );
                        })}
                    </div>

                    {paymentMethod === 'CASH' && (
                        <div className="mt-4">
                            <label className="block text-sm text-gray-300 mb-1">Khách đưa:</label>
                            <input
                                type="number"
  value={isNaN(amountReceived) ? totalAmount : amountReceived}
  min={totalAmount}
  onChange={e => setAmountReceived(Number(e.target.value) || totalAmount)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-gray-400 mt-2">Tiền thừa: <span className="text-green-400 font-semibold">{currencyFormatter(change)}</span></p>
                        </div>
                    )}

                    <div className="flex justify-between mt-6 border-t border-gray-700 pt-6">
                        <button onClick={onBack} className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition">Quay lại</button>
                        <button onClick={handlePaymentConfirm} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Hoàn tất thanh toán</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =========================================================
// === SWAP PROCESS MANAGER ===
const SwapProcessManager = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const { user } = useContext(AuthContext);

    const [appointment, setAppointment] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [inspectionData, setInspectionData] = useState(null);
    const [swapBatteryData, setSwapBatteryData] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await api.get(`/appointments/${appointmentId}`);
                setAppointment(res.data);
                console.log(res.data)
            } catch (err) {
                console.error(err);
                alert('Không thể tải thông tin cuộc hẹn.');
            }
        };
        fetchAppointment();
    }, [appointmentId]);

    const handleCancel = () => navigate('/appointments');

    const handleNextStep1 = async (inspection) => {
        setInspectionData(inspection);
        // Cập nhật trạng thái pin trả về backend
        try {
            await api.put(`/appointments/${appointmentId}`, { status: 'IN_PROGRESS', inspection });
        } catch (err) { console.error(err); }
        setCurrentStep(2);
    };

    const handleNextStep2 = async (selectedBattery) => {
        setSwapBatteryData({ newBattery: selectedBattery });
        setCurrentStep(3);
    };

    const handleCompletePayment = async (paymentDetails) => {
        try {
            // Gọi API hoàn tất swap
            await api.post(`/battery-swaps/complete-transaction`, {
                appointmentId,
                inspection: inspectionData,
                newBatteryId: swapBatteryData.newBattery.id,
                paymentDetails,
                staffId: user.id
            });
            alert('Đổi pin thành công!');
            navigate('/appointments');
        } catch (err) {
            console.error(err);
            alert('Xảy ra lỗi khi hoàn tất giao dịch.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <StepIndicator currentStep={currentStep} totalSteps={3} stepNames={['Kiểm tra pin', 'Chọn pin mới', 'Thanh toán']} />
            {currentStep === 1 && <CheckReturnedBattery appointment={appointment} onNext={handleNextStep1} onCancel={handleCancel} />}
            {currentStep === 2 && <ConfirmBatterySwap appointment={appointment} onNext={handleNextStep2} onBack={() => setCurrentStep(1)} stationId={appointment?.stationId} />}
            {currentStep === 3 && <ProcessPayment appointment={appointment} swapData={{ inspection: inspectionData, newBattery: swapBatteryData?.newBattery }} onComplete={handleCompletePayment} onBack={() => setCurrentStep(2)} />}
        </div>
    );
};

export default SwapProcessManager;
