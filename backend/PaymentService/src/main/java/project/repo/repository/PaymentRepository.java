package project.repo.repository;
// package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Payment;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserID(Long userId);

    boolean existsByBookingID(Long bookingID);
}