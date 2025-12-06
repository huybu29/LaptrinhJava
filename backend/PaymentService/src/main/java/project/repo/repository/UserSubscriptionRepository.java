  package project.repo.repository;


  import org.springframework.data.jpa.repository.JpaRepository;
  import project.repo.entity.*;
  import java.util.List;
  import project.repo.entity.UserSubscription.SubscriptionStatus;;
  public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
     
      UserSubscription findByUserIdAndStatus(Long userId, SubscriptionStatus status);

  }
