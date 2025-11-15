package project.repo.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import project.repo.mapper.BatteryMapper;
import project.repo.repository.BatteryRepository;
import project.repo.dtos.BatteryDTO;
import project.repo.entity.Battery;

@Service
@RequiredArgsConstructor
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
        
        // Set default values
        if (battery.getChargeCycles() == null) {
            battery.setChargeCycles(0);
        }
        if (battery.getMaxChargeCycles() == null) {
            battery.setMaxChargeCycles(2000);
        }
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
        // Kiểm tra tồn tại trước khi update
        Battery existing = batteryRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Battery not found"));
        
        Battery updated = batteryMapper.toBattery(dto);
        
        // Kiểm tra ràng buộc: nếu chargeCycles vượt max, chuyển sang MAINTENANCE
        if (updated.getChargeCycles() >= updated.getMaxChargeCycles()) {
            updated.setStatus(Battery.BatteryStatus.MAINTENANCE);
        }
        
        return batteryMapper.toDTO(batteryRepository.save(updated));
    }
    
    public void deleteBattery(Long id){
        Battery battery = batteryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Battery not found"));
        
        // Ràng buộc: không thể xóa pin đang được sử dụng
        if (battery.getStatus() == Battery.BatteryStatus.IN_USE) {
            throw new RuntimeException("Cannot delete battery that is in use");
        }
        
        batteryRepository.deleteById(id);
    }
    
    // Method mới: Lấy pin sẵn sàng tại trạm
    public List<BatteryDTO> getAvailableBatteriesAtStation(Long stationId) {
        return batteryRepository.findAvailableBatteriesAtStation(stationId)
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
    
    return batteryRepository.findByStationIdAndStatus(stationId, Battery.BatteryStatus.AVAILABLE).stream().count();
}
}
