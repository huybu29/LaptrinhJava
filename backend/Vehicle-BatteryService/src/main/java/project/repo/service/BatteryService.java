package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import project.repo.dtos.BatteryDTO;
import project.repo.entity.Battery;
import project.repo.mapper.BatteryMapper;
import project.repo.repository.BatteryRepository;

@Service
@RequiredArgsConstructor
@Slf4j // Để sử dụng log
public class BatteryService {

    private final BatteryRepository batteryRepository;
    private final BatteryMapper batteryMapper;
    
    public List<BatteryDTO> getAllBattery(){
        return batteryRepository.findAll().stream()
                .map(batteryMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public BatteryDTO createBattery(BatteryDTO dto){
        Battery battery = batteryMapper.toBattery(dto);
        
        // Set default values nếu null
        if (battery.getStatus() == null) {
            battery.setStatus(Battery.BatteryStatus.AVAILABLE);
        }
        
        
        return batteryMapper.toDTO(batteryRepository.save(battery));
    }
    
    public BatteryDTO getBatteryById(Long id){
        return batteryRepository.findById(id)
                .map(batteryMapper::toDTO)
                .orElse(null);
    }
    
    public BatteryDTO updateBattery(BatteryDTO dto){
        Battery existing = batteryRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Battery not found"));
        
        // Map các trường cần update từ DTO sang Entity
        // Lưu ý: Không dùng mapper đè trực tiếp nếu muốn giữ lại các trường cũ không có trong DTO
        Battery updated = batteryMapper.toBattery(dto);
        
        // Giữ lại các giá trị quan trọng nếu DTO gửi lên null (tuỳ logic mapper của bạn)
        // Ví dụ: updated.setCreatedAt(existing.getCreatedAt());

        return batteryMapper.toDTO(batteryRepository.save(updated));
    }
    
    public void deleteBattery(Long id){
        Battery battery = batteryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Battery not found"));
        
        if (battery.getStatus() == Battery.BatteryStatus.IN_USE) {
            throw new RuntimeException("Cannot delete battery that is in use");
        }
        
        batteryRepository.deleteById(id);
    }
    
    public List<BatteryDTO> getAvailableBatteriesAtStation(Long stationId) {
        // Cần đảm bảo Repository có hàm này hoặc dùng findByStationIdAndStatus
        return batteryRepository.findByStationIdAndStatus(stationId, Battery.BatteryStatus.AVAILABLE)
                .stream()
                .map(batteryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public BatteryDTO getBatteryByVehicleId(Long vehicleId) {
        return batteryRepository.findByVehicleId(vehicleId)
                .map(batteryMapper::toDTO)
                .orElse(null);
    }

    public Long countAvailableBatteriesAtStation(Long stationId) {
        return batteryRepository.countByStationIdAndStatus(stationId, Battery.BatteryStatus.AVAILABLE);
    }

    public List<BatteryDTO> getBatteriesByStationId(Long stationId) {
        return batteryRepository.findByStationId(stationId)
                .stream()
                .map(batteryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BatteryDTO> getBatteriesByStationIdAndStatus(Long stationId, Battery.BatteryStatus status) {
        return batteryRepository.findByStationIdAndStatus(stationId, status)
                .stream()
                .map(batteryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Hàm update trạng thái (Được gọi từ PaymentService)
    public BatteryDTO updateBatteryStatus(Long batteryId, String statusStr, Long stationId, Long vehicleId) {
        Battery battery = batteryRepository.findById(batteryId)
                .orElseThrow(() -> new RuntimeException("Battery not found"));
        
        Battery.BatteryStatus status = Battery.BatteryStatus.valueOf(statusStr);
        battery.setStatus(status);
        
        // Logic gán trạm / xe
        if (stationId != null) battery.setStationId(stationId);
        else if (status == Battery.BatteryStatus.IN_USE) battery.setStationId(null);
        
        if (vehicleId != null) battery.setVehicleId(vehicleId);
        else if (status == Battery.BatteryStatus.CHARGING || status == Battery.BatteryStatus.AVAILABLE) battery.setVehicleId(null);

        return batteryMapper.toDTO(batteryRepository.save(battery));
    }

    // --- GIẢ LẬP SẠC PIN ---
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void simulateChargingProcess() {
        List<Battery> chargingBatteries = batteryRepository.findByStatus(Battery.BatteryStatus.CHARGING);

        // Thêm log để biết hàm có chạy không
        System.out.println("--- Đang quét pin sạc: Tìm thấy " + chargingBatteries.size() + " cục ---");

        for (Battery bat : chargingBatteries) {
            float currentSoh = bat.getSoh(); // Lấy SOH hiện tại
            
            // Tăng %
            float increase = 5.0f + new Random().nextFloat() * 5.0f;
            float newSoh = currentSoh + increase;

            if (newSoh >= 100.0f) {
                bat.setSoh(100.0f);
                bat.setStatus(Battery.BatteryStatus.AVAILABLE);
                System.out.println("Pin " + bat.getId() + " đầy.");
            } else {
                bat.setSoh(newSoh); // <--- QUAN TRỌNG: Phải setSoh
                System.out.println("Pin " + bat.getId() + " sạc lên: " + newSoh + "%");
            }
        }
        
        batteryRepository.saveAll(chargingBatteries); // <--- QUAN TRỌNG: Phải lưu
    }
    @Scheduled(fixedRate = 20000)
    @Transactional
    public void simulateUsageProcess() {
        // 1. Tìm tất cả pin đang được sử dụng (trên xe)
        List<Battery> inUseBatteries = batteryRepository.findByStatus(Battery.BatteryStatus.IN_USE);

        if (inUseBatteries.isEmpty()) return;

        log.info("System: Đang xả pin cho {} xe đang chạy...", inUseBatteries.size());

        for (Battery bat : inUseBatteries) {
            // Lấy % pin hiện tại
            float currentSoh = bat.getSoh() < 0 ? 0 : bat.getSoh();

            // Nếu pin đã cạn (0%) thì không giảm nữa
            if (currentSoh <= 0.0f) {
                continue;
            }

            // Giảm ngẫu nhiên từ 1% đến 3%
            float decrease = 1.0f + new Random().nextFloat() * 2.0f;
            float newSoh = currentSoh - decrease;

            // Cập nhật trạng thái
            if (newSoh <= 0.0f) {
                bat.setSoh(0.0f);
                log.warn("⚠️ Pin ID {} (Code: {}) đã cạn sạch (0%) trên đường!", bat.getId(), bat.getBatteryCode());
            } else {
                bat.setSoh(newSoh);
                // log.debug("Pin {} đang chạy: còn {}%", bat.getId(), String.format("%.1f", newSoh));
            }
            
            // Cập nhật thời gian sử dụng lần cuối
            bat.setLastUsedAt(LocalDateTime.now());
        }

        // Lưu cập nhật vào DB
        batteryRepository.saveAll(inUseBatteries);
    }
}