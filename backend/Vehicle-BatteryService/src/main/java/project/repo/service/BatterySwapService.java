package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.entity.Battery;
import project.repo.entity.BatterySwapLog;
import project.repo.entity.Vehicle;
import project.repo.repository.BatteryRepository;
import project.repo.repository.BatterySwapLogRepository;
import project.repo.repository.VehicleRepository;
import project.repo.dtos.SwapRequest;
import project.repo.dtos.BatterySwapResponse;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class BatterySwapService {
    
    private final BatteryRepository batteryRepository;
    private final VehicleRepository vehicleRepository;
    private final BatterySwapLogRepository batterySwapLogRepository;
    
    @Transactional
    public BatterySwapResponse swapBattery(SwapRequest request) {
        // Kiểm tra xe tồn tại
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        // Kiểm tra pin mới
        Battery newBattery = batteryRepository.findById(request.getNewBatteryId())
                .orElseThrow(() -> new RuntimeException("New battery not found"));
        
        // Ràng buộc: Pin mới phải có status = AVAILABLE
        if (newBattery.getStatus() != Battery.BatteryStatus.AVAILABLE) {
            throw new RuntimeException("New battery is not available. Current status: " + newBattery.getStatus());
        }
        
        // Ràng buộc: Pin mới phải thuộc trạm được chỉ định
        if (!newBattery.getStationId().equals(request.getStationId())) {
            throw new RuntimeException("New battery does not belong to the specified station");
        }
        
        // Tìm pin cũ đang sử dụng (nếu có)
        Battery oldBattery = null;
        if (request.getOldBatteryId() != null) {
            oldBattery = batteryRepository.findById(request.getOldBatteryId())
                    .orElseThrow(() -> new RuntimeException("Old battery not found"));
            
            // Ràng buộc: Pin cũ phải đang gắn với xe này
            if (!oldBattery.getVehicleId().equals(request.getVehicleId())) {
                throw new RuntimeException("Old battery is not attached to this vehicle");
            }
            
            // Ràng buộc: Pin cũ phải có status = IN_USE
            if (oldBattery.getStatus() != Battery.BatteryStatus.IN_USE) {
                throw new RuntimeException("Old battery is not in use");
            }
        }
        
        // Thực hiện đổi pin
        if (oldBattery != null) {
            // Cập nhật pin cũ: CHARGING và không gắn xe
            oldBattery.setStatus(Battery.BatteryStatus.CHARGING);
            oldBattery.setVehicleId(null);
            oldBattery.setLastUsedAt(LocalDateTime.now());
            batteryRepository.save(oldBattery);
        }
        
        // Cập nhật pin mới: IN_USE và gắn xe
        newBattery.setStatus(Battery.BatteryStatus.IN_USE);
        newBattery.setVehicleId(request.getVehicleId());
        newBattery.setStationId(null); // Pin đã ra khỏi trạm
        newBattery.setLastUsedAt(LocalDateTime.now());
        newBattery.incrementChargeCycle(); // Tăng chu kỳ sạc
        batteryRepository.save(newBattery);
        
        // Ghi log đổi pin
        BatterySwapLog log = BatterySwapLog.builder()
                .vehicleId(request.getVehicleId())
                .oldBatteryId(request.getOldBatteryId())
                .newBatteryId(request.getNewBatteryId())
                .stationId(request.getStationId())
                .swapTime(LocalDateTime.now())
                .notes(request.getNotes())
                .build();
        batterySwapLogRepository.save(log);
        
        return BatterySwapResponse.builder()
                .success(true)
                .message("Battery swapped successfully")
                .oldBatteryId(oldBattery != null ? oldBattery.getId() : null)
                .newBatteryId(newBattery.getId())
                .swapTime(LocalDateTime.now())
                .build();
    }
    
    // Kiểm tra xe có thể đổi pin không
    public boolean canSwapBattery(Long vehicleId, Long newBatteryId) {
        try {
            Battery newBattery = batteryRepository.findById(newBatteryId)
                    .orElseThrow(() -> new RuntimeException("Battery not found"));
            
            // Kiểm tra pin mới có sẵn sàng sử dụng không
            if (!newBattery.isAvailableForUse()) {
                return false;
            }
            
            // Kiểm tra xe không có pin nào khác đang IN_USE
            long inUseBatteries = batteryRepository.countByVehicleIdAndStatus(
                    vehicleId, Battery.BatteryStatus.IN_USE);
            
            return inUseBatteries == 0;
            
        } catch (Exception e) {
            return false;
        }
    }
    
    // Lấy pin đang sử dụng của xe
    public Battery getCurrentBattery(Long vehicleId) {
        return batteryRepository.findByVehicleIdAndStatus(vehicleId, Battery.BatteryStatus.IN_USE)
                .orElse(null);
    }
}
