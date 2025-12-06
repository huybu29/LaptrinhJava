package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.repo.entity.Battery;

import java.util.List;
import java.util.Optional;

import java.util.List;
public interface BatteryRepository extends JpaRepository<Battery, Long> {


    Long countByVehicleIdAndStatus(Long vehicleId, Battery.BatteryStatus status);

    
    Optional<Battery> findByVehicleIdAndStatus(Long vehicleId, Battery.BatteryStatus status);

    List<Battery> findByStationIdAndStatus(Long stationId, Battery.BatteryStatus status);

   
    Long countByStationIdAndStatus(Long stationId, Battery.BatteryStatus status);
  
  List<Battery> findByStationId(Long stationId);
  List<Battery> findByStatus(Battery.BatteryStatus status);
  Optional<Battery> findByVehicleId(Long vehicleId);
  
}
