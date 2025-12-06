package project.repo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.*;
import java.util.List;

public interface BatterySwapRepository extends JpaRepository<BatterySwap, Long> {
    List<BatterySwap> findByUserId(Long userId);
}
