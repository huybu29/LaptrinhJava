package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.repo.entity.Battery;

import java.util.List;
import java.util.Optional;

public interface BatteryRepository extends JpaRepository<Battery, Long> {


    Long countByVehicleIdAndStatus(Long vehicleId, Battery.BatteryStatus status);

    
    Optional<Battery> findByVehicleIdAndStatus(Long vehicleId, Battery.BatteryStatus status);

    List<Battery> findByStationIdAndStatus(Long stationId, Battery.BatteryStatus status);

    @Query("""
        SELECT b FROM Battery b 
        WHERE b.stationId = :stationId 
          AND b.status = project.repo.entity.Battery.BatteryStatus.AVAILABLE
          AND b.chargeCycles < b.maxChargeCycles 
          AND b.soh >= 70.0
    """)
    List<Battery> findAvailableBatteriesAtStation(@Param("stationId") Long stationId);

   
    List<Battery> findByChargeCyclesGreaterThanEqual(Integer maxChargeCycles);
}
