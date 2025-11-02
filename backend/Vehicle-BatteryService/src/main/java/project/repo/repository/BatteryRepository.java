package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.repo.entity.Battery;
import java.util.List;
import java.util.Optional;

public interface BatteryRepository extends JpaRepository<Battery, Long> {
    
    // Đếm số pin đang sử dụng bởi một xe
    long countByVehicleIdAndStatus(Long vehicleId, Battery.BatteryStatus status);
    
    // Tìm pin đang sử dụng bởi xe
    Optional<Battery> findByVehicleIdAndStatus(Long vehicleId, Battery.BatteryStatus status);
    
    // Tìm pin theo trạm và trạng thái
    List<Battery> findByStationIdAndStatus(Long stationId, Battery.BatteryStatus status);
    
    // Tìm pin sẵn sàng để sử dụng tại trạm
    @Query("SELECT b FROM Battery b WHERE b.stationId = :stationId AND b.status = 'AVAILABLE' AND b.chargeCycles < b.maxChargeCycles AND b.soh >= 70.0")
    List<Battery> findAvailableBatteriesAtStation(Long stationId);
    
    // Tìm pin cần bảo trì (vượt quá chu kỳ sạc)
    List<Battery> findByChargeCyclesGreaterThanEqual(Integer maxChargeCycles);
}