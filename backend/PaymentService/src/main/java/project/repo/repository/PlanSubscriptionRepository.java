package project.repo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.*;
import java.util.List;

public interface PlanSubscriptionRepository extends JpaRepository<PlanSubscription, Long> {
    
}
