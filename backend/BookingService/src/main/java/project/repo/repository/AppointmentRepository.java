package project.repo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Appointment;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByVehicleId(Long vehicleId);
    List<Appointment> findByStatus(String status);
}
