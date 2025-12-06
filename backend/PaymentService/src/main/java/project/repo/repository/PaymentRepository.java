package project.repo.repository;
// package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Payment;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPaymentID(Long paymentID);
    List<Payment> findByUserID(Long userId);
    List<Payment> findByStationIdAndStatus(Long stationId, Payment.PaymentStatus status);
    boolean existsByBookingID(Long bookingID);
}