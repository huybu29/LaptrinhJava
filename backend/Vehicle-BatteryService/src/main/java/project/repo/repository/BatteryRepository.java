package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.repo.entity.Battery;
import java.util.List;
public interface BatteryRepository extends JpaRepository<Battery, Long> {
  List<Battery> findByStationIdAndStatus(Long stationId, String status);
}
