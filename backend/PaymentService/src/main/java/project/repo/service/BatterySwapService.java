package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.*;
import project.repo.entity.*;
import project.repo.mapper.BatterySwapMapper;
import project.repo.repository.*;
import project.repo.clients.BatteryClient;
import java.util.List;
import java.util.stream.Collectors;
import project.repo.service.PaymentService;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BatterySwapService {

    private final BatteryClient batteryClient;
    private final BatterySwapRepository batterySwapRepo;
    private final BatterySwapMapper batterySwapMapper;
    private final PaymentRepository paymentRepo;
    
    @Transactional
    public BatterySwapDTO createSwap(BatterySwapDTO dto) {
        BatterySwap entity = batterySwapMapper.toEntity(dto);
        BatterySwap saved = batterySwapRepo.save(entity);
        return batterySwapMapper.toDTO(saved);
    }

    public BatterySwapDTO getSwapById(Long id) {
        BatterySwap entity = batterySwapRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap not found"));
        return batterySwapMapper.toDTO(entity);
    }

    public List<BatterySwapDTO> getSwapsByUser(Long userId) {
        List<BatterySwap> swaps = batterySwapRepo.findByUserId(userId);
        return swaps.stream()
                .map(batterySwapMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BatterySwapDTO updateSwap(Long id, BatterySwapDTO dto) {
        BatterySwap existing = batterySwapRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Swap not found"));

        BatterySwap updated = batterySwapMapper.toEntity(dto);
        updated.setId(existing.getId()); // giữ id
        BatterySwap saved = batterySwapRepo.save(updated);
        return batterySwapMapper.toDTO(saved);
    }

    @Transactional
    public void deleteSwap(Long id) {
        batterySwapRepo.deleteById(id);
    }
   @Transactional
    public BatterySwapDTO executePhysicalSwap(BatterySwapDTO req) {
        if (req.getNewBatteryId() == null) {
            throw new IllegalArgumentException("Lỗi: Chưa chọn pin mới (newBatteryId is null)");
        }
        if (req.getOldBatteryId() == null) {
            throw new IllegalArgumentException("Lỗi: Không tìm thấy ID pin cũ (oldBatteryId is null). Vui lòng kiểm tra request.");
        }
        BatteryDTO oldBat = batteryClient.getBatteryById(req.getOldBatteryId());
        BatteryDTO newBat = batteryClient.getBatteryById(req.getNewBatteryId());

        // Update Pin cũ: Về trạm, Bảo trì
        batteryClient.updateBatteryStatus(oldBat.getId(), "CHARGING", req.getStationId(), null);
        // Update Pin mới: Lên xe, Đang dùng
        batteryClient.updateBatteryStatus(newBat.getId(), "IN_USE", null, oldBat.getVehicleId());

        // 2. LƯU LOG KỸ THUẬT (BatterySwap)
        BatterySwap log = BatterySwap.builder()
                .userId(req.getUserId())
                .vehicleId(oldBat.getVehicleId())
                .stationId(req.getStationId())
                .staffId(req.getStaffId())
                .oldBatteryId(oldBat.getId())
                .newBatteryId(newBat.getId())
                .swapTime(LocalDateTime.now())
                .notes("Đổi pin hoàn tất, chờ thanh toán")
                .build();
        BatterySwap savedLog = batterySwapRepo.save(log);

        // 3. TẠO PAYMENT (PENDING)
        // Lưu ý: Chưa chốt giá tiền ở đây, hoặc đặt giá mặc định
        Payment payment = Payment.builder()
                .userID(req.getUserId())
                .bookingID(req.getAppointmentId())
                .stationId(req.getStationId())
                .swapId(savedLog.getId())
                .amount(35000) // Giá niêm yết tạm tính
                .status(Payment.PaymentStatus.PENDING) // Quan trọng: Đang chờ
                .invoiceNumber("INV-" + System.currentTimeMillis())
                .createdAt(LocalDateTime.now())
                .build();
        
        paymentRepo.save(payment);

        // Trả về DTO có chứa paymentId để Frontend gọi bước 2
        BatterySwapDTO dto = batterySwapMapper.toDTO(savedLog);
        dto.setPaymentId(payment.getPaymentID());
        return dto;
    }
}
