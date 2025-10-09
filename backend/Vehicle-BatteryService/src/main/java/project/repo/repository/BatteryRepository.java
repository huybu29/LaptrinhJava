package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.repo.entity.Battery;

public interface BatteryRepository extends JpaRepository<Battery, Long> {
  
}
