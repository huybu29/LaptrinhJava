package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Vehicle;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDriver_Id(Long driverId);
    boolean existsByVin(String vin);
}