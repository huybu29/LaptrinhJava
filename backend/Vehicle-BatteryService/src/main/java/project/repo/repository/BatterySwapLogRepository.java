package project.repo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.BatterySwapLog;
import project.repo.dtos.SwapRequest;
import project.repo.dtos.BatterySwapResponse;

import java.util.List;
public interface BatterySwapLogRepository extends JpaRepository<BatterySwapLog, Long> {
    List<BatterySwapLog> findByVehicleIdOrderBySwapTimeDesc(Long vehicleId);
    List<BatterySwapLog> findByStationIdOrderBySwapTimeDesc(Long stationId);
    List<BatterySwapLog> findByVehicleId(Long vehicleId);
}