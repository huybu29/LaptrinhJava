package project.repo.repository;
import project.repo.entity.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BatteryPackageRepository extends JpaRepository<BatteryPackage, Long> {
  List<BatteryPackage> findByUserId(Long userId);
}