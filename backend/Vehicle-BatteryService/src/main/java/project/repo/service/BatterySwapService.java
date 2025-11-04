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
import project.repo.mapper.BatterySwapMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BatterySwapService {

    private final BatteryRepository batteryRepository;
    private final VehicleRepository vehicleRepository;
    private final BatterySwapLogRepository batterySwapLogRepository;
    private final BatterySwapMapper batterySwapMapper; 
    // 🔹 Thực hiện đổi pin
    public BatterySwapResponse swapBattery(SwapRequest request) {

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        Battery newBattery = batteryRepository.findById(request.getNewBatteryId())
                .orElseThrow(() -> new IllegalArgumentException("New battery not found"));

        if (newBattery.getStatus() != Battery.BatteryStatus.AVAILABLE) {
            throw new IllegalStateException("New battery is not available. Current status: " + newBattery.getStatus());
        }

        if (!newBattery.getStationId().equals(request.getStationId())) {
            throw new IllegalStateException("New battery does not belong to the specified station");
        }

        Battery oldBattery = null;
        if (request.getOldBatteryId() != null) {
            oldBattery = batteryRepository.findById(request.getOldBatteryId())
                    .orElseThrow(() -> new IllegalArgumentException("Old battery not found"));

            if (!request.getVehicleId().equals(oldBattery.getVehicleId())) {
                throw new IllegalStateException("Old battery is not attached to this vehicle");
            }

            if (oldBattery.getStatus() != Battery.BatteryStatus.IN_USE) {
                throw new IllegalStateException("Old battery is not currently in use");
            }
        }

        // 🔸 Cập nhật pin cũ
        if (oldBattery != null) {
            oldBattery.setStatus(Battery.BatteryStatus.CHARGING);
            oldBattery.setVehicleId(null);
            oldBattery.setLastUsedAt(LocalDateTime.now());
            batteryRepository.save(oldBattery);
        }

        // 🔸 Cập nhật pin mới
        newBattery.setStatus(Battery.BatteryStatus.IN_USE);
        newBattery.setVehicleId(request.getVehicleId());
        newBattery.setStationId(null);
        newBattery.setLastUsedAt(LocalDateTime.now());
        newBattery.incrementChargeCycle();
        batteryRepository.save(newBattery);

        // 🔸 Cập nhật xe
        vehicle.setCurrentBatteryId(newBattery.getId()); // đảm bảo Vehicle có field này
        vehicleRepository.save(vehicle);

        // 🔸 Lưu log đổi pin
        BatterySwapLog log = BatterySwapLog.builder()
                .vehicleId(request.getVehicleId())
                .oldBatteryId(oldBattery != null ? oldBattery.getId() : null)
                .newBatteryId(newBattery.getId())
                .stationId(request.getStationId())
                .swapTime(LocalDateTime.now())
                .staffId(request.getStaffId())
                .notes(request.getNotes())
                .build();
        batterySwapLogRepository.save(log);

        // 🔸 Trả về kết quả qua mapper
        return batterySwapMapper.toResponse(log);
    }

    // 🔹 Kiểm tra khả năng đổi pin
    public boolean canSwapBattery(Long vehicleId, Long newBatteryId) {
        Battery newBattery = batteryRepository.findById(newBatteryId)
                .orElseThrow(() -> new IllegalArgumentException("Battery not found"));

        if (!newBattery.isAvailableForUse()) return false;

        long inUseCount = batteryRepository.countByVehicleIdAndStatus(
                vehicleId, Battery.BatteryStatus.IN_USE);

        return inUseCount == 0;
    }

    // 🔹 Lấy pin hiện tại của xe
    public Battery getCurrentBattery(Long vehicleId) {
        return batteryRepository.findByVehicleIdAndStatus(vehicleId, Battery.BatteryStatus.IN_USE)
                .orElse(null);
    }

    // 🔹 Lịch sử đổi pin
    public List<BatterySwapResponse> getSwapHistoryByVehicle(Long vehicleId) {
        List<BatterySwapLog> logs = batterySwapLogRepository.findByVehicleId(vehicleId);
        return logs.stream()
                .map(batterySwapMapper::toResponse)
                .collect(Collectors.toList());
    }
}
