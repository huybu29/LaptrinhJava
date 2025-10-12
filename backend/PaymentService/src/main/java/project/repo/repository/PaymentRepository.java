package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Payment;
import java.util.List;
import java.util.Optional;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
  List<Payment> findByUserID(Long userID);
  
}
